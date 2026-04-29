import React, { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Check,
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "./ui/sheet";
const TodoItem = ({ todo, group }) => {
  const { _id } = todo;
  const queryClient = useQueryClient();
  const [tagetGroupId, setTagetGroupId] = useState(group._id);

  const { data: allGroups } = useQuery({ queryKey: ["groups"] });

  // States
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [todoDescription, setTodoDescription] = useState(
    todo.description || "",
  );

  // 1. Delete Mutation
  const mutationDeleteTodo = useMutation({
    mutationFn: (id) =>
      axios
        .delete(`http://localhost:5000/todos/${id}`, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["todos", group._id]),
  });

  // 2. Comprehensive Update Mutation (Title + Description)
  const mutationUpdateTodo = useMutation({
    mutationFn: (id) =>
      axios
        .put(
          `http://localhost:5000/todos/${id}`,
          {
            title: todoTitle,
            description: todoDescription,
            group: tagetGroupId,
          },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos", group._id]);
      setIsSheetOpen(false); // Close side panel on success
    },
  });

  // 3. Toggle Done Mutation
  const mutationToggleDone = useMutation({
    mutationFn: (id) =>
      axios
        .put(
          `http://localhost:5000/todos/${id}`,
          { isDone: !todo.isDone },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["todos", group._id]),
  });

  // 4. Reorder Mutation
  const mutationReorder = useMutation({
    mutationFn: (idListArray) =>
      axios.put(
        "http://localhost:5000/todos/reorderTodo",
        { newOrder: idListArray.map((task) => task._id) },
        { withCredentials: true },
      ),
  });

  // Reorder Handlers Function
  const syncOrder = (newArray) => {
    queryClient.setQueryData(["todos", group._id], newArray);
    mutationReorder.mutate(newArray);
  };

  const moveUp = () => {
    const data = queryClient.getQueryData(["todos", group._id]);
    const index = data.findIndex((t) => t._id === _id);
    if (index <= 0) return;
    const newArray = [...data];
    const [removed] = newArray.splice(index, 1);
    newArray.splice(index - 1, 0, removed);
    syncOrder(newArray);
  };

  const moveDown = () => {
    const data = queryClient.getQueryData(["todos", group._id]);
    const index = data.findIndex((t) => t._id === _id);
    if (index >= data.length - 1) return;
    const newArray = [...data];
    const [removed] = newArray.splice(index, 1);
    newArray.splice(index + 1, 0, removed);
    syncOrder(newArray);
  };

  const moveTop = () => {
    const data = queryClient.getQueryData(["todos", group._id]);
    const index = data.findIndex((t) => t._id === _id);
    if (index === 0) return;
    const newArray = [...data];
    const [removed] = newArray.splice(index, 1);
    newArray.unshift(removed);
    syncOrder(newArray);
  };

  const moveBottom = () => {
    const data = queryClient.getQueryData(["todos", group._id]);
    const index = data.findIndex((t) => t._id === _id);
    if (index >= data.length - 1) return;
    const newArray = [...data];
    const [removed] = newArray.splice(index, 1);
    newArray.push(removed);
    syncOrder(newArray);
  };

  return (
    <div className="group flex items-start gap-3 rounded-md border border-border bg-card px-3 py-2.5 shadow-sm transition-colors hover:bg-accent/50">
      {/* Checkbox */}
      <button
        onClick={() => mutationToggleDone.mutate(_id)}
        disabled={mutationToggleDone.isPending}
        className={`mt-1 shrink-0 w-5 h-5 rounded border transition-all flex items-center justify-center ${
          todo.isDone
            ? "bg-primary border-primary"
            : "border-input hover:border-primary"
        }`}
      >
        {todo.isDone && (
          <Check className="w-3.5 h-3.5 text-primary-foreground" />
        )}
      </button>

      {/* Main Content Area (Sheet Trigger) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <div className="flex flex-1 flex-col min-w-0 cursor-pointer text-left">
            <span
              className={`text-sm font-medium truncate ${todo.isDone ? "line-through text-muted-foreground" : "text-foreground"}`}
            >
              {todo.title}
            </span>
            {todo.description && (
              <span className="text-xs text-muted-foreground line-clamp-1">
                {todo.description}
              </span>
            )}
          </div>
        </SheetTrigger>

        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader className="mb-6">
            <SheetTitle>Edit Task</SheetTitle>
            <SheetDescription>
              Update the details for this task below.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={todoTitle}
                onChange={(e) => setTodoTitle(e.target.value)}
                placeholder="Task title..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={todoDescription}
                onChange={(e) => setTodoDescription(e.target.value)}
                placeholder="Add details about this task..."
                className="min-h-37.5 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Groups</Label>
              <Select value={tagetGroupId} onValueChange={setTagetGroupId}>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Move To Group..." />
                </SelectTrigger>
                <SelectContent>
                  {allGroups?.map((g) => (
                    <SelectItem key={g._id} value={g._id}>
                      {g.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter className="mt-8">
            <Button
              className="w-full"
              onClick={() => mutationUpdateTodo.mutate(_id)}
              disabled={mutationUpdateTodo.isPending || !todoTitle.trim()}
            >
              {mutationUpdateTodo.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Dropdown Actions */}
      <div className="flex items-center gap-1 shrink-0 mt-0.5">
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
            <DropdownMenuItem onClick={() => setIsSheetOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" /> View Details
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
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TodoItem;
