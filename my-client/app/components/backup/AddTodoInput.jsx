import React from "react";
import { useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import LoadingButton from "./LoadingButton";
const AddTodoInput = ({ selectedGroupId }) => {
  const [input, setInput] = useState("");
  //Adding Todo
  const queryClient = useQueryClient();
  const mutationAdd = useMutation({
    mutationFn: () =>
      axios
        .post(
          "http://localhost:5000/todos",
          { title: input, group: selectedGroupId },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      setInput("");
    },
  });

  return (
    <Card className="p-6 mb-8 border-border bg-card shadow-sm">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-background text-foreground border-border placeholder:text-muted-foreground/50"
        />
        <LoadingButton
          onClick={() => mutationAdd.mutate()}
          isPending={mutationAdd.isPending}
        >
          Add
        </LoadingButton>
      </div>
    </Card>
  );
};

export default AddTodoInput;
