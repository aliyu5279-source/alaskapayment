import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
export default function App() {
    const [session, setSession] = useState(null);
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setSession(data.session));
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
        return () => listener.subscription.unsubscribe();
    }, []);
    return session ? _jsx(Dashboard, {}) : _jsx(Auth, {});
}
