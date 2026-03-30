import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
const Header = ({ user, handlLogout }) => {
  return (
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
  );
};

export default Header;
