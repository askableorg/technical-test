import appSetup from './app/app';

const port = 3000;

const app = appSetup();

app.listen({ port }, () => {
  console.log(`Listening on port ${port}`);
});
