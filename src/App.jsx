import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    async function testSupabase() {
      const { error } = await supabase.from("profiles").select("id").limit(1);

      if (error) {
        console.error("Supabase connection test:", error);
        return;
      }

      setConnected(true);
    }

    testSupabase();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Campus Marketplace
        </h1>

        <p className="mt-3 text-slate-600">
          {connected
            ? "Supabase connected successfully ✅"
            : "Connecting to Supabase..."}
        </p>
      </div>
    </main>
  );
}

export default App;
