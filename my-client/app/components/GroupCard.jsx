import { Button } from "@/components/ui/button";
import TodoItem from "./TodoItem";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { use, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AddTodoModal from "./AddTodoModal";
const GroupCard = ({ group }) => {
  const { _id, title } = group;
  //States
  //group states
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(null);
  //Todo states
  const queryClient = useQueryClient();
  //deleting group
  const mutationDeleteGroup = useMutation({
    mutationFn: (_id) =>
      axios
        .delete(`http://localhost:5000/group/${_id}`, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["group"]),
  });
  //updating group
  const mutationUpdateGroup = useMutation({
    mutationFn: (_id) =>
      axios
        .put(
          `http://localhost:5000/group/${_id}`,
          { title: newTitle },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["group"]);
      setIsEditing(null);
    },
  });
  const handleEditing = () => setIsEditing(!isEditing);
  const handleUpdate = () => mutationUpdateGroup.mutate(_id);
  return (
    <div className="flex w-80 flex-shrink-0 flex-col rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text- text-card-foreground">
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
            onClick={isEditing ? handleUpdate : handleEditing}
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
          <AddTodoModal _id={_id} />
          <Button
            onClick={() => mutationDeleteGroup.mutate(_id)}
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
