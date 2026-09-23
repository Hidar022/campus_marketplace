import { supabase } from "../lib/supabase";

export async function getMyProfile(userId) {
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
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateMyProfile({
  userId,
  fullName,
  phone,
  department,
  studentId,
}) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone || null,
      department: department || null,
      student_id: studentId || null,
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
