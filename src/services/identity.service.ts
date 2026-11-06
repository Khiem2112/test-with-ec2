import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import type {
  VoterProfile,
  UserSession,
  ResolveVoterProfileInput,
} from "@/types/workspace";

// Hash token string using SHA-256 for secure session persistence
export const hashToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

// Generate device fingerprint SHA-256 hash with optional salt
export const hashFingerprint = (rawFingerprint: string, salt: string = ""): string => {
  return createHash("sha256").update(`${rawFingerprint}:${salt}`).digest("hex");
};

// Parse SSO JWT payload without external library dependencies
export const decodeSsoJwtPayload = (
  token: string,
): { sub: string; email?: string; name?: string } | null => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      return null;
    }
    const payloadBase64 = parts[1] ?? "";
    const decodedJson = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const parsed = JSON.parse(decodedJson) as Record<string, unknown>;
    if (typeof parsed.sub !== "string") {
      return null;
    }
    return {
      sub: parsed.sub,
      email: typeof parsed.email === "string" ? parsed.email : undefined,
      name: typeof parsed.name === "string" ? parsed.name : undefined,
    };
  } catch {
    return null;
  }
};

// Map Prisma voter profile record to strict domain model
const mapVoterProfileRecord = (record: {
  id: string;
  workspaceId: string;
  authType: "REGISTERED" | "SSO_IDENTIFIED" | "ANONYMOUS_FINGERPRINT";
  externalUserId: string | null;
  displayName: string;
  email: string | null;
  fingerprintHash: string | null;
  customerTier: string;
  voteWeight: Prisma.Decimal | number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): VoterProfile => {
  return {
    id: record.id,
    workspaceId: record.workspaceId,
    authType: record.authType,
    externalUserId: record.externalUserId,
    displayName: record.displayName,
    email: record.email,
    fingerprintHash: record.fingerprintHash,
    customerTier: record.customerTier,
    voteWeight: Number(record.voteWeight),
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

// Resolve or create voter profile across registered, SSO, and anonymous channels
export const resolveVoterProfile = async (
  input: ResolveVoterProfileInput,
): Promise<VoterProfile> => {
  const { workspaceId, authType, displayName, externalUserId, email, fingerprintHash, customerTier, voteWeight } = input;

  if (authType === "REGISTERED" || authType === "SSO_IDENTIFIED") {
    if (externalUserId) {
      const existing = await prisma.voterProfile.findUnique({
        where: {
          workspaceId_externalUserId: {
            workspaceId,
            externalUserId,
          },
        },
      });

      if (existing) {
        return mapVoterProfileRecord(existing);
      }
    }

    const created = await prisma.voterProfile.create({
      data: {
        workspaceId,
        authType,
        externalUserId: externalUserId ?? null,
        displayName,
        email: email ?? null,
        customerTier: customerTier ?? "standard",
        voteWeight: voteWeight ?? 1.0,
      },
    });

    return mapVoterProfileRecord(created);
  }

  // ANONYMOUS_FINGERPRINT path
  if (fingerprintHash) {
    const existing = await prisma.voterProfile.findFirst({
      where: {
        workspaceId,
        fingerprintHash,
        authType: "ANONYMOUS_FINGERPRINT",
      },
    });

    if (existing) {
      return mapVoterProfileRecord(existing);
    }
  }

  const createdAnonymous = await prisma.voterProfile.create({
    data: {
      workspaceId,
      authType: "ANONYMOUS_FINGERPRINT",
      fingerprintHash: fingerprintHash ?? null,
      displayName,
      email: email ?? null,
      customerTier: "standard",
      voteWeight: 1.0,
    },
  });

  return mapVoterProfileRecord(createdAnonymous);
};

// Persist user session with hashed token and expiration timestamp
export const createUserSession = async (
  userId: string,
  rawToken: string,
  expiresAt: Date,
  ipAddress?: string | null,
  userAgent?: string | null,
): Promise<UserSession> => {
  const tokenHash = hashToken(rawToken);

  const session = await prisma.userSession.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    },
  });

  return {
    id: session.id,
    userId: session.userId,
    tokenHash: session.tokenHash,
    ipAddress: session.ipAddress,
    userAgent: session.userAgent,
    expiresAt: session.expiresAt,
    createdAt: session.createdAt,
  };
};

export type SessionValidationResult = {
  isValid: boolean;
  session: UserSession | null;
  userId: string | null;
};

// Validate session token against database and verify expiration threshold
export const validateSession = async (
  rawToken: string,
): Promise<SessionValidationResult> => {
  const tokenHash = hashToken(rawToken);

  const session = await prisma.userSession.findUnique({
    where: { tokenHash },
  });

  if (!session) {
    return {
      isValid: false,
      session: null,
      userId: null,
    };
  }

  const now = new Date();
  if (session.expiresAt <= now) {
    return {
      isValid: false,
      session: null,
      userId: null,
    };
  }

  return {
    isValid: true,
    session: {
      id: session.id,
      userId: session.userId,
      tokenHash: session.tokenHash,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
    },
    userId: session.userId,
  };
};
