export type ShippingType = "Standard" | "Express";

type AddressInfo = {
    address: string;
    city: string;
    state: string;
    postcode: string;
};

type UserInfo = {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
};

type WithId<T> = T & {
    _id: string;
};

export type BaseOrder = {
    productId: string;
    createdDate: string;
    shippingType: ShippingType;
};

export type Order = WithId<BaseOrder & AddressInfo & UserInfo>;

export type OrderRequest = BaseOrder &
    AddressInfo &
    UserInfo & {
        cardNumber: string;
        expiryDate: string;
        cvv: string;
    };
