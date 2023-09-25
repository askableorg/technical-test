const productCategoriesEnum = ["Sneakers", "Clothing", "Watches", "Hats"];

export const createProductRequestSchema = {
    type: "object",
    required: ["title", "category", "price", "description"],
    properties: {
        _id: { type: "string", minLength: 1 },
        title: { type: "string", minLength: 1 },
        category: { type: "string", enum: productCategoriesEnum },
        price: { type: "string", pattern: "^[0-9]+(\\.[0-9]{1,2})?$" },
        description: { type: "string", minLength: 1 },
    },
};
