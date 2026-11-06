"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { VoterProfile } from "@/types/workspace";

export type VoterContextType = {
  voter: VoterProfile | null;
  isLoading: boolean;
  isModalOpen: boolean;
  setVoter: (profile: VoterProfile | null) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  resolveAnonymousVoter: (workspaceId: string) => Promise<VoterProfile | null>;
  clearVoter: () => void;
};

const VoterContext = createContext<VoterContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = "autoflow_voter_";

export type VoterProviderProps = {
  children: ReactNode;
  initialVoter?: VoterProfile | null;
};

export const VoterProvider = ({
  children,
  initialVoter = null,
}: VoterProviderProps): React.JSX.Element => {
  const [voter, setVoterState] = useState<VoterProfile | null>(initialVoter);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedItem = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}active`);
      if (storedItem) {
        const parsed = JSON.parse(storedItem) as VoterProfile;
        setVoterState(parsed);
      }
    } catch {
      // Local storage read failure fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setVoter = useCallback((profile: VoterProfile | null): void => {
    setVoterState(profile);
    try {
      if (profile) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}active`, JSON.stringify(profile));
      } else {
        localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}active`);
      }
    } catch {
      // Local storage persistence fallback
    }
  }, []);

  const clearVoter = useCallback((): void => {
    setVoter(null);
  }, [setVoter]);

  const resolveAnonymousVoter = useCallback(
    async (workspaceId: string): Promise<VoterProfile | null> => {
      try {
        const fingerprint = `anon-${Math.random().toString(36).substring(2, 12)}`;
        const response = await fetch("/api/v1/voter-profiles/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workspaceId,
            authType: "ANONYMOUS_FINGERPRINT",
            displayName: "Khach An Danh",
            fingerprintHash: fingerprint,
            customerTier: "standard",
            voteWeight: 1.0,
          }),
        });

        const result = (await response.json()) as {
          success: boolean;
          data?: VoterProfile;
        };

        if (response.ok && result.success && result.data) {
          setVoter(result.data);
          return result.data;
        }
        return null;
      } catch {
        return null;
      }
    },
    [setVoter]
  );

  return (
    <VoterContext.Provider
      value={{
        voter,
        isLoading,
        isModalOpen,
        setVoter,
        setIsModalOpen,
        resolveAnonymousVoter,
        clearVoter,
      }}
    >
      {children}
    </VoterContext.Provider>
  );
};

export const useVoter = (): VoterContextType => {
  const context = useContext(VoterContext);
  if (!context) {
    throw new Error("useVoter must be used within a VoterProvider");
  }
  return context;
};
