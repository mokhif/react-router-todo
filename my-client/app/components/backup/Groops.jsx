import React, { useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

const Group = ({ selectedGroupId, setSelectedGroupId }) => {
  //States

  const [isRenaming, setIsRenaming] = useState(false);
  //Renaming Group
  const [editTitle, setEditTitle] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  //Creating Group
  const [newGroupName, setNewGroupName] = useState("");

  const queryClient = useQueryClient();
  //Fetching
  const { data: group } = useQuery({
    queryKey: ["group"],
    queryFn: () =>
      axios
        .get("http://localhost:5000/group", { withCredentials: true })
        .then((res) => res.data),
  });
  //Creating Group
  const mutation = useMutation({
    mutationFn: () =>
      axios
        .post(
          "http://localhost:5000/group",
          { title: newGroupName },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["group"]),
  });
  //Deleting Group
  const mutationDelete = useMutation({
    mutationFn: (id) =>
      axios
        .delete(`http://localhost:5000/group/${id}`, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["group"]);
      setSelectedGroupId("");
    },
  });
  //Updating Group
  const mutationUpdate = useMutation({
    mutationFn: (id) =>
      axios
        .put(
          `http://localhost:5000/group/${id}`,
          { title: editTitle },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["group"]);
      setIsRenaming(false);
    },
  });

  const selectedGroup = group?.find((g) => g._id === selectedGroupId);

  return (
    <div className="flex flex-col gap-2">
      <select
        value={selectedGroupId}
        onChange={(e) => {
          setSelectedGroupId(e.target.value);
          setIsRenaming(false);
        }}
        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground"
      >
        <option value="">Select a group</option>
        {group?.map((g) => (
          <option key={g._id} value={g._id}>
            {g.title}
          </option>
        ))}
      </select>

      {selectedGroup && (
        <div className="flex items-center gap-2 px-1">
          {isRenaming ? (
            <>
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 h-8 px-3 rounded-md border border-input bg-background text-sm text-foreground"
              />
              <Button
                size="sm"
                onClick={() => mutationUpdate.mutate(selectedGroup._id)}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsRenaming(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <span className="flex-1 text-sm text-muted-foreground">
                {selectedGroup.title}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsRenaming(true);
                  setEditTitle(selectedGroup.title);
                }}
              >
                Rename
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => mutationDelete.mutate(selectedGroup._id)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      )}

      {isCreating ? (
        <div className="flex gap-2">
          <input
            autoFocus
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Group name..."
            className="flex-1 h-8 px-3 rounded-md border border-input bg-background text-sm text-foreground"
          />
          <Button
            size="sm"
            onClick={() => {
              mutation.mutate();
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
          className="w-full"
          onClick={() => setIsCreating(true)}
        >
          + New group
        </Button>
      )}
    </div>
  );
};

export default Group;
