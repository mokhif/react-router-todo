import Navbar from "@/components/Navbar";
import { TodoBoard } from "@/components/TodoBoard";
import axios from "axios";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export default function Home() {
  //states
  //hooks
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  //fetching group
  const {
    data: groups,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: () =>
      axios
        .get("http://localhost:5000/group", { withCredentials: true })
        .then((res) => res.data),
  });
  const handleLogout = () => {
    axios
      .post("http://localhost:5000/logout", {}, { withCredentials: true })
      .then(() => {
        queryClient.invalidateQueries(["user"]);
        navigate("/login");
      });
  };
  if (error) return <div>{error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Navbar handleLogout={handleLogout} />
      <main className="flex-1 overflow-hidden p-6">
        <TodoBoard groups={groups} />
      </main>
    </div>
  );
}
