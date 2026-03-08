import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Check, Trash2, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
export default function HomePage() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:5000/me", { withCredentials: true });
      } catch (error) {
        navigate("/login");
        console.error(error.response.data);
      }
    };
    checkAuth();
  }, []);
  const handlLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        {
          withCredentials: true,
        },
      );
      navigate("/login");
    } catch (error) {
      console.error(error.response.data);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
            <p className="text-muted-foreground text-sm mt-1">All caught up!</p>
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

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Input Section */}
        <Card className="p-6 mb-8 border-border bg-card shadow-sm">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-background text-foreground border-border placeholder:text-muted-foreground/50"
            />
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6">
              Add
            </Button>
          </div>
        </Card>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border pb-4">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? "text-primary border-b-2 border-primary -mb-4"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          <Card className="p-4 border-border bg-card hover:bg-secondary/20 transition-colors group">
            <div className="flex items-center gap-3">
              <button className="shrink-0 w-6 h-6 rounded border-2 border-border hover:border-primary transition-all flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </button>
              <span className="flex-1 text-foreground">Sample task</span>
              <button className="shrink-0 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
