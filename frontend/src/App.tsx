import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    console.log('✅ App mounted');
    document.body.insertAdjacentHTML('afterbegin', '<h1 style="color:red;text-align:center;">🚀 React Loaded Successfully!</h1>');
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => listener.subscription.unsubscribe();
  }, []);

  return session ? <Dashboard /> : <Auth />;
}
