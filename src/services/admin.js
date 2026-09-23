import { supabase } from "../lib/supabase";

export async function getAdminUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      email,
      phone,
      department,
      student_id,
      role,
      avatar_url,
      created_at
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getAdminUserById(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      email,
      phone,
      department,
      student_id,
      role,
      avatar_url,
      created_at
    `,
    )
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
