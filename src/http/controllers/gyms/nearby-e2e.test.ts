import { app } from 'app';
import request from 'supertest';
import { createAndAuthenticateUser } from 'utils/tests/create-and-authenticate-user';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      name: 'JavaScript Gym',
      description: 'Some description.',
      phone: '1199999999',
      latitude: -1.287586,
      longitude: -48.151652,
    });

    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      name: 'TypeScript Gym',
      description: 'Some description.',
      phone: '1199999999',
      latitude: -1.460224,
      longitude: -48.491078,
    });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -1.396836,
        longitude: -48.433993,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        name: 'TypeScript Gym',
      }),
    ]);
  });
});
