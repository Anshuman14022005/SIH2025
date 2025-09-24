import { useEffect, useState } from "react"
import client from "../../api/client"
import { Button } from "../../components/ui/Button"

interface Complaint {
  id: string
  title: string
  description: string
  status: string
}

interface Worker {
  id: string
  name: string
  email: string
}

export default function AssignWorker() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState<string>("")

  // Fetch complaints & workers from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await client.get("/manager/complaints")
        setComplaints(res.data)
      } catch (err: any) {
        console.error("Error fetching complaints:", err.message)
      }
    }

    const fetchWorkers = async () => {
      try {
        const res = await client.get("/manager/workers")
        setWorkers(res.data)
      } catch (err: any) {
        console.error("Error fetching workers:", err.message)
      }
    }

    fetchComplaints()
    fetchWorkers()
  }, [])

  const handleAssign = async (complaintId: string) => {
    if (!selectedWorker) {
      alert("Please select a worker first")
      return
    }

    setLoading(true)
    try {
      await client.post(`/manager/assign/${complaintId}`, {
        worker_id: selectedWorker,
      })
      alert("Worker assigned successfully!")
      setComplaints((prev) =>
        prev.filter((complaint) => complaint.id !== complaintId)
      )
    } catch (err: any) {
      console.error("Assignment error:", err.message)
      alert("Failed to assign worker.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Assign Worker</h2>

      {complaints.length === 0 ? (
        <p className="text-gray-500">No complaints available for assignment.</p>
      ) : (
        complaints.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-white p-4 rounded-lg shadow-md mb-4"
          >
            <h3 className="text-lg font-semibold text-gray-700">{complaint.title}</h3>
            <p className="text-gray-600 text-sm">{complaint.description}</p>
            <div className="mt-3 flex items-center space-x-2">
              <select
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Select worker</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name} ({worker.email})
                  </option>
                ))}
              </select>

              <Button
                variant="primary"
                isLoading={loading}
                onClick={() => handleAssign(complaint.id)}
              >
                Assign
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
