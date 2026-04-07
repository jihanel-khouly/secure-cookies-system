export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL safely (no crashes if env is missing)
export const getLoginUrl = () => {
  const oauthPortalUrl =
    import.meta.env.VITE_OAUTH_PORTAL_URL || "http://localhost:3000";

  const appId = import.meta.env.VITE_APP_ID || "demo-app";

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  try {
    const url = new URL(`${oauthPortalUrl}/app-auth`);

    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch (error) {
    console.error("Invalid OAuth URL:", error);

    // fallback (prevents crash)
    return `${oauthPortalUrl}/app-auth`;
  }
};