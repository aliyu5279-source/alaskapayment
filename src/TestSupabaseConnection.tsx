import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function TestSupabaseConnection() {
  const [status, setStatus] = useState("⏳ Testing connection...");

  useEffect(() => {
    async function checkConnection() {
      try {
        console.log("🔍 Testing Supabase connection...");
        const { data, error } = await supabase.from("orders").select("*").limit(1);
        if (error) throw error;
        console.log("✅ Supabase data:", data);
        setStatus("✅ Supabase connection successful!");
      } catch (err) {
        console.error("❌ Connection error:", err);
        setStatus("❌ Failed to fetch — check Supabase URL or key.");
      }
    }
    checkConnection();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🔍 Supabase Connection Test</h1>
      <p>{status}</p>
    </div>
  );
}
