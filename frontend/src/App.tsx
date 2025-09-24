import AppRoutes from "./routes/AppRoutes"
import { AuthProvider } from "./context/AuthContext"

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <AppRoutes />
      </div>
    </AuthProvider>
  )
}
