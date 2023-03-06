import { 
  FastifyInstance, 
  FastifyPluginOptions, 
  FastifyPluginAsync,
  FastifyRequest,
  FastifyError
} from 'fastify';
// @ts-ignore
import fp from 'fastify-plugin';

import { handleError } from '../helpers';
import { Database } from '../data/Database';
import { RequestDataType } from '../types';

const orderRoutes: FastifyPluginAsync = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  app.get("/orders", async (req, res) => {
    const orders = await Database.getOrders();
    res.send(orders);
  });

  app.get("/orders/:id", async (req: FastifyRequest<{ Params: RequestDataType }>, res) => {
    try {
      req.log.info(
        {
          request: {
            requestMethod: "GET",
            requestParams: req.params,
          },
        },
        "/orders/:id request"
      );

      const params = req.params;
      if (!params.id || typeof params.id !== 'string') {
        throw new Error('Invalid params');
      }

      const order = await Database.getOrderById(params.id);
      res.send(order);
    } catch (error) {
      handleError("orders/:id", error as FastifyError, req);
    }
  });
}

export default fp(orderRoutes);