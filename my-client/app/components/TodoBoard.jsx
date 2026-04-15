"use client";
import GroupCard from "./Groupcard";

const TodoBoard = ({
  group,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodo,
  onDeleteGroup,
}) => {
  // if (group.length === 0) {
  //   return (
  //     <div className="flex min-h-96 items-center justify-center">
  //       <p className="text-lg text-muted-foreground">
  //         Create a group to get started!
  //       </p>
  //     </div>
  //   );
  // }
  return (
    <div className="flex h-full gap-4 overflow-x-auto">
      {group.map((g) => (
        <GroupCard
          key={g._id}
          id={g._id}
          title={g.title}
          todos={g.todos}
          discription={g.description}
          // onAddTodo={onAddTodo}
          // onToggleTodo={onToggleTodo}
          // onDeleteTodo={onDeleteTodo}
          // onUpdateTodo={onUpdateTodo}
          // onDeleteGroup={onDeleteGroup}
        />
      ))}
    </div>
  );
};
export { TodoBoard };
