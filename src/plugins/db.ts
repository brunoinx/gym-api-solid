import fp from 'fastify-plugin';
import sqlite from 'better-sqlite3';
import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    db: sqlite.Database;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  try {
    const db = new sqlite('./db.sqlite');

    // Habilita as chaves estrangeiras.
    db.exec('PRAGMA foreign_keys = ON');

    // Cria uma tabela de exemplo.
    db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Registra a instância do banco de dados no Fastify.
    // Isso a torna acessível em todas as rotas através de `fastify.db`.
    fastify.decorate('db', db);

    console.log('🚀 Database connected!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Encerra o processo se houver um erro.
  }
});
