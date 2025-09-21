import { FastifyInstance } from 'fastify';
import { Database } from 'better-sqlite3';
import z from 'zod';

interface TaskRequestBody {
  title: string;
  description?: string;
  status?: string;
}

interface TaskRequestParams {
  id: number;
}

export async function taskRoutes(fastify: FastifyInstance) {
  // Rota para criar uma nova tarefa.
  fastify.post<{ Body: TaskRequestBody }>('/tasks', async (request, reply) => {
    const taskSchema = z.object({
      title: z.string(),
      description: z.string(),
      status: z.enum(['in-progress', 'pending', 'completed']),
    });

    const { title, description, status } = taskSchema.parse(request.body);
    const db: Database = fastify.db;

    if (!title) {
      return reply.status(400).send({ error: 'Title is required.' });
    }

    try {
      const raw = db.prepare(
        'INSERT INTO tasks (title, description, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      );
      const now = new Date().toISOString();
      const info = raw.run(title, description || null, status || 'pending', now, now);

      return reply.status(201).send({ id: info.lastInsertRowid, title, description, status });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to create a task' });
    }
  });

  // Rota pare listar tasks
  fastify.get('/tasks', async (request, reply) => {
    const db: Database = fastify.db;

    try {
      const tasks = db.prepare('SELECT * FROM tasks').all();

      return { tasks };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to retrieve tasks' });
    }
  });

  // Rota para obter os detalhes de uma tarefa específica.
  fastify.get<{ Params: TaskRequestParams }>('/tasks/:id', (request, reply) => {
    const schemaParams = z.object({
      id: z.string(),
    });

    const { id } = schemaParams.parse(request.params);
    const db: Database = fastify.db;

    try {
      const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

      if (!task) {
        return reply.status(404).send({ error: 'Task not found' });
      }

      return { task };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to retrieve task' });
    }
  });

  // Rota para atualizar uma tarefa.
  fastify.put<{ Params: TaskRequestParams; Body: TaskRequestBody }>(
    '/tasks/:id',
    async (request, reply) => {
      const { id } = request.params;
      const { title, description, status } = request.body;
      const db: Database = fastify.db;

      if (!title && !description && !status) {
        return reply.status(400).send({
          error: 'At least one field (title, description, or status) is required to update.',
        });
      }

      try {
        const now = new Date().toISOString();
        // O SQL de atualização precisa ser dinâmico para evitar problemas se o campo não for fornecido.
        const fields = [];
        const values = [];

        if (title) {
          fields.push('title = ?');
          values.push(title);
        }
        if (description) {
          fields.push('description = ?');
          values.push(description);
        }
        if (status) {
          fields.push('status = ?');
          values.push(status);
        }
        fields.push('updated_at = ?');
        values.push(now);

        const stmt = db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`);
        const info = stmt.run(...values, id);

        if (info.changes === 0) {
          return reply.status(404).send({ error: 'Task not found or no changes made.' });
        }

        return reply.send({ message: 'Task updated successfully' });
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: 'Failed to update task' });
      }
    },
  );

  // Rota para deletar uma tarefa.
  fastify.delete<{ Params: TaskRequestParams }>('/tasks/:id', async (request, reply) => {
    const { id } = request.params;
    const db: Database = fastify.db;

    try {
      const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
      const info = stmt.run(id);

      if (info.changes === 0) {
        return reply.status(404).send({ error: 'Task not found' });
      }

      return reply.status(204).send(); // Status 204 indica "No Content", comum para deleções bem-sucedidas.
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to delete task' });
    }
  });
}
