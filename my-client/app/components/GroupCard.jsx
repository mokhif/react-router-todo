import { Button } from "@/components/ui/button";
import TodoItem from "./TodoItem";
import {
  CheckCheck,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import AddTodoModal from "./AddTodoModal";
import { Input } from "./ui/input";
const GroupCard = ({ group }) => {
  //hooks
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
    onSuccess: () => queryClient.invalidateQueries(["groups"]),
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
      queryClient.invalidateQueries(["groups"]);
      setIsEditing(null);
    },
  });
  const handleEditing = () => setIsEditing(!isEditing);
  const handleUpdate = () => mutationUpdateGroup.mutate(_id);
  //fetching TodosForSpecificGroup
  const { data: todos } = useQuery({
    queryKey: ["todos", _id],
    queryFn: () =>
      axios
        .get(`http://localhost:5000/todos/${_id}`, { withCredentials: true })
        .then((res) => res.data),
  });
  return (
    <div className="flex w-80 flex-shrink-0 flex-col rounded-lg border border-border bg-card shadow-sm">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3 group/header">
        {/* Title / Input Area */}
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              autoFocus
              className="h-8 text-sm font-semibold"
            />
          ) : (
            <>
              <h2 className="truncate font-semibold text-card-foreground">
                {title}
              </h2>

              <p className="text-xs text-muted-foreground">
                {todos?.filter((t) => t.isDone).length} of {todos?.length}
                completed
              </p>
            </>
          )}
        </div>

        {/* Action Buttons Area */}
        <div className="flex items-center gap-1">
          {isEditing ? (
            /* --- SHOW WHEN EDITING --- */
            <div className="flex items-center gap-1">
              <Button
                onClick={handleUpdate}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            /* --- SHOW WHEN BROWSING --- */
            <>
              {/* Keep the Add Button visible! */}
              <AddTodoModal id={_id} />

              {/* Hide Group Edit/Delete in the 3-dot menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover/header:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Group Actions</DropdownMenuLabel>

                  <DropdownMenuItem onClick={handleEditing}>
                    <Pencil className="mr-2 h-4 w-4" /> Rename Group
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => mutationDeleteGroup.mutate(_id)}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Group
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {/* TODO LIST SECTION */}
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {todos?.map((todo) => (
          <TodoItem key={todo._id} todo={todo} group={group} />
        ))}
      </div>
    </div>
  );
};

export default GroupCard;
