import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Check, Trash2, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Pencil, CheckCheck } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingButton from "@/components/LoadingButton";
import Header from "@/components/Header";
import AddTodoInput from "@/components/AddTodoInput";
import TaksRender from "@/components/TaksRender";
export default function HomePage() {
  //Hooks
  const queryClient = useQueryClient();
  //Navigating
  const navigate = useNavigate();
  //States
  const [editTitle, setEditTitle] = useState("");
  //Setting editing state
  const handleEditedInput = (id, title) => {
    setEditingId(id);
    setEditTitle(title);
  };

  //Updating Todo

  const mutationUpdate = useMutation({
    mutationFn: (id) =>
      axios.put(
        `http://localhost:5000/todos/${id}`,
        { title: editTitle },
        { withCredentials: true },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      setEditTitle("");
      setEditingId(null);
    },
  });
  //Confirming Edit

  const handleConfirmEdit = () => {
    mutationUpdate.mutate(editingId);
  };

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

        <TaksRender />
      </main>
    </div>
  );
}
