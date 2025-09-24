import { Badge } from "./ui/Badge";
//import client from "../api/client";

interface Props {
  id: string;
  title: string;
  description: string;
  status: string;
  showAssignButton?: boolean;
  assignAction?: () => void;
  markDoneAction?: () => void;
}

export default function ComplaintCard({
  //id,
  title,
  description,
  status,
  showAssignButton,
  assignAction,
  markDoneAction,
}: Props) {
  const statusColors: any = {
    submitted: "bg-gray-100 text-gray-800",
    assigned_to_department: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-2">{description}</p>
      <Badge className={statusColors[status]}>{status}</Badge>

      {showAssignButton && assignAction && (
        <button
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={assignAction}
        >
          Assign
        </button>
      )}

      {markDoneAction && status !== "done" && (
        <button
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={markDoneAction}
        >
          Mark Done
        </button>
      )}
    </div>
  );
}
