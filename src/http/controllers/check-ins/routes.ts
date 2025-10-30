import { FastifyInstance } from 'fastify';
import { verifyJwt } from 'middlewares/verify-jwt';
import { createCheckInController } from './create';
import { metricsCheckInsController } from './metrics';
import { validateCheckInsController } from './validate';
import { historyCheckInsController } from './history';

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.get('/check-ins/history', historyCheckInsController);
  app.get('/check-ins/metrics', metricsCheckInsController);
  app.patch('/check-ins/:checkInId/validate', validateCheckInsController);

  app.post('/gyms/:gymId/check-ins', createCheckInController);
}
