import { Router } from 'https://deno.land/x/oak/mod.ts';

const router = new Router();

interface Todo {
	id: string;
	text: string;
}

let todos: Todo[] = [];

router.get('/todos', (ctx) => {
	ctx.response.body = { todos: todos };
	//Oak in automatico se rileva che la risposta è un oggetto, manderà una
	//risposta di tipo JSON. (in pratica non serve preoccuparcene)
});

router.post('/todos', async (ctx) => {
	const data = ctx.request.body();
	const value = await data.value;
	console.log(value);
	const newTodo: Todo = {
		id: new Date().toISOString(),
		text: value.text as string,
	};
	todos.push(newTodo);
	ctx.response.body = { message: 'Created todo!', todos: todos };
});

router.put('/todos/:todoId', async (ctx) => {
	const todoId = ctx.params.todoId;
	const todoIndex = todos.findIndex((todo) => {
		return todoId === todo.id;
	});
	const value = await ctx.request.body().value;
	todos[todoIndex] = {
		id: todos[todoIndex].id,
		text: value.text as string,
	};
	ctx.response.body = { message: 'Updated post!', todos: todos };
});

router.delete('/todos/:todoId', (ctx) => {
	const todoId = ctx.params.todoId;
	todos = todos.filter((todo) => todo.id !== todoId);
	ctx.response.body = { message: 'Delete post!', todos: todos };
});

export default router;
