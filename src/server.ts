import { taskRoutes } from 'routes/tasks';
import { app } from './app';
import { env } from './env';
import dbPlugin from 'plugins/db';

app.register(dbPlugin);
app.register(taskRoutes);

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP server running on http://localhost:${env.PORT}`);
  });
