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

const managedProductSelect = `
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
  )
`;

export async function createProduct({
  sellerId,
  categoryId,
  name,
  description,
  price,
  condition,
  imageUrl,
}) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      seller_id: sellerId,
      category_id: categoryId,
      name,
      description,
      price,
      condition,
      image_url: imageUrl || null,
      status: "active",
    })
    .select(managedProductSelect)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getMyProducts(sellerId) {
  const { data, error } = await supabase
    .from("products")
    .select(managedProductSelect)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getMyProductById(productId, sellerId) {
  const { data, error } = await supabase
    .from("products")
    .select(managedProductSelect)
    .eq("id", productId)
    .eq("seller_id", sellerId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateProduct({
  productId,
  sellerId,
  categoryId,
  name,
  description,
  price,
  condition,
  imageUrl,
}) {
  const { data, error } = await supabase
    .from("products")
    .update({
      category_id: categoryId,
      name,
      description,
      price,
      condition,
      image_url: imageUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .eq("seller_id", sellerId)
    .select(managedProductSelect)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateProductStatus({ productId, sellerId, status }) {
  const { data, error } = await supabase
    .from("products")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .eq("seller_id", sellerId)
    .select(managedProductSelect)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
