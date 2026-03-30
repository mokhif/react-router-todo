import React from "react";
import { Card } from "./ui/card";
import { Check, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
const TaksRender = () => {
  const [editingId, setEditingId] = useState(null);
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
  return (
    <div className="space-y-2">
      {(todos || []).map((todo) => (
        <Card
          key={todo._id}
          className="p-4 border-border bg-card hover:bg-secondary/20 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <button className="shrink-0 w-6 h-6 rounded border-2 border-border hover:border-primary transition-all flex items-center justify-center">
              <Check className="w-4 h-4 text-primary-foreground" />
            </button>

            {editingId === todo._id ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1"
              />
            ) : (
              <span className="flex-1 text-foreground">{todo.title}</span>
            )}

            {
              <button
                onClick={
                  editingId === todo._id
                    ? () => handleConfirmEdit(todo._id)
                    : () => handleEditedInput(todo._id, todo.title)
                }
                className="shrink-0 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
              >
                {editingId === todo._id ? (
                  <CheckCheck className="w-4 h-4" />
                ) : (
                  <Pencil className="w-4 h-4" />
                )}
              </button>
            }
            <button
              onClick={() => mutationDelete.mutate(todo._id)}
              className="shrink-0 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TaksRender;
