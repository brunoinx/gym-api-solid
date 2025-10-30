import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from 'app';
import request from 'supertest';
import { createAndAuthenticateUser } from 'utils/tests/create-and-authenticate-user';
import { prisma } from 'lib/prisma';

describe('Check-in History (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to list the history of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        name: 'JavaScript Gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -1.440044,
        longitude: -48.463584,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    });

    const response = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({ gym_id: gym.id }),
      expect.objectContaining({ gym_id: gym.id }),
    ]);
  });
});
