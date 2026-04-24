// app/routes.js
import { index, route } from "@react-router/dev/routes";

export default [
  route("login", "./pages/login.jsx"),
  route("register", "./pages/register.jsx"),
  route("/", "./pages/home.jsx"),
];
