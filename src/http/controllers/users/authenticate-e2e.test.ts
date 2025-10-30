import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from 'app';
import { createAndAuthenticateUser } from 'utils/tests/create-and-authenticate-user';

describe('Authenticate Controller E2E', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to authenticate', async () => {
    const { token, statusCode } = await createAndAuthenticateUser(app);

    expect(statusCode).toEqual(200);
    expect(token).toEqual(expect.any(String));
  });
});
