/**
 * Detect if a string is a URL
 */
export const isURL = (str) => {
  if (!str) return false;

  // Remove any whitespace
  str = str.trim().toLowerCase();

  // Check common patterns
  const urlPatterns = [
    /^https?:\/\//,
    /^www\./,
    /\.(com|org|net|io|co|app|dev|me|info|biz|tv|uk|ca|au|in)$/i,
    /^@[\w\.]+$/, // Social media handles
    /^[\d\s\-\+\(\)]{10,}$/, // Phone numbers
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email
  ];

  return urlPatterns.some((pattern) => pattern.test(str));
};

/**
 * Get URL scheme for different platforms
 */
export const getURLScheme = (url, platform = "mobile") => {
  if (!url) return url;

  const lowerUrl = url.toLowerCase().trim();

  // Phone numbers
  if (/^[\d\s\-\+\(\)]{10,}$/.test(lowerUrl.replace(/[^\d\s\-\+\(\)]/g, ""))) {
    return `tel:${url.replace(/[^\d\+]/g, "")}`;
  }

  // Email
  if (lowerUrl.includes("@") && lowerUrl.includes(".")) {
    return `mailto:${url}`;
  }

  // Instagram
  if (lowerUrl.includes("instagram.com")) {
    const username = extractUsername(lowerUrl, "instagram.com");
    if (platform === "mobile" && username) {
      return `instagram://user?username=${username}`;
    }
  }

  // YouTube
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
    const videoId = extractYouTubeId(lowerUrl);
    if (platform === "mobile" && videoId) {
      return `vnd.youtube://watch?v=${videoId}`;
    }
  }

  // Facebook
  if (lowerUrl.includes("facebook.com")) {
    const username = extractUsername(lowerUrl, "facebook.com");
    if (platform === "mobile" && username) {
      return `fb://profile/${username}`;
    }
  }

  // Twitter/X
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) {
    const username =
      extractUsername(lowerUrl, "twitter.com") ||
      extractUsername(lowerUrl, "x.com");
    if (platform === "mobile" && username) {
      return `twitter://user?screen_name=${username}`;
    }
  }

  // LinkedIn
  if (lowerUrl.includes("linkedin.com")) {
    const profileId = extractLinkedInId(lowerUrl);
    if (platform === "mobile" && profileId) {
      return `linkedin://profile/${profileId}`;
    }
  }

  // Add https:// if missing for web URLs
  if (
    !lowerUrl.startsWith("http") &&
    !lowerUrl.startsWith("tel:") &&
    !lowerUrl.startsWith("mailto:")
  ) {
    return `https://${url}`;
  }

  return url;
};

/**
 * Extract username from social media URLs
 */
const extractUsername = (url, domain) => {
  const regex = new RegExp(`${domain.replace(".", "\\.")}/([^/?&]+)`);
  const match = url.match(regex);
  return match ? match[1].split("?")[0] : null;
};

const extractYouTubeId = (url) => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const extractLinkedInId = (url) => {
  const regex = /linkedin\.com\/in\/([^/?&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

/**
 * Get appropriate icon for URL type
 */
export const getURLIcon = (url) => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("instagram.com")) return "instagram";
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be"))
    return "youtube";
  if (lowerUrl.includes("facebook.com")) return "facebook";
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com"))
    return "twitter";
  if (lowerUrl.includes("linkedin.com")) return "linkedin";
  if (lowerUrl.startsWith("tel:")) return "phone";
  if (lowerUrl.startsWith("mailto:")) return "mail";
  if (lowerUrl.includes("maps.")) return "map";
  return "link";
};
