import { Button } from "@/components/ui/button";
import TodoItem from "./TodoItem";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const GroupCard = ({ title, id }) => {
  //States
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(null);
  const queryClient = useQueryClient();
  //deleting group
  const mutationDelete = useMutation({
    mutationFn: (id) =>
      axios
        .delete(`http://localhost:5000/group/${id}`, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["group"]),
  });
  //updating group
  const mutationUpdate = useMutation({
    mutationFn: (id) =>
      axios
        .put(
          `http://localhost:5000/group/${id}`,
          { title: newTitle },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["group"]);
      setIsEditing(null);
    },
  });
  return (
    <div className="flex w-80 flex-shrink-0 flex-col rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-card-foreground">
            {isEditing ? (
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            ) : (
              title
            )}
          </h2>
          <p className="text-xs text-muted-foreground">1 of 3 completed</p>
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-1">
          <Button
            onClick={
              isEditing
                ? () => mutationUpdate.mutate(id)
                : () => setIsEditing(!isEditing)
            }
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
          >
            {isEditing ? (
              <Check className="h-4 w-4" />
            ) : (
              <Pencil className="h- w-2" />
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => mutationDelete.mutate(id)}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-h-96 flex-1 space-y-2 overflow-y-auto p-4">
        <TodoItem />
      </div>
    </div>
  );
};

export default GroupCard;
