import { NavLink } from "react-router-dom";
import { Home, Users, CheckCircle } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-8">Municipal Portal</h2>
      <NavLink to="/admin/dashboard" className="flex items-center mb-3 hover:bg-gray-700 p-2 rounded">
        <Home className="mr-2" /> Admin Dashboard
      </NavLink>
      <NavLink to="/manager/dashboard" className="flex items-center mb-3 hover:bg-gray-700 p-2 rounded">
        <Users className="mr-2" /> Manager Dashboard
      </NavLink>
      <NavLink to="/worker/tasks" className="flex items-center mb-3 hover:bg-gray-700 p-2 rounded">
        <CheckCircle className="mr-2" /> Worker Tasks
      </NavLink>
    </div>
  );
}
