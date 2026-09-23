const emptyForm = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  condition: "used",
  imageUrl: "",
};

export function getEmptyProductForm() {
  return { ...emptyForm };
}

export function productToForm(product) {
  return {
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price == null ? "" : String(product.price),
    categoryId: product?.category_id ? String(product.category_id) : "",
    condition: product?.condition || "used",
    imageUrl: product?.image_url || "",
  };
}
