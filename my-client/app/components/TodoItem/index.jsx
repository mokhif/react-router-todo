import React, { useState } from "react";

import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Check } from "lucide-react";

import SideSheet from "./SideSheet";
import DropDownMenue from "./DropDownMenue";
const TodoItem = ({ todo, group }) => {
  const { _id } = todo;
  const queryClient = useQueryClient();

  // States
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // 1. Delete Mutation of Todo
  const mutationDeleteTodo = useMutation({
    mutationFn: (id) =>
      axios
        .delete(`http://localhost:5000/todos/${id}`, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["todos", group._id]),
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

      <SideSheet
        todo={todo}
        group={group}
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
      />

      <DropDownMenue
        todo={todo}
        group={group}
        setIsSheetOpen={setIsSheetOpen}
        moveTop={moveTop}
        moveUp={moveUp}
        moveDown={moveDown}
        moveBottom={moveBottom}
        mutationDeleteTodo={mutationDeleteTodo}
      />
    </div>
  );
};

export default TodoItem;
