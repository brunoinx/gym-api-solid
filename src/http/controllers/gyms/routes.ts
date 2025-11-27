import { FastifyInstance } from 'fastify';
import { verifyJwt } from 'middlewares/verify-jwt';

import { createGymController } from './create';
import { nearbyGymController } from './nearby';
import { searchGymController } from './search';
import { verifyUserRole } from 'middlewares/verify-user-role';

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.get('/gyms/nearby', nearbyGymController);
  app.get('/gyms/search', searchGymController);

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, createGymController);
}
