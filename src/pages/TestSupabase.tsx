import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
export default function TestSupabase() {
  const [status, setStatus] = useState("⏳ Testing connection...");
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    async function testConnection() {
      console.log("🧩 Testing Supabase connection...");
      try {
        const { data, error } = await supabase
          .from("orders") // change to your actual table name if different
          .select("*")
          .limit(1);
        if (error) {
          console.error("❌ Error connecting:", error);
          setStatus("❌ Connection failed! Check Supabase URL or Key.");
        } else {
          console.log("✅ Connected successfully. Data:", data);
          setData(data);
          setStatus("✅ Supabase connection successful!");
        }
      } catch (err) {
        console.error("❌ Exception:", err);
        setStatus("❌ Failed to fetch. Check your Supabase URL or internet.");
      }
    }
    testConnection();
  }, []);
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>🧪 Supabase Connection Test</h1>
      <p>{status}</p>
      {data && (
        <pre
          style={{
            background: "#222",
            color: "#0f0",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}