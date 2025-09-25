import express from "express";
import bodyParser from "body-parser";
import { validateTodo } from "./validation.js";

const app = express();
app.use(bodyParser.json());

let todos = [];
let nextId = 1;

app.get("/api/todos", (req, res) => {
  res.json({ items: todos, total: todos.length });
});

app.get("/api/todos/:id", (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) {
    return res.status(404).json({ error: { message: "Todo not found", code: "NOT_FOUND" } });
  }
  res.json(todo);
});

app.post("/api/todos", validateTodo, (req, res) => {
  const { title, completed = false } = req.body;
  const newTodo = { id: nextId++, title, completed };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const before = todos.length;
  todos = todos.filter(t => t.id !== id);

  if (todos.length < before) {
    return res.status(204).end(); 
  } else {
    return res.status(404).json({ error: { message: "Todo not found", code: "NOT_FOUND" } });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
