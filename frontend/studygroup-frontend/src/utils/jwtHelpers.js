// Lightweight, dependency-free JWT helpers

const decodeBase64Url = (input) => {
  try {
    // Replace URL-safe chars
    let base64 = input.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding if needed
    const padding = base64.length % 4;
    if (padding === 2) base64 += "==";
    else if (padding === 3) base64 += "=";
    else if (padding !== 0) return null;

    if (typeof window !== "undefined" && typeof window.atob === "function") {
      const decoded = window.atob(base64);
      try {
        // Handle UTF-8
        return decodeURIComponent(
          decoded
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
      } catch {
        return decoded;
      }
    }

    // Fallback for environments without atob
    if (typeof Buffer !== "undefined") {
      return Buffer.from(base64, "base64").toString("utf8");
    }

    return null;
  } catch {
    return null;
  }
};

export const decodeJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const payloadSegment = parts[1];
  const decoded = decodeBase64Url(payloadSegment);
  if (!decoded) return null;

  try {
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const getTokenExpirationDate = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return null;

  // exp is in seconds since epoch
  return new Date(payload.exp * 1000);
};

export const isTokenExpired = (token, options = {}) => {
  const { clockSkewSeconds = 30 } = options; // leeway for small clock differences

  const expirationDate = getTokenExpirationDate(token);
  if (!expirationDate) {
    // No exp means treat it as expired from a security perspective
    return true;
  }

  const now = new Date();
  const skewMs = clockSkewSeconds * 1000;
  return expirationDate.getTime() <= now.getTime() - skewMs;
};

export const getTokenClaim = (token, claimKey) => {
  const payload = decodeJwtPayload(token);
  if (!payload || !claimKey) return null;
  return payload[claimKey] ?? null;
};

export const getUserIdFromToken = (token, claimKey = "userId") =>
  getTokenClaim(token, claimKey);

export const getRoleFromToken = (token, claimKey = "role") =>
  getTokenClaim(token, claimKey);

export default {
  decodeJwtPayload,
  getTokenExpirationDate,
  isTokenExpired,
  getTokenClaim,
  getUserIdFromToken,
  getRoleFromToken,
};

 
