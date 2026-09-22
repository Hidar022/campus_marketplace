import { supabase } from "../lib/supabase";

/**
 * Fetch active marketplace products.
 *
 * We also fetch:
 * - category information
 * - seller profile information
 *
 * This allows the marketplace UI to display
 * the product name, price, category and seller.
 */
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      description,
      price,
      condition,
      image_url,
      status,
      created_at,
      updated_at,
      category_id,
      seller_id,
      categories (
        id,
        name
      ),
      profiles!products_seller_id_fkey (
        id,
        full_name,
        department
      )
    `,
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Fetch all marketplace categories.
 */
export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, description")
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Fetch one product by ID.
 */
export async function getProductById(productId) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      description,
      price,
      condition,
      image_url,
      status,
      created_at,
      updated_at,
      category_id,
      seller_id,
      categories (
        id,
        name
      ),
      profiles!products_seller_id_fkey (
        id,
        full_name,
        email,
        phone,
        department
      )
    `,
    )
    .eq("id", productId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
