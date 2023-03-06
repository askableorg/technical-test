import fastify from 'fastify';
import cors from '@fastify/cors';

import productRoutes from '../routes/productRoutes';
import orderRoutes from '../routes/orderRoutes';

const appSetup = () => {
  const app = fastify({
    logger: true,
  });

  app.get('/test', async (req, res) => {
    res.send({ hello: "world" })
  });

  app.register(cors, {});
  app.register(productRoutes);
  app.register(orderRoutes);

  return app;
}

export default appSetup;