import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";

import MainLayout from "../layouts/MainLayout";

import Auth from "../pages/Auth";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Tasks from "../pages/Tasks";
import TaskDetails from "../pages/TaskDetails";
import MyTasks from "../pages/MyTasks";
import CreateTask from "../pages/CreateTask";

import Users from "../pages/Users";

import RoleRoute from "../routes/RoleRoute";
import { Role } from "../store/authStore";


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>

          <Route element={<RoleRoute allowedRoles={[Role.Executor, Role.Manager]} />}>
            <Route path="/my-tasks" element={<MyTasks />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={[Role.Manager, Role.Admin]} />}>
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/create" element={<CreateTask />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={[Role.Admin]} />}>
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<h1>404 - Страница не найдена</h1>} />
    </Routes>
  );
}
