import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Check, Trash2, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Pencil, CheckCheck } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export default function HomePage() {
  //Hooks
  const queryClient = useQueryClient();
  //Navigating
  const navigate = useNavigate();
  //States
  const [editedInputId, setEditedInputId] = useState(null);
  const [editedInput, setEditedInput] = useState("");
  const [input, setInput] = useState("");

  const handleEditedInput = (id, title) => {
    (setEditedInputId(id), setEditedInput(title));
  };
  //Deleting Todo
  const mutationDelete = useMutation({
    mutationFn: (id) =>
      axios
        .delete(`http://localhost:5000/todos/${id}`, {
          withCredentials: true,
        })
        .then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["todos"]),
  });
  //updating a todo
  const mutationUpdate = useMutation({
    mutationFn: (id) =>
      axios.put(
        `http://localhost:5000/todos/${id}`,
        { title: editedInput },
        { withCredentials: true },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
       setEditedInput("");
    setEditedInputId(null);
    },
  });
  const handleConfirmEdit = () => {
    mutationUpdate.mutate(editedInputId);
   
  };
  //Posting-Todo
  const mutation = useMutation({
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
  //Getting(fetching)-User
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      axios
        .get("http://localhost:5000/me", { withCredentials: true })
        .then((res) => res.data),
  });
  //me if error go to login
  useEffect(() => {
    if (userError) navigate("/login");
  }, [userError]);
  //Getting(fetching)-Todos
  const {
    data: todos,
    isLoading: todoLoading,
    error: todoError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: () =>
      axios
        .get("http://localhost:5000/todos", { withCredentials: true })
        .then((res) => res.data),
  });

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
            <Button
              onClick={() => mutation.mutate()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
            >
              Add
            </Button>
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

                {editedInputId === todo._id ? (
                  <Input
                    value={editedInput}
                    onChange={(e) => setEditedInput(e.target.value)}
                    className="flex-1"
                  />
                ) : (
                  <span className="flex-1 text-foreground">{todo.title}</span>
                )}

                <button
                  onClick={
                    editedInputId === todo._id
                      ? () => handleConfirmEdit(todo._id)
                      : () => handleEditedInput(todo._id, todo.title)
                  }
                  className="shrink-0 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                >
                  {editedInputId === todo._id ? (
                    <CheckCheck className="w-4 h-4" />
                  ) : (
                    <Pencil className="w-4 h-4" />
                  )}
                </button>
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
