import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, role }) {
  const { student, admin } = useSelector((state) => state.auth)
  if (role === 'student' && !student) return <Navigate to="/student/login" />
  if (role === 'admin' && !admin) return <Navigate to="/admin/login" />
  return children
}