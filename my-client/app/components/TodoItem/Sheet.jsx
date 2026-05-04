import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "../ui/sheet";
const Sheet = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle>Edit Task</SheetTitle>
          <SheetDescription>
            Update the details for this task below.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={todoTitle}
              onChange={(e) => setTodoTitle(e.target.value)}
              placeholder="Task title..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={todoDescription}
              onChange={(e) => setTodoDescription(e.target.value)}
              placeholder="Add details about this task..."
              className="min-h-37.5 resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Groups</Label>
            <Select value={tagetGroupId} onValueChange={setTagetGroupId}>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Move To Group..." />
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
          <div className="my-6 border-t border-border" />

          <div className="flex flex-col flex-1 min-h-0 h-[calc(100vh-350px)] mt-4">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-semibold">Activity</h3>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                {comments?.length || 0}
              </span>
            </div>

            {/* --- 2. COMMENTS LIST AREA --- */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 min-h-0 mb-6 custom-scrollbar">
              {comments?.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="relative flex items-start gap-3"
                  >
                    {/* Avatar Placeholder */}
                    <div className="h-7 w-7 rounded-full bg-secondary border flex items-center justify-center text-[10px] font-bold shrink-0">
                      {comment.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">
                          {comment.user?.name || "Unknown User"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-foreground bg-accent/30 p-2 rounded-md border border-border/50">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-muted-foreground italic">
                    No comments yet. Start the conversation!
                  </p>
                </div>
              )}
            </div>

            {/* --- 3. COMMENT INPUT AREA --- */}
            <div className="space-y-3 pt-4 border-t border-border bg-background sticky bottom-0">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                  ME
                </div>
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="min-h-[80px] text-sm resize-none focus-visible:ring-1"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => mutationAddComment.mutate()}
                  disabled={!commentText.trim() || mutationAddComment.isPending}
                >
                  {mutationAddComment.isPending ? "Sending..." : "Comment"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-8">
          <Button
            className="w-full"
            onClick={() => mutationUpdateTodo.mutate(_id)}
            disabled={mutationUpdateTodo.isPending || !todoTitle.trim()}
          >
            {mutationUpdateTodo.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Sheet;
