import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

export default function Topbar() {
  const { role, logout } = useAuth();

  return (
    <div className="bg-white shadow flex justify-between items-center p-4">
      <h1 className="text-xl font-semibold">{role?.toUpperCase() || "USER"} PANEL</h1>
      <button
        className="flex items-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        onClick={logout}
      >
        <LogOut className="mr-1" /> Logout
      </button>
    </div>
  );
}
