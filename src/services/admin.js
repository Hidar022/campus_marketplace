import { supabase } from "../lib/supabase";

/**
 * Get all marketplace users.
 */
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

/**
 * Get dashboard statistics.
 *
 * We keep this separate from getAdminUsers()
 * so the dashboard doesn't need to load every
 * user record just to display the totals.
 */
export async function getAdminDashboardStats() {
  const [
    totalUsersResult,
    adminUsersResult,
    marketplaceUsersResult,
    totalProductsResult,
    activeProductsResult,
    soldProductsResult,
    removedProductsResult,
    totalCategoriesResult,
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),

    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin"),

    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "user"),

    supabase.from("products").select("id", { count: "exact", head: true }),

    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),

    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "sold"),

    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "removed"),

    supabase.from("categories").select("id", { count: "exact", head: true }),
  ]);

  const results = [
    totalUsersResult,
    adminUsersResult,
    marketplaceUsersResult,
    totalProductsResult,
    activeProductsResult,
    soldProductsResult,
    removedProductsResult,
    totalCategoriesResult,
  ];

  const failedResult = results.find((result) => result.error);

  if (failedResult) {
    throw failedResult.error;
  }

  return {
    totalUsers: totalUsersResult.count ?? 0,
    adminUsers: adminUsersResult.count ?? 0,
    marketplaceUsers: marketplaceUsersResult.count ?? 0,
    totalProducts: totalProductsResult.count ?? 0,
    activeProducts: activeProductsResult.count ?? 0,
    soldProducts: soldProductsResult.count ?? 0,
    removedProducts: removedProductsResult.count ?? 0,
    totalCategories: totalCategoriesResult.count ?? 0,
  };
}

/**
 * Get one user by ID for the admin user details page.
 */
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
