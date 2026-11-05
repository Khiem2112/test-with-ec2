# TypeScript Commenting Guidelines: Good vs. Bad Practice

This reference demonstrates the standard commenting convention for the codebase:
- Rule: Write concise block comments explaining domain purpose, business rules, and algorithmic intent (the Why and What, not trivial syntax).
- Prohibitions:
  - Do NOT prefix comments with positional indicators or step numbers (no `// 1. ...`, `// Step X`, `// Part A`, `// Buoc 1`).
  - Do NOT write redundant comments that merely restate obvious TypeScript syntax (e.g., `// Call function`, `// Return result`, `// Check boolean`).
  - Do NOT write vague or meaningless comments (e.g., `// Do check`, `// Process data`).

---

### Bad Practice: Redundant Syntax Restatements, Step Numbering & Vague Comments

```typescript
// KHONG HOP LE: Chu thich danh so thu tu, lap lai cu phap hien nhien, thieu y nghia nghiep vu
export function validateGrounding(response: RagResponse, context: FullCustomerContext): GroundingResult {
  // 1. Check PII
  const piiViolations = detectPiiViolations(response.responseText);

  // 2. Check policy
  const policyViolations = checkVoucherPolicyViolations(response.responseText);

  // 3. Verify facts
  const ungroundedFacts = verifyFactGrounding(response.groundedFactsUsed, context.evidence.facts);

  // 4. Merge violations array
  const allViolations = [...piiViolations, ...policyViolations];

  // 5. Calculate score and validate
  const precision = calculateGroundingPrecision(response, ungroundedFacts, allViolations);
  const isGroundingValid = isSafeAndGrounded(allViolations, ungroundedFacts);

  // 6. Return object
  return {
    isValid: isGroundingValid,
    groundingPrecision: precision,
    violations: allViolations,
    sanitizedResponse: sanitizeResponseByGrounding(response, ungroundedFacts, isGroundingValid, precision),
  };
}
```

---

### Good Practice: Descriptive Block Comments Explaining Domain Intent & Rationale

```typescript
// HOP LE: Giai thich truc tiep muc tieu nghiep vu va dong co xu ly khong danh so thu tu
export function validateGrounding(response: RagResponse, context: FullCustomerContext): GroundingResult {
  // Validate text against sensitive PII exposure patterns (phone, email, payment cards)
  const piiViolations = detectPiiViolations(response.responseText);

  // Enforce marketplace voucher limits to prevent unauthorized compensation commitments
  const policyViolations = checkVoucherPolicyViolations(response.responseText);

  // Cross-reference referenced claim IDs against Layer 1-3 ground-truth evidence facts
  const ungroundedFacts = verifyFactGrounding(response.groundedFactsUsed, context.evidence.facts);

  const allViolations = [...piiViolations, ...policyViolations];

  // Evaluate precision score and downgrade action if grounding confidence is below threshold
  const precision = calculateGroundingPrecision(response, ungroundedFacts, allViolations);
  const isGroundingValid = isSafeAndGrounded(allViolations, ungroundedFacts);

  return {
    isValid: isGroundingValid,
    groundingPrecision: precision,
    violations: allViolations,
    sanitizedResponse: sanitizeResponseByGrounding(response, ungroundedFacts, isGroundingValid, precision),
  };
}
```

