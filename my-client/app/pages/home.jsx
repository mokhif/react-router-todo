import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import AddTodoInput from "@/components/AddTodoInput";
import TaksRender from "@/components/TaksRender";

import Groops from "@/components/Groops";

export default function HomePage() {
  //Hooks
  //Navigating
  const navigate = useNavigate();
  //state
  const [selectedGroup, setSelectedGroup] = useState("all");
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
      <Header handlLogout={handlLogout} user={user} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <AddTodoInput />
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Group
          </label>
          <Groops />
        </div>

        <TaksRender />
      </main>
    </div>
  );
}
