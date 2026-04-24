import React from "react";
import { Card } from "./ui/card";
import { Check, CheckCheck, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
const TodoItem = ({ todo, group }) => {
  const { _id } = todo;
  //hooks
  const queryClient = useQueryClient();
  //states
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);
  //deleting Single Todo
  const mutationDeleteTodo = useMutation({
    mutationFn: (_id) =>
      axios
        .delete(`http://localhost:5000/todos/${_id}`, {
          withCredentials: true,
        })
        .then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["todos", group._id]),
  });
  //updating a todo
  const mutationUpdateTodo = useMutation({
    mutationFn: (_id) =>
      axios
        .put(
          `http://localhost:5000/todos/${_id}`,
          {
            title: todoTitle,
          },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos", group._id]);
      setIsEditing(false);
    },
  });
  //editingtast func
  const handleEditing = () => setIsEditing(!isEditing);
  const handleConfirmEditing = () => {
    mutationUpdateTodo.mutate(_id);
    setIsEditing(false);
  };
  return (
    <Card className="p-4 border-border bg-card hover:bg-secondary/20 transition-colors group">
      <div className="flex items-center gap-3">
        <button className="shrink-0 w-6 h-6 rounded border-2 border-border hover:border-primary transition-all flex items-center justify-center">
          <Check className="w-4 h-4 text-primary-foreground" />
        </button>

        {isEditing ? (
          <Input
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
            className="flex-1"
          />
        ) : (
          <span className="flex-1 text-foreground">{todo.title}</span>
        )}

        <button
          onClick={isEditing ? handleConfirmEditing : handleEditing}
          className="shrink-0 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
        >
          {isEditing ? (
            <CheckCheck className="w-4 h-4" />
          ) : (
            <Pencil className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={() => mutationDeleteTodo.mutate(_id)}
          className="shrink-0 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
};

export default TodoItem;
