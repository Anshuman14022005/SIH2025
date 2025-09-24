import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

// ✅ Auth Pages
import Login from "../pages/Auth/Login"

// ✅ Admin Pages
import AdminDashboard from "../pages/Admin/Dashboard"
import ComplainDetail from "../pages/Admin/ComplainDetail"

// ✅ Manager Pages
import AssignWorker from "../pages/Manager/AssignWorker"

// ✅ Worker Pages
import WorkerTasks from "../pages/Worker/TaskList"
import TaskDetail from "../pages/Worker/TaskDetail"

// ✅ Context
import { useAuth } from "../context/AuthContext"

export default function AppRoutes() {
  const { role, loading } = useAuth()

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>

  return (
    <Router>
      <Routes>
        {/* Default route → redirect based on role */}
        <Route
          path="/"
          element={
            role === "admin" ? <Navigate to="/admin/dashboard" replace /> :
            role === "manager" ? <Navigate to="/manager/assign" replace /> :
            role === "worker" ? <Navigate to="/worker/tasks" replace /> :
            <Navigate to="/login" replace />
          }
        />

        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/complaints/:id"
          element={role === "admin" ? <ComplainDetail /> : <Navigate to="/login" />}
        />

        {/* Manager */}
        <Route
          path="/manager/assign"
          element={role === "manager" ? <AssignWorker /> : <Navigate to="/login" />}
        />

        {/* Worker */}
        <Route
          path="/worker/tasks"
          element={role === "worker" ? <WorkerTasks /> : <Navigate to="/login" />}
        />
        <Route
          path="/worker/tasks/:id"
          element={role === "worker" ? <TaskDetail /> : <Navigate to="/login" />}
        />

        {/* 404 Fallback */}
        <Route
          path="*"
          element={<p className="p-6 text-gray-500">Page not found</p>}
        />
      </Routes>
    </Router>
  )
}
