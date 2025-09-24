// pages/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import ComplaintCard from "../../components/ComplainCard";
import client from "../../api/client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await client.get("/admin/complaints");
        setComplaints(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          window.location.href = "/login"; // redirect to login
        } else {
          console.error("Failed to fetch complaints:", err);
        }
      }
    };

    fetchComplaints();
  }, []);

  const filtered = complaints.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "" || c.status === filter)
  );

  // Pie chart data
  const statusCounts = complaints.reduce((acc: any, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ["#FBBF24", "#2563EB", "#10B981", "#9CA3AF"],
      },
    ],
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="border p-2 rounded flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="assigned_to_department">Assigned to Dept</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="mb-8 w-1/3">
        <Pie data={chartData} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <ComplaintCard
            key={c.id}
            {...c}
            showAssignButton={true}
            assignAction={async () => {
              const dept = prompt("Enter Department ID:");
              if (!dept) return;

              try {
                await client.post(`/admin/assign/${c.id}`, { department_id: dept });
                alert("Assigned successfully!");
                // Optionally refresh complaints after assignment
                const res = await client.get("/admin/complaints");
                setComplaints(res.data);
              } catch (err: any) {
                if (err.response?.status === 401) {
                  alert("Session expired. Please log in again.");
                  window.location.href = "/login";
                } else {
                  console.error("Failed to assign department:", err);
                  alert("Failed to assign department");
                }
              }
            }}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}
