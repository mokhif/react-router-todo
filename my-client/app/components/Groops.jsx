import React from "react";
import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Check, CheckCheck, Pencil, Trash2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
const Groops = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const queryClient = useQueryClient();
  //creating groop
  const mutation = useMutation({
    mutationFn: () =>
      axios
        .post(
          "http://localhost:5000/groops",
          { title: newGroupName },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["groops"]);
    },
  });
  //fetching groops
  const { data: groops } = useQuery({
    queryKey: ["groops"],
    queryFn: () =>
      axios
        .get("http://localhost:5000/groops", { withCredentials: true })
        .then((res) => res.data),
  });
  //deleting groop
  const mutationDelete = useMutation({
    mutationFn: (id) =>
      axios
        .delete(`http://localhost:5000/groops/${id}`, {
          withCredentials: true,
        })
        .then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["groops"]),
  });
  //updating Groop

  return (
    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
      <SelectTrigger className="w-full bg-background border-border text-foreground">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {groops?.map((group) => (
          <div key={group._id} className="flex items-center justify-between">
            <SelectItem value={group}>{group.title}</SelectItem>
            <button className="text-muted-foreground hover:text-destructive transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
            <button className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-4 h-4 ml-3.5" />
            </button>
          </div>
        ))}
        {isCreating ? (
          <div className="flex gap-2 p-1">
            <input
              autoFocus
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Group name..."
              className="flex-1 text-sm border rounded px-2 py-1"
            />
            <Button
              size="sm"
              onClick={() => {
                mutation.mutate(newGroupName);
                setIsCreating(false);
                setNewGroupName("");
              }}
            >
              Create
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-1"
            onClick={() => setIsCreating(true)}
          >
            + New group
          </Button>
        )}
      </SelectContent>
    </Select>
  );
};

export default Groops;
