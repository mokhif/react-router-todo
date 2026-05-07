import React from "react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "../ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Trash2 } from "lucide-react";
const SideSheet = ({ todo, group, setIsSheetOpen, isSheetOpen }) => {
  //hooks
  const queryClient = useQueryClient();
  //statess
  const [commentText, setCommentText] = useState("");
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [todoDescription, setTodoDescription] = useState(
    todo.description || "",
  );
  const [targetGroupId, setTagetGroupId] = useState(group._id);
  //fetching comments
  const { data: comments } = useQuery({
    queryKey: ["comments", todo._id],
    queryFn: () =>
      axios
        .get(`http://localhost:5000/comments/${todo._id}`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });
  //adding a  comments
  const mutationAddComment = useMutation({
    mutationFn: () =>
      axios
        .post(
          `http://localhost:5000/comments`,
          { content: commentText, todoId: todo._id },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", todo._id]);
      setCommentText("");
    },
  });
  //deleting comment
  const mutationDeleteComment = useMutation({
    mutationFn: (id) =>
      axios.delete(`http://localhost:5000/comments/${id}`, {
        withCredentials: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", todo._id]);
    },
  });
  /// Fetch all groups
  const { data: allGroups } = useQuery({
    queryKey: ["groups"],
    queryFn: () =>
      axios
        .get("http://localhost:5000/group", { withCredentials: true })
        .then((res) => res.data),
  });
  // updating todo (Title + Description)
  const mutationUpdateTodoAndDescription = useMutation({
    mutationFn: (id) =>
      axios
        .put(
          `http://localhost:5000/todos/${id}`,
          {
            title: todoTitle,
            description: todoDescription,
            group: targetGroupId,
          },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos", group._id]);
      setIsSheetOpen(false); // Close side panel on success
    },
  });
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <div className="flex flex-1 flex-col min-w-0 cursor-pointer text-left">
          <span
            className={`text-sm font-medium truncate ${todo.isDone ? "line-through text-muted-foreground" : "text-foreground"}`}
          >
            {todo.title}
          </span>
          {todo.description && (
            <span className="text-xs text-muted-foreground line-clamp-1">
              {todo.description}
            </span>
          )}
        </div>
      </SheetTrigger>

      {/* 1. LARGE WIDTH: Set to 850px for the "Workspace" feel */}
      <SheetContent
        side="right"
        className="w-full sm:max-w-[850px] flex flex-col h-full p-0"
      >
        {/* FIXED HEADER */}
        <SheetHeader className="px-8 py-6 border-b shrink-0">
          <SheetTitle className="text-2xl font-bold tracking-tight">
            Task Details
          </SheetTitle>
          <SheetDescription>
            View and edit all information related to this task.
          </SheetDescription>
        </SheetHeader>

        {/* SINGLE SCROLL AREA */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10 custom-scrollbar">
          {/* Inputs Section */}
          <div className="space-y-6">
            {/* TITLE BOX */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80"
              >
                Task Title
              </Label>
              <Input
                id="title"
                value={todoTitle}
                onChange={(e) => setTodoTitle(e.target.value)}
                placeholder="What needs to be done?"
                /* Subtle 1px border visible at all times */
                className="text-lg font-medium border border-border/60 bg-background h-12 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary"
              />
            </div>

            {/* DESCRIPTION BOX */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={todoDescription}
                onChange={(e) => setTodoDescription(e.target.value)}
                placeholder="Add a more detailed description..."
                /* Subtle 1px border visible at all times, not too thick */
                className="min-h-[200px] resize-none border border-border/60 bg-background p-4 text-base leading-relaxed focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary"
              />
            </div>

            {/* LIST SELECTION */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80">
                Current List
              </Label>
              <Select value={targetGroupId} onValueChange={setTagetGroupId}>
                <SelectTrigger className="w-full max-w-[260px] h-10 border-border/60">
                  <SelectValue placeholder="Select list..." />
                </SelectTrigger>
                <SelectContent>
                  {allGroups?.map((g) => (
                    <SelectItem key={g._id} value={g._id}>
                      {g.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ACTIVITY SECTION */}
          <div className="border-t border-border pt-10">
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-lg font-semibold">Activity</h3>
              <span className="text-[11px] font-bold bg-secondary px-2.5 py-1 rounded-full text-secondary-foreground uppercase tracking-wider">
                {comments?.length || 0} Comments
              </span>
            </div>

            {/* COMMENTS LIST */}
            <div className="space-y-8">
              {comments?.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="relative flex items-start gap-4 group/comment"
                  >
                    <div className="h-9 w-9 rounded-full bg-secondary/80 border border-border/40 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                      {comment.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">
                            {comment.user?.name || "User"}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-medium">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 opacity-0 group-hover/comment:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                          onClick={() =>
                            mutationDeleteComment.mutate(comment._id)
                          }
                          disabled={mutationDeleteComment.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm leading-relaxed text-foreground bg-accent/10 p-3.5 rounded-lg border border-border/30 shadow-sm">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-xl border-border/60 bg-accent/5">
                  <p className="text-sm text-muted-foreground italic">
                    No discussion yet. Start the conversation below.
                  </p>
                </div>
              )}
            </div>

            {/* NEW COMMENT INPUT */}
            <div className="space-y-4 pt-10 mt-10 border-t">
              <div className="flex items-start gap-4">
                <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  ME
                </div>
                <div className="flex-1 space-y-3">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="min-h-[100px] text-sm resize-none border border-border/60 bg-background focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => mutationAddComment.mutate()}
                      disabled={
                        !commentText.trim() || mutationAddComment.isPending
                      }
                      className="px-8 font-semibold shadow-sm"
                    >
                      {mutationAddComment.isPending
                        ? "Sending..."
                        : "Post Comment"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FIXED FOOTER */}
        <SheetFooter className="px-8 py-6 border-t shrink-0 bg-background">
          <Button
            size="lg"
            className="w-full text-base font-bold shadow-md"
            onClick={() => mutationUpdateTodoAndDescription.mutate(todo._id)}
            disabled={
              mutationUpdateTodoAndDescription.isPending || !todoTitle.trim()
            }
          >
            {mutationUpdateTodoAndDescription.isPending
              ? "Saving..."
              : "Save All Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SideSheet;
