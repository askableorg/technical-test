export class ProductNotFoundError extends Error {
  constructor(public readonly productId : string) {
    super(`Can not FIND the PRODUCT with _ID ${productId}`);
  }
}

export class ProductPurchasedError extends Error {
  constructor(public readonly productId : string) {
    super(`Can not PURCHASE the PRODUCT with _ID ${productId} it already has associated ORDER`);
  }
}

export class ProductAttributeError extends Error {
  constructor(public readonly attributeName : string) {
    super(`Incorrect VALUE for ATTRIBUTE :${attributeName}`);
  }
}

export class OrderNotFoundError extends Error {
  constructor(public readonly orderId : string) {
    super(`Can not FIND the ORDER with _ID ${orderId}`);
  }
}

