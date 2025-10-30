import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from 'app';
import request from 'supertest';
import { createAndAuthenticateUser } from 'utils/tests/create-and-authenticate-user';

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'JavaScript Gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -1.440044,
        longitude: -48.463584,
      });

    expect(response.statusCode).toEqual(201);
  });
});
