import { FastifyReply, FastifyRequest } from 'fastify';

export async function refreshController(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify({ onlyCookie: true });
  } catch (err) {
    console.error('Refresh Token failed verification:', err);
    return reply
      .status(401)
      .send({ message: 'Refresh Token inválido ou ausente. Faça login novamente.' });
  }

  const newAccessPayload = { sub: request.user.sub, role: request.user.role };

  const newAccessToken = await reply.jwtSign(newAccessPayload, { sign: { expiresIn: '15m' } });

  const newRefreshToken = await reply.jwtSign(newAccessPayload, { sign: { expiresIn: '7d' } });

  return reply
    .status(200)
    .setCookie('refreshToken', newRefreshToken, {
      path: '/',
      secure: true, // Use sempre em produção (HTTPS)
      sameSite: true,
      httpOnly: true, // Impedir acesso via JavaScript (XSS)
    })
    .send({ token: newAccessToken });
}
