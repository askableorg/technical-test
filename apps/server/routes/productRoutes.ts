import { 
  FastifyInstance, 
  FastifyPluginOptions, 
  FastifyPluginAsync,
  FastifyRequest,
  FastifyError
} from 'fastify';
// @ts-ignore
import fp from 'fastify-plugin';

import { Database } from '../data/Database';
import { handleError } from '../helpers';
import { RequestDataType } from '../types';

const productRoutes: FastifyPluginAsync = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  app.get('/products', async (req, res) => {
    req.log.info(
      {
        request: {
          requestMethod: "GET",
        },
      },
      "/products request"
    );
  
    const products = await Database.getProducts();
    req.log.info(
      {
        resp: {
          data: products,
        },
      },
      "/products response"
    );
    res.send(products);
  });

  app.get(
    "/products/:id",
    async (req: FastifyRequest<{ Params: RequestDataType }>, res) => {
      req.log.info(
        {
          request: {
            requestMethod: "GET",
            requestParams: req.params,
          },
        },
        "/products/:id request"
      );

      const params = req.params;
      if (!params.id || typeof params.id !== 'string') {
        throw new Error('Invalid params')
      }
  
      const product = await Database.getProductById(params.id);

      req.log.info(
        {
          resp: {
            data: product,
          },
        },
        "/products/:id response"
      );
      res.send(product);
    }
  );

  app.post('/products/create', async (req, res) => {
    req.log.info(
      {
        request: {
          requestMethod: "POST",
        },
      },
      "/products/create request"
    );
  
    const products = await Database.addProduct();
  
    req.log.info(
      {
        resp: {
          data: products,
        },
      },
      "/products/create response"
    );
  
    res.send(products);
  });
  
  app.post(
    "/products/:id/purchase",
    async (
      req: FastifyRequest<{ Params: RequestDataType; Body: RequestDataType }>,
      res
    ) => {
      try {
        req.log.info(
          {
            request: {
              requestMethod: "POST",
              requestParams: req.params,
            },
          },
          "/products/:id/purchase request"
        );

        const params = req.params;
        if (!params.id || typeof params.id !== 'string') {
          throw new Error('Invalid params')
        }
  
        await Database.addOrder(params.id);
  
        const product = await Database.getProductById(params.id);
        req.log.info(
          {
            resp: {
              data: product,
            },
          },
          "/products/:id/purchase response"
        );

        return product;
      } catch (error) {
        console.warn(error);
      }
    }
  );
  
  app.post(
    "/products/delete",
    async (req: FastifyRequest<{ Body: RequestDataType }>, res) => {
      req.log.info(
        {
          request: {
            requestMethod: "POST",
            requestBody: req.body,
          },
        },
        "/products/delete request"
      );
      
      const body = req.body;

      if (!body.id || typeof body.id !== 'string') {
        throw new Error('Invalid params');
      }
  
      const productToDelete = await Database.getProductById(body.id);
      if (productToDelete) {
        const products = await Database.deleteProductById(body.id);
        res.send(products);
      } else {
        throw new Error("Can't delete non-existent product");
      }
  
      res.send({});
    }
  );

  app.get("/products/orders/:id", async (req: FastifyRequest<{ Params: RequestDataType }>, res) => {
    try {
      req.log.info(
        {
          request: {
            requestMethod: "GET",
            requestParams: req.params,
          },
        },
        "/products/orders/:id request"
      );

      const params = req.params;
      if (!params.id || typeof params.id !== 'string') {
        throw new Error('Invalid params');
      }

      const order = await Database.getOrderByProductId(params.id);
      req.log.info(
        {
          resp: {
            data: order,
          },
        },
        "/products/:id/purchase response"
      );
      res.send(order);
    } catch (error) {
      handleError("/products/orders/:id", error as FastifyError, req);
    }
  });
}

export default fp(productRoutes);