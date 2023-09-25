export type Maybe<T> = T | null;

export type Categories = "Sneakers" | "Clothing" | "Watches" | "Hats";

type WithId<T> = T & {
    _id: string;
};

export type ProductRequest = WithId<{
    title: string;
    category: Categories;
    price: string;
    description: string;
}>;

export type Product = WithId<{
    title: string;
    order_id?: Maybe<String>;
    category: Categories;
    created_at: string;
    price: string;
    description: string;
}>;
