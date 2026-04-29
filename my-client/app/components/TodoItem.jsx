import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Check,
  CheckCheck,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronsUp,
  ChevronDown,
  ChevronsDown,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const TodoItem = ({ todo, group }) => {
  const { _id } = todo;
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);

  // 1. Delete Mutation
  const mutationDeleteTodo = useMutation({
    mutationFn: (_id) =>
      axios
        .delete(`http://localhost:5000/todos/${_id}`, {
          withCredentials: true,
        })
        .then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["todos", group._id]),
  });

  // 2. Update Title Mutation
  const mutationUpdateTodo = useMutation({
    mutationFn: (_id) =>
      axios
        .put(
          `http://localhost:5000/todos/${_id}`,
          { title: todoTitle },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos", group._id]);
      setIsEditing(false); // Only close input on success
    },
  });

  // 3. Toggle Done Mutation
  const mutationToggleDone = useMutation({
    mutationFn: (_id) =>
      axios
        .put(
          `http://localhost:5000/todos/${_id}`,
          { isDone: !todo.isDone },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos", group._id]);
    },
  });
  //update new listMutation
  const mutationReorder = useMutation({
    mutationFn: (idListArray) =>
      axios.put(
        "http://localhost:5000/todos/reorderTodo",
        {
          newOrder: idListArray.map((task) => task._id),
        },
        { withCredentials: true },
      ),
  });
  // Handlers
  const handleEditing = () => setIsEditing(true);

  const handleConfirmEditing = () => {
    if (todoTitle.trim()) mutationUpdateTodo.mutate(_id);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleConfirmEditing();
    else if (e.key === "Escape") {
      setTodoTitle(todo.title); // Reset to original if canceled
      setIsEditing(false);
    }
  };
  //move up and down
  const moveUp = () => {
    const data = queryClient.getQueryData(["todos", group._id]);

    const index = data.findIndex((t) => t._id === _id);

    if (index <= 0) return;

    const newArray = [...data];

    const [removedTask] = newArray.splice(index, 1);

    newArray.splice(index - 1, 0, removedTask);

    mutationReorder.mutate(newArray);
    
    queryClient.setQueryData(["todos", group._id], newArray);
  };
  //re order function mutation

  const moveDown = () => {
    const data = queryClient.getQueryData(["todos", group._id]);
    const index = data.findIndex((item) => item._id === _id);
    if (index >= data.length - 1) return;

    const newArray = [...data];

    const [removedTask] = newArray.splice(index, 1);

    newArray.splice(index + 1, 0, removedTask);
    mutationReorder.mutate(newArray);

    queryClient.setQueryData(["todos", group._id], newArray);
  };
  const moveTop = () => {
    const data = queryClient.getQueryData(["todos", group._id]);

    const index = data.findIndex((item) => item._id === _id);

    if (index === 0) return;

    const newArray = [...data];

    const [removedTask] = newArray.splice(index, 1);

    newArray.splice(0, 0, removedTask);
    mutationReorder.mutate(newArray);

    queryClient.setQueryData(["todos", group._id], newArray);
  };
  const moveBottom = () => {
    const data = queryClient.getQueryData(["todos", group._id]);

    const index = data.findIndex((item) => item._id === _id);

    if (index >= data.length - 1) return;

    const newArray = [...data];

    const [removedTask] = newArray.splice(index, 1);

    newArray.splice(newArray.length, 0, removedTask);
    mutationReorder.mutate(newArray);

    queryClient.setQueryData(["todos", group._id], newArray);
  };

  return (
    <div className="group flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 shadow-sm transition-colors hover:bg-accent/50">
      {/* Checkbox */}
      <button
        onClick={() => mutationToggleDone.mutate(_id)}
        disabled={mutationToggleDone.isPending}
        className={`shrink-0 w-5 h-5 rounded border transition-all flex items-center justify-center ${
          todo.isDone
            ? "bg-primary border-primary"
            : "border-input hover:border-primary"
        }`}
      >
        {todo.isDone && (
          <Check className="w-3.5 h-3.5 text-primary-foreground" />
        )}
      </button>

      {/* Title / Input */}
      {isEditing ? (
        <Input
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="h-7 text-sm flex-1 px-2"
        />
      ) : (
        <span
          className={`flex-1 text-sm truncate ${todo.isDone ? "line-through text-muted-foreground" : "text-foreground"}`}
        >
          {todo.title}
        </span>
      )}

      {/* Action Area */}
      <div className="flex items-center gap-1 shrink-0">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleConfirmEditing}
              disabled={mutationUpdateTodo.isPending}
              className="h-7 w-7 p-0 text-green-600 hover:bg-green-50"
            >
              <CheckCheck className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setTodoTitle(todo.title);
                setIsEditing(false);
              }}
              className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleEditing}>
                <Pencil className="mr-2 h-4 w-4" /> Edit Task
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Reorder</DropdownMenuLabel>

              <DropdownMenuItem onClick={moveTop}>
                <ChevronsUp className="mr-2 h-4 w-4" /> Move to Top
              </DropdownMenuItem>
              <DropdownMenuItem onClick={moveUp}>
                <ChevronUp className="mr-2 h-4 w-4" /> Move Up
              </DropdownMenuItem>
              <DropdownMenuItem onClick={moveDown}>
                <ChevronDown className="mr-2 h-4 w-4" /> Move Down
              </DropdownMenuItem>
              <DropdownMenuItem onClick={moveBottom}>
                <ChevronsDown className="mr-2 h-4 w-4" /> Move to Bottom
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => mutationDeleteTodo.mutate(_id)}
                disabled={mutationDeleteTodo.isPending}
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
