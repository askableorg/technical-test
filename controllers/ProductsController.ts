import { BaseController } from './BaseController';
import { SortBy } from '../data/types';
import { sortByPriceDesc, sortByPriceAsc, sortByCreatedDesc, sortByCreatedAsc } from '../data/sorting';

export class ProductsController extends BaseController {
  private readonly SORTING_MAPPING = {
    'price-asc'    : sortByPriceAsc,
    'price-desc'   : sortByPriceDesc,
    'created-asc'  : sortByCreatedAsc,
    'created-desc' : sortByCreatedDesc
  }

  index(query : any) {
    try {
      let collection = Array.from(this.database.getProducts().values());

      const sortableFn = this.SORTING_MAPPING[query.sort as SortBy]
      if (sortableFn) collection = collection.sort(sortableFn) 

      if (query.limit > 0) collection = collection.slice(0, query.limit)
      
      return this.response.json(collection);
    } catch(error) {
      return this.renderError(error as Error);
    }
  }

  create(body : any) {
    try {
      const title = body.title;
      const price = body.price;
      const category = body.category
    
      const newProduct = this.database.createProduct(title, price, category);
  
      return this.response.status(201).json(newProduct);
    } catch(error) {
      return this.renderError(error as Error);
    }
  }

  show(productId : string) {
    try {
      const product = this.database.getProduct(productId);
  
      return this.response.json(product);
    } catch (error) {
      return this.renderError(error as Error);
    }
  }

  showByOrder(orderId : string) {
    try {
      const order = this.database.getOrder(orderId);
      return this.show(order.product_id)
    } catch (error) {
      return this.renderError(error as Error);
    }
  }

  delete(productId : string) {
    try {
      const product = this.database.deleteProduct(productId);
      const order = this.database.deleteOrder(product.order_id);
      return this.response.json({ deleted: true, product, order });
    } catch (error) {
      return this.renderError(error as Error)
    }      
  }
}