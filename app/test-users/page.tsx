import { cookies } from "next/headers";
import { getSupabaseConfig } from "@/utils/supabase/config";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function TestUsersPage() {
  if (!getSupabaseConfig()) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Supabase no está configurado</h1>
        <p>
          Agrega NEXT_PUBLIC_SUPABASE_URL y
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY o
          NEXT_PUBLIC_SUPABASE_ANON_KEY en las variables de entorno de Vercel.
        </p>
      </main>
    );
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("users")
    .select("id, name, created_at")
    .limit(10);

  if (error) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Error conectando con Supabase</h1>
        <pre>{error.message}</pre>
      </main>
    );
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Usuarios desde Supabase</h1>

      {data?.map((user) => (
        <div key={user.id}>
          <strong>{user.name}</strong>
          <br />
          <small>{user.created_at}</small>
        </div>
      ))}
    </main>
  );
}
