import {createContext, useState, useEffect} from "react";

export const AuthContext = createContext(null);

// TODO: replace this placeholder with real sign-in once an auth provider
// (Supabase Auth, Firebase Auth, Clerk, ...) is chosen. Until then, every
// screen assumes a signed-out state and role-gated UI will stay hidden.
export function AuthProvider({children}) {
    const [user, setUser] = useState(null); // { name, email, role } | null
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // TODO: check for an existing session on mount.
    }, []);

    const value = {user, loading, setUser};
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
