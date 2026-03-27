import Todo from "../models/todo.js";
//Todo Crud Section
//Creating a Todo
export const createTodo = async (req, res) => {
  try {
    const todo = await Todo.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};

//requesting all todos
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id });
    res.status(200).json(todos);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};
//deleting a todo
export const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) return res.status(404).json({ msg: "Todo not found" });
    res.status(200).json(deletedTodo);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};
//update a todo
export const updateTodo = async (req, res) => {
  try {
    const updateTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updateTodo) return res.status(404).json({ msg: "Todo not found" });
    res.status(200).json(updateTodo);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};
