"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AddTodoModal = ({ isOpen, onClose, onSubmit }) => {
  const [todoText, setTodoText] = useState("");

  const handleSubmit = () => {
    if (todoText.trim()) {
      onSubmit(todoText.trim());
      setTodoText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Todo</DialogTitle>
          <DialogDescription>
            Enter the todo text below and click Save to add it to your list.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <input
            type="text"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
            placeholder="Enter your todo..."
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!todoText.trim()}>
            Save Todo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddTodoModal;
