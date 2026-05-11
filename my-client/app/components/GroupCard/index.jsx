import { Button } from "@/components/ui/button";
import { CheckCheck, X } from "lucide-react";
import DropdownMenuComp from "./DropdownMenuComp";

import axios from "axios";
import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import AddTodoModal from "../AddTodoModal";
import { Input } from "../ui/input";
import TodoItemList from "./TodoItemList";
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
  //fetching Todos For Specific Group
  const { data: todos } = useQuery({
    queryKey: ["todos", _id],
    queryFn: () =>
      axios
        .get(`http://localhost:5000/todos/${_id}`, { withCredentials: true })
        .then((res) => res.data),
  });
  //reorder handlers
  const mutationReorderGroup = useMutation({
    mutationFn: (GroupArray) =>
      axios.put(
        "http://localhost:5000/group/reorderGroup",
        {
          newArrCopy: GroupArray.map((g) => g._id),
        },
        { withCredentials: true },
      ),
  });
  const moveLeft = async () => {
    await queryClient.cancelQueries({ queryKey: ["groups"] });

    const data = queryClient.getQueryData(["groups"]);
    if (!data) return;
    //finding the index of the card
    const index = data.findIndex((g) => g._id === _id);
    //if its on far left
    if (index <= 0) return;

    //create a copy and swap

    const newArr = [...data];
    const [removedGroup] = newArr.splice(index, 1);
    //tell ui to update
    newArr.splice(index - 1, 0, removedGroup);
    //invoke backend to save
    queryClient.setQueryData(["groups"], newArr);
    mutationReorderGroup.mutate(newArr);
  };
  const moveRight = async () => {
    await queryClient.cancelQueries({ queryKey: ["groups"] });

    const data = queryClient.getQueryData(["groups"]);
    if (!data) return;
    //finding the index of the card
    const index = data.findIndex((g) => g._id === _id);
    //if its on far right
    if (index >= data.length - 1) return;
    //create a copy and swap
    const newArr = [...data];
    const [removedGroup] = newArr.splice(index, 1);
    newArr.splice(index + 1, 0, removedGroup);
    //tell ui to update
    queryClient.setQueryData(["groups"], newArr);
    //invoke backend to save
    mutationReorderGroup.mutate(newArr);
  };
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
            <>
              <AddTodoModal id={_id} />
              <DropdownMenuComp
                handleEditing={handleEditing}
                _id={_id}
                mutationUpdateGroup={mutationUpdateGroup}
                mutationDeleteGroup={mutationDeleteGroup}
                group={group}
                todos={todos}
                moveLeft={moveLeft}
                moveRight={moveRight}
              />
            </>
          )}
        </div>
      </div>
      <TodoItemList todos={todos} group={group} />
    </div>
  );
};

export default GroupCard;
