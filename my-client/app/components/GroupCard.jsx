import { Button } from "@/components/ui/button";
import TodoItem from "./TodoItem";
import { Plus, Trash2 } from "lucide-react";

const GroupCard = ({ title }) => {
  return (
    <div className="flex w-80 flex-shrink-0 flex-col rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-card-foreground">
            {title}
          </h2>
          <p className="text-xs text-muted-foreground">1 of 3 completed</p>
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-h-96 flex-1 space-y-2 overflow-y-auto p-4">
        <TodoItem />
      </div>
    </div>
  );
};

export default GroupCard;
