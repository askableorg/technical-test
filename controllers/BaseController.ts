import { Response } from 'express';
import { Database } from '../data/Database';
import { OrderNotFoundError, ProductNotFoundError, ProductPurchasedError, ProductAttributeError } from '../data/errors';

export class BaseController {
  protected request : Request;
  protected response : Response;
  protected database = Database.getInstance();
  
  setContext(request : any, response : Response) {
    this.request = request;
    this.response = response;
  }

  renderError(error : Error) {
    switch(error.constructor) {
      case ProductAttributeError: {
        return this.response.status(422).json({ error : error.message });
      }
      
      case ProductNotFoundError :
      case OrderNotFoundError : {
        return this.response.status(404).json({ error : error.message });
      }

      case ProductPurchasedError : {
        return this.response.status(406).json({ error : error.message })
      }

      default : {
        return this.response.status(500).json({ error : error.message })
      }
    }
  }
}