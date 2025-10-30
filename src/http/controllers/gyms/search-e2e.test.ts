import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from 'app';
import request from 'supertest';
import { createAndAuthenticateUser } from 'utils/tests/create-and-authenticate-user';

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gyms by name', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      name: 'JavaScript Gym',
      description: 'Some description.',
      phone: '1199999999',
      latitude: -1.402649,
      longitude: -48.430483,
    });

    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      name: 'TypeScript Gym',
      description: 'Some description.',
      phone: '1199999999',
      latitude: -1.460224,
      longitude: -48.491078,
    });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'JavaScript',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        name: 'JavaScript Gym',
      }),
    ]);
  });
});
