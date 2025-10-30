import { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'john.doe@mail.com',
    password: '123456',
  });

  const { body, statusCode } = await request(app.server).post('/sessions').send({
    email: 'john.doe@mail.com',
    password: '123456',
  });

  return {
    token: body.token,
    statusCode,
  };
}
