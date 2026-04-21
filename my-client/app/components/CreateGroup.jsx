import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const CreateGroup = () => {
  //stats
  const [group, setGroup] = useState("");
  //dialog opener for adding group
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  //creating group
  const mutation = useMutation({
    mutationFn: () =>
      axios
        .post(
          "http://localhost:5000/group",
          { title: group },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["group"]);
      setOpen(false);
      setGroup("");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Group</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create New Group</DialogTitle>
        <div className="py-4">
          <input
            placeholder="Enter Group Name"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => mutation.mutate()}>
            {mutation.isPending ? "Creating..." : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
