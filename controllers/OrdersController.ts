import { BaseController } from './BaseController';

export class OrdersController extends BaseController {
  create(body : any) {
    try {
      const newOrder = this.database.createOrder(body.productId);
      
      return this.response.status(201).json(newOrder);
    } catch(error) {
      return this.renderError(error as Error);
    }
  }

  show(orderId : string) {
    try {
      const order = this.database.getOrder(orderId);

      return this.response.json(order);
    } catch(error) {
      return this.renderError(error as Error);
    }
  }
}