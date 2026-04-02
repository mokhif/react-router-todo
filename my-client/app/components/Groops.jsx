import React from "react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const Groops = () => {
  const groups = ["work", "finance", "gym", "Group 4"];

  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  return (
    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
      <SelectTrigger className="w-full bg-background border-border text-foreground">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {groups.map((group) => (
          <SelectItem key={group} value={group}>
            {group}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Groops;
