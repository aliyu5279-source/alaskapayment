import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (!session) return <Auth onAuth={() => window.location.reload()} />;
  return <Dashboard />;
}
