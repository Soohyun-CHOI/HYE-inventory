/**
 * Placeholder auth helper. Replace the body of getUserFromRequest once an
 * auth provider (Supabase Auth, Firebase Auth, Clerk, ...) is chosen — it
 * should verify the request's session/JWT and return the user + role.
 *
 * Roles: 'admin' | 'operator' | 'viewer'
 * - admin: full access, including catalog/user management
 * - operator: can create orders/receipts/issues
 * - viewer: read-only
 */

export async function getUserFromRequest(req) {
    // TODO: verify the auth token from req.headers.authorization (or a cookie)
    // against the chosen auth provider, then return the real user.
    // Throwing here means "not authenticated" — callers should catch and 401.
    throw new Error("Auth provider not configured yet");
}

export function requireRole(user, allowedRoles) {
    if (!allowedRoles.includes(user.role)) {
        const err = new Error(`Requires one of roles: ${allowedRoles.join(', ')}`);
        err.status = 403;
        throw err;
    }
}
