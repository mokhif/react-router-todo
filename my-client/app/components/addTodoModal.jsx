import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
const AddTodoModal = ({ id }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");
  //adding Todo
  const mutatioAddTodo = useMutation({
    mutationFn: () =>
      axios
        .post(
          "http://localhost:5000/todos",
          { title: todoTitle, group: id },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos", id]);
      setTodoTitle("");
      setOpen(false);
    },
  });
  const handleSubmit = () => {
    if (todoTitle.trim()) {
      mutatioAddTodo.mutate();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
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
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
            placeholder="Enter your todo..."
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!todoTitle.trim() || mutatioAddTodo.isPending}
          >
            {mutatioAddTodo.isPending ? "Saving..." : "Save Todo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddTodoModal;

// <Dialog open={open} onOpenChange={setOpen}>
//   <DialogTrigger asChild>
//     <Button
//       onClick={() => setOpen(true)}
//       size="sm"
//       variant="ghost"
//       className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
//     >
//       <Plus className="h-4 w-4" />
//     </Button>
//   </DialogTrigger>
// </Dialog>
