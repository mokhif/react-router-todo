import React from "react";
import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { LogOut, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { set } from "zod";
const Navbar = ({ user, handlLogout }) => {
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
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Tasks
          </h1>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            Welcome back, {user?.name || "User"}!
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
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

          <Button
            onClick={handlLogout}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
