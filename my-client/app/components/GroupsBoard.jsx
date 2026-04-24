"use client";
import GroupCard from "./Groupcard";

const GroupsBoard = ({ groups }) => {
  if (groups?.length === 0) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <p className="text-lg text-muted-foreground">
          Create a group to get started!
        </p>
      </div>
    );
  }
  return (
    <div className="flex h-full gap-4 overflow-x-auto">
      {groups?.map((group) => (
        <GroupCard key={group._id} group={group} />
      ))}
    </div>
  );
};
export { GroupsBoard };
