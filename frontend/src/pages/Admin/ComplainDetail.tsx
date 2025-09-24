// pages/admin/ComplaintDetail.tsx
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import client from "../../api/client"
import { Button } from "../../components/ui/Button"

interface Complaint {
  id: string
  title: string
  description: string
  status: string
  department_id: string | null
}

interface Department {
  id: string
  name: string
}

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedDept, setSelectedDept] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      setLoading(true)
      try {
        // Fetch complaint
        const { data: complaintData } = await client.get(`/admin/complaints/${id}`)
        setComplaint(complaintData)
        setSelectedDept(complaintData.department_id ?? "")

        // Fetch departments
        const { data: deptData } = await client.get("/departments")
        setDepartments(deptData || [])
      } catch (err: any) {
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.")
          navigate("/login")
        } else {
          console.error("Error fetching data:", err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, navigate])

  const handleAssign = async () => {
    if (!id || !selectedDept) return
    setAssigning(true)
    try {
      await client.post(`/admin/assign/${id}`, { department_id: selectedDept })
      alert("Complaint assigned successfully!")
      navigate("/admin/dashboard")
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.")
        navigate("/login")
      } else {
        console.error("Error assigning complaint:", err)
        alert("Failed to assign complaint")
      }
    } finally {
      setAssigning(false)
    }
  }

  if (loading) return <p className="p-6">Loading complaint...</p>
  if (!complaint) return <p className="p-6">Complaint not found.</p>

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">{complaint.title}</h1>
      <p className="mb-4 text-gray-700">{complaint.description}</p>

      <p className="mb-2">
        <span className="font-semibold">Status:</span> {complaint.status}
      </p>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assign to Department
        </label>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        >
          <option value="">-- Select Department --</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        <Button
          onClick={handleAssign}
          variant="primary"
          isLoading={assigning}
          disabled={!selectedDept}
        >
          Assign Complaint
        </Button>
      </div>
    </div>
  )
}
