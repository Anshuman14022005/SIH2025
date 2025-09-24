import { useEffect, useState } from "react"
import DashboardLayout from "../../components/Layout/DashboardLayout"
import ComplaintCard from "../../components/ComplainCard"
import client from "../../api/client"

interface Complaint {
  id: string
  title: string
  description: string
  status: string
  worker_id?: string
}

export default function ManagerDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([])

  // Fetch manager complaints on mount
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await client.get("/manager/complaints")
        setComplaints(res.data)
      } catch (err) {
        console.error("Error fetching complaints:", err)
        alert("Failed to fetch complaints")
      }
    }

    fetchComplaints()
  }, [])

  // Assign a worker to a complaint
  const assignWorker = async (id: string) => {
    const worker = prompt("Enter Worker ID:")
    if (!worker) return

    try {
      await client.post(`/manager/assign/${id}`, { worker_id: worker })
      alert("Worker assigned!")

      // Optionally refresh complaints list
      const res = await client.get("/manager/complaints")
      setComplaints(res.data)
    } catch (err: any) {
      console.error("Error assigning worker:", err)
      alert("Failed to assign worker")
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {complaints.map((c) => (
          <ComplaintCard
            key={c.id}
            {...c}
            showAssignButton={true}
            assignAction={() => assignWorker(c.id)}
          />
        ))}
      </div>
    </DashboardLayout>
  )
}
