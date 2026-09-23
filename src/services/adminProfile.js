import { supabase } from "../lib/supabase";

/**
 * Get the currently logged-in admin's profile.
 */
export async function getAdminProfile(userId) {
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

/**
 * Update the currently logged-in admin's profile.
 */
export async function updateAdminProfile({
  userId,
  fullName,
  phone,
  department,
}) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName.trim(),
      phone: phone?.trim() || null,
      department: department?.trim() || null,
    })
    .eq("id", userId)
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
    .single();

  if (error) {
    throw error;
  }

  return data;
}
