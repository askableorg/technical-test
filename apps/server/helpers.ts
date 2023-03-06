import { FastifyRequest, FastifyError } from 'fastify';

export const handleError = (
  route: string,
  error: FastifyError,
  req: FastifyRequest,
) => {
  req.log.error(
    {
      [route]: {
        messages: error.message,
      },
    },
    `${route} error`
  );
}