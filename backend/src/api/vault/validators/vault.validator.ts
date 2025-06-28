import { Context } from "hono";

/**
 * Validates the address query parameter for vault endpoints
 * @param userAddress - The address to validate (can be undefined)
 * @returns Array of validation errors
 */
export const validateAddressQueryParameter = (
  userAddress: string | undefined
): string[] => {
  const errors: string[] = [];

  if (!userAddress) {
    errors.push("userAddress query parameter is required in params");
    return errors;
  }

  // Validate EVM address format
  if (!userAddress.startsWith("0x") || userAddress.length !== 42) {
    errors.push(
      "Invalid EVM address format. Address must start with '0x' and be 42 characters long"
    );
  }

  // Additional validation: check if it's a valid hex string
  const hexRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!hexRegex.test(userAddress)) {
    errors.push(
      "Invalid EVM address. Address must be a valid hexadecimal string"
    );
  }

  return errors;
};

/**
 * Validates address and returns error response if validation fails
 * @param c - Hono context
 * @param userAddress - The address to validate
 * @returns Object with isValid flag and validated address or error response
 */
export const validateAddressAndReturnResponse = (
  c: Context,
  userAddress: string | undefined
):
  | { isValid: true; address: string }
  | { isValid: false; response: Response } => {
  const validationErrors = validateAddressQueryParameter(userAddress);

  if (validationErrors.length > 0) {
    return {
      isValid: false,
      response: c.json(
        {
          status: "error",
          message:
            validationErrors.length === 1
              ? validationErrors[0]
              : "Multiple validation errors occurred",
          errors: validationErrors,
          userAddress,
        },
        400
      ),
    };
  }

  // At this point, userAddress is guaranteed to be defined and valid
  return {
    isValid: true,
    address: userAddress as string,
  };
};
