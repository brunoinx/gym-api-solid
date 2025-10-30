import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from 'app';
import request from 'supertest';
import { createAndAuthenticateUser } from 'utils/tests/create-and-authenticate-user';
import { prisma } from 'lib/prisma';

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        name: 'JavaScript Gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -1.440044,
        longitude: -48.463584,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -1.440044,
        longitude: -48.463584,
      });

    expect(response.statusCode).toEqual(201);
  });
});
