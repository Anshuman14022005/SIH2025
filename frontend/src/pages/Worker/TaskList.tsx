import { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import ComplaintCard from "../../components/ComplainCard";
import client from "../../api/client";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await client.get("/worker/tasks");
        setTasks(res.data);
      } catch (err: any) {
        console.error("Error fetching tasks:", err.message);
      }
    };

    fetchTasks();
  }, []);

  const markDone = async (id: string) => {
    try {
      await client.post(`/worker/done/${id}`);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "done" } : t))
      );
      alert("Task marked done");
    } catch (err: any) {
      console.error("Error marking task done:", err.message);
      alert("Failed to mark task done");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((t) => (
          <ComplaintCard
            key={t.id}
            {...t}
            markDoneAction={() => markDone(t.id)}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}
