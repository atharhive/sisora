// Convert 2-letter country code to Unicode Flag Emoji
export function getFlagEmoji(countryCode: string | null | undefined): string {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const code = countryCode.toUpperCase();
  const offset = 127397;
  return (
    String.fromCodePoint(code.charCodeAt(0) + offset) +
    String.fromCodePoint(code.charCodeAt(1) + offset)
  );
}

// Mask IP address for privacy while preserving geographical subnet context
export function maskIp(ip: string | null | undefined): string {
  if (!ip) return "Unknown IP";
  if (ip === "127.0.0.1" || ip === "::1") return "Localhost";
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***`;
  }
  return ip.slice(0, 8) + "...";
}
