import express from 'express';
import { Database } from './data/Database';

const app = express();
const port = 3000;

app.post('/products', async (req, res) => {
  res.send(Database.getProducts());
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
