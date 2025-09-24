import { hash } from 'bcryptjs';
import { prisma } from 'lib/prisma';
import { RegisterRequestBody } from 'types/register.body';

export async function registerUseCase({ name, email, password }: RegisterRequestBody) {
  const password_hash = await hash(password, 6);

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userWithSameEmail) {
    throw new Error('User with same email already exists.');
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  });
}
