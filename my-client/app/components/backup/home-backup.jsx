import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import AddTodoInput from "@/components/backup/AddTodoInput";
import TaksRender from "@/components/backup/TaksRender";

import Group from "@/components/backup/Group";
import GroupCard from "@/components/GroupCard";

export default function HomePage() {
  //Hooks
  //Navigating
  const navigate = useNavigate();
  //state
  const [selectedGroupId, setSelectedGroupId] = useState("");

  //Fetching User

  const { data: user, error: userError } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      axios
        .get("http://localhost:5000/me", { withCredentials: true })
        .then((res) => res.data),
  });
  //Redirect if not authenticated
  useEffect(() => {
    if (userError) navigate("/login");
  }, [userError]);

  //Logout

  const handlLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        { withCredentials: true },
      );
      navigate("/login");
    } catch (error) {
      console.error(error.response.data);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <Navbar handlLogout={handlLogout} user={user} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <AddTodoInput selectedGroupId={selectedGroupId} />
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Groups
          </label>
          <Group
            selectedGroupId={selectedGroupId}
            setSelectedGroupId={setSelectedGroupId}
          />
        </div>

        <TaksRender />
        <GroupCard />
      </main>
    </div>
  );
}
