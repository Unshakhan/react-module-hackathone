import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Courses from './pages/Courses'
import StudentLogin from './pages/StudentLogin'
import StudentSignup from './pages/StudentSignup'
import StudentDashboard from './pages/StudentDashboard'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCourses from './pages/admin/AdminCourses'
import AdminLeaves from './pages/admin/AdminLeaves'
import AdminStudents from './pages/admin/AdminStudents'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/student/dashboard" element={
          <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/courses" element={
          <ProtectedRoute role="admin"><AdminCourses /></ProtectedRoute>
        } />
        <Route path="/admin/leaves" element={
          <ProtectedRoute role="admin"><AdminLeaves /></ProtectedRoute>
        } />
        <Route path="/admin/students" element={
          <ProtectedRoute role="admin"><AdminStudents /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App