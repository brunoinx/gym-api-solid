import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { ulid } from 'ulidx';
import type { Environment } from 'vitest/environments';
import { prisma } from 'lib/prisma';

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = ulid();
    const dbName = `test_${schema}.sqlite`;
    const dbPath = path.join(process.cwd(), dbName);
    const databaseUrl = `file:${dbPath}`;

    process.env.DATABASE_URL = databaseUrl;

    execSync('npx prisma migrate deploy', { stdio: 'inherit' });

    return {
      dbPath,
      async teardown() {
        await prisma.$disconnect();

        if (fs.existsSync(dbPath)) {
          fs.unlinkSync(dbPath);
        }
      },
    };
  },
};
