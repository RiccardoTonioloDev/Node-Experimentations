import { Application } from 'https://deno.land/x/oak/mod.ts';
//Fare ciò ci permette di non dovere installare ogni volta nuovi moduli
import todosRoutes from './routes/todos.ts';

const app = new Application();

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 3000 });
