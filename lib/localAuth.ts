export const LOCAL_AUTH_COOKIE = "edwin_local_session";

export type LocalAuthUser = {
  email: string;
  name: string;
};

function isDevLocalAuthBypassEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.EDWIN_AUTH_MODE !== "supabase"
  );
}

export function isLocalAuthEnabled() {
  return process.env.EDWIN_AUTH_MODE === "local" || isDevLocalAuthBypassEnabled();
}

export function acceptsAnyLocalCredentials() {
  return isDevLocalAuthBypassEnabled() && !isLocalAuthConfigured();
}

export function getLocalAuthCredentials() {
  const email = process.env.EDWIN_ADMIN_EMAIL?.trim() ?? "";
  const password = process.env.EDWIN_ADMIN_PASSWORD ?? "";
  const name = process.env.EDWIN_ADMIN_NAME?.trim() || "EDwin Admin";

  return { email, password, name };
}

export function getLocalSessionValue() {
  return (
    process.env.EDWIN_AUTH_SECRET ||
    process.env.EDWIN_ADMIN_PASSWORD ||
    "edwin-dev-local-session"
  );
}

export function isLocalAuthConfigured() {
  const credentials = getLocalAuthCredentials();

  return Boolean(credentials.email && credentials.password && getLocalSessionValue());
}

export function isValidLocalSession(value?: string | null) {
  return isLocalAuthEnabled() && Boolean(value && value === getLocalSessionValue());
}

export function getLocalAuthUser(): LocalAuthUser {
  const credentials = getLocalAuthCredentials();

  return {
    email: credentials.email || "local-admin@edwin.dev",
    name: credentials.name,
  };
}
