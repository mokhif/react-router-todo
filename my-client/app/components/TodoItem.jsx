import React from "react";
import { Card } from "./ui/card";
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
} from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

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
  //editingtodo func
  const handleEditing = () => setIsEditing(!isEditing);
  const handleConfirmEditing = () => {
    mutationUpdateTodo.mutate(_id);
    setIsEditing(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleConfirmEditing();
    } else if (e.key === "Escape") {
      handleEditing();
    }
  };
  //isDone Mutation
  const mutationToggleDone = useMutation({
    mutationFn: (_id) =>
      axios
        .put(
          `http://localhost:5000/todos/${_id}`,
          {
            isDone: !todo.isDone,
          },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos", group._id]);
    },
  });
  const handleDoneToggle = () => {
    mutationToggleDone.mutate(_id);
  };
  return (
    <Card className="p-4 border-border bg-card hover:bg-secondary/20 transition-colors group">
      <div className="flex items-center gap-3">
        {/* 1. Toggle Checkbox Circle */}
        <button
          onClick={handleDoneToggle}
          className={`shrink-0 w-6 h-6 rounded border-2 transition-all flex items-center justify-center 
          ${
            todo.isDone
              ? "bg-primary border-primary"
              : "border-border hover:border-primary"
          }`}
        >
          {todo.isDone && <Check className="w-4 h-4 text-primary-foreground" />}
        </button>

        {/* 2. Text or Input Field */}
        {isEditing ? (
          <Input
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1"
          />
        ) : (
          <span
            className={`flex-1 text-foreground ${todo.isDone ? "line-through text-muted-foreground" : ""}`}
          >
            {todo.title}
          </span>
        )}

        {/* 3. Action Area (Conditional) */}
        <div className="flex items-center gap-1">
          {isEditing ? (
            /* SHOW THESE WHEN EDITING */
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleConfirmEditing}
                className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />{" "}
                {/* Acting as "Cancel" icon here */}
              </Button>
            </div>
          ) : (
            /* SHOW DROPDOWN WHEN NOT EDITING */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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

                <DropdownMenuItem onClick={() => console.log("Top")}>
                  <ChevronsUp className="mr-2 h-4 w-4" /> Move to Top
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Up")}>
                  <ChevronUp className="mr-2 h-4 w-4" /> Move Up
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Down")}>
                  <ChevronDown className="mr-2 h-4 w-4" /> Move Down
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Bottom")}>
                  <ChevronsDown className="mr-2 h-4 w-4" /> Move to Bottom
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => mutationDeleteTodo.mutate(_id)}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TodoItem;
