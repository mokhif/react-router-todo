import React from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "../ui/input";
import TodoItem from "../TodoItem";
const TaksRender = () => {
  const queryClient = useQueryClient();
  //Fetching Todos
  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: () =>
      axios
        .get("http://localhost:5000/todos", { withCredentials: true })
        .then((res) => res.data),
  });
  //Deleting Todo
  const mutationDelete = useMutation({
    mutationFn: (id) =>
      axios
        .delete(`http://localhost:5000/todos/${id}`, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["todos"]),
  });
  //Updating Todo

  //States
  //Setting editing state
  const handleEditedInput = (id, title) => {
    setEditingId(id);
    setEditTitle(title);
  };

  //Confirming Edit

  const handleConfirmEdit = () => {
    mutationUpdate.mutate(editingId);
  };

  const mutationUpdate = useMutation({
    mutationFn: (id) =>
      axios.put(
        `http://localhost:5000/todos/${id}`,
        { title: editTitle },
        { withCredentials: true },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      setEditTitle("");
      setEditingId(null);
    },
  });

  return (
    <div className="space-y-2">
      {(todos || []).map((todo) => (
        <TodoItem key={todo._id} todo={todo} />
      ))}
    </div>
  );
};

export default TaksRender;
