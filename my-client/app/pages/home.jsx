import Navbar from "@/components/Navbar";
import { TodoBoard } from "@/components/TodoBoard";
import axios from "axios";
import { useQueryClient, useQuery } from "@tanstack/react-query";
export default function Home() {
  //states

  //hooks
  const queryClient = useQueryClient();
  //fetching group
  const {
    data: group,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["group"],
    queryFn: () =>
      axios
        .get("http://localhost:5000/group", { withCredentials: true })
        .then((res) => res.data),
  });

  if (error) return <div>{error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  console.log("My Group Data:", group);
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Navbar />
      <main className="flex-1 overflow-hidden p-6">
        <TodoBoard group={group} />
      </main>
    </div>
  );
}
