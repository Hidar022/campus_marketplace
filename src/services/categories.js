import { supabase } from "../lib/supabase";

export async function getAdminCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      name,
      description,
      created_at,
      products (
        id
      )
    `,
    )
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createCategory({ name, description }) {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
    })
    .select(
      `
      id,
      name,
      description,
      created_at,
      products (
        id
      )
    `,
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCategory({ categoryId, name, description }) {
  const { data, error } = await supabase
    .from("categories")
    .update({
      name: name.trim(),
      description: description?.trim() || null,
    })
    .eq("id", categoryId)
    .select(
      `
      id,
      name,
      description,
      created_at,
      products (
        id
      )
    `,
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteCategory(categoryId) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    throw error;
  }
}
