import { supabase } from "../lib/supabase";

const adminProductSelect = `
  id,
  seller_id,
  category_id,
  name,
  description,
  price,
  condition,
  image_url,
  status,
  created_at,
  updated_at,
  categories (
    id,
    name
  ),
  profiles!products_seller_id_fkey (
    id,
    full_name,
    email,
    department
  )
`;

/**
 * Get all products for the admin products page.
 */
export async function getAdminProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(adminProductSelect)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Get the most recently listed products.
 *
 * Used by the admin dashboard.
 */
export async function getRecentAdminProducts(limit = 5) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      price,
      status,
      created_at,
      categories (
        id,
        name
      ),
      profiles!products_seller_id_fkey (
        id,
        full_name
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Update a product status from the admin panel.
 *
 * Supported statuses:
 * active
 * sold
 * removed
 */
export async function updateAdminProductStatus({ productId, status }) {
  const { data, error } = await supabase
    .from("products")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select(adminProductSelect)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get one product for the admin product details page.
 */
export async function getAdminProductById(productId) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      seller_id,
      category_id,
      name,
      description,
      price,
      condition,
      image_url,
      status,
      created_at,
      updated_at,
      categories (
        id,
        name,
        description
      ),
      profiles!products_seller_id_fkey (
        id,
        full_name,
        email,
        phone,
        department,
        student_id
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
