import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Check, Trash2, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Pencil, CheckCheck } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingButton from "@/components/LoadingButton";
export default function HomePage() {
  //Hooks
  const queryClient = useQueryClient();
  //Navigating
  const navigate = useNavigate();
  //States
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [input, setInput] = useState("");
  //Setting editing state
  const handleEditedInput = (id, title) => {
    setEditingId(id);
    setEditTitle(title);
  };
  //Deleting Todo

  const mutationDelete = useMutation({
    mutationFn: (id) =>
      axios
        .delete(`http://localhost:5000/todos/${id}`, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["todos"]),
  });
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
  //Adding Todo

  const mutationAdd = useMutation({
    mutationFn: () =>
      axios
        .post(
          "http://localhost:5000/todos",
          { title: input },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      setInput("");
    },
  });

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
  //Fetching Todos

  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: () =>
      axios
        .get("http://localhost:5000/todos", { withCredentials: true })
        .then((res) => res.data),
  });
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
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome back, {user?.name}!
            </p>
          </div>
          <Button
            onClick={handlLogout}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Card className="p-6 mb-8 border-border bg-card shadow-sm">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-background text-foreground border-border placeholder:text-muted-foreground/50"
            />
            {/* {mutationAdd.isPending ? (
              <Spinner />
            ) : (
              <Button
                onClick={() => mutationAdd.mutate()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
              >
                Add
              </Button>
            )} */}
            <LoadingButton
              onClick={() => mutationAdd.mutate()}
              isPending={mutationAdd.isPending}
            >
              Add
            </LoadingButton>
          </div>
        </Card>

        <div className="space-y-2">
          {(todos || []).map((todo) => (
            <Card
              key={todo._id}
              className="p-4 border-border bg-card hover:bg-secondary/20 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <button className="shrink-0 w-6 h-6 rounded border-2 border-border hover:border-primary transition-all flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </button>

                {editingId === todo._id ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1"
                  />
                ) : (
                  <span className="flex-1 text-foreground">{todo.title}</span>
                )}

                {
                  <button
                    onClick={
                      editingId === todo._id
                        ? () => handleConfirmEdit(todo._id)
                        : () => handleEditedInput(todo._id, todo.title)
                    }
                    className="shrink-0 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                  >
                    {editingId === todo._id ? (
                      <CheckCheck className="w-4 h-4" />
                    ) : (
                      <Pencil className="w-4 h-4" />
                    )}
                  </button>
                }
                <button
                  onClick={() => mutationDelete.mutate(todo._id)}
                  className="shrink-0 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
