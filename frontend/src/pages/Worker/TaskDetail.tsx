import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../api/client";
import { Button } from "../../components/ui/Button";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  assigned_worker?: string;
  created_at: string;
}

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch task details
  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      try {
        const res = await client.get(`/worker/tasks/${id}`);
        setTask(res.data);
      } catch (err: any) {
        console.error("Error fetching task:", err.message);
      }
    };
    fetchTask();
  }, [id]);

  // Update task status
  const updateStatus = async (newStatus: string) => {
    if (!id) return;
    setLoading(true);
    try {
      await client.post(`/worker/done/${id}`, { status: newStatus });
      alert(`Task marked as ${newStatus}`);
      navigate("/worker/tasks");
    } catch (err: any) {
      console.error("Error updating status:", err.message);
      alert("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  if (!task) {
    return <p className="p-6 text-gray-600">Loading task details...</p>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {task.title}
        </h2>
        <p className="text-gray-600 mb-2">{task.description}</p>
        <p className="text-sm text-gray-500 mb-4">
          Created: {new Date(task.created_at).toLocaleString()}
        </p>

        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${
            task.status === "done"
              ? "bg-green-100 text-green-700"
              : task.status === "in_progress"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Status: {task.status}
        </span>

        <div className="flex space-x-3">
          {task.status !== "in_progress" && (
            <Button
              variant="secondary"
              isLoading={loading}
              onClick={() => updateStatus("in_progress")}
            >
              Start Task
            </Button>
          )}

          {task.status !== "done" && (
            <Button
              variant="primary"
              isLoading={loading}
              onClick={() => updateStatus("done")}
            >
              Mark as Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
