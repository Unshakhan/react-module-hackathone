import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import smitLogo from '../assets/smit-logo-removebg-preview.png'

export default function Home() {
  const posts = [
    { id: 1, title: 'New Batch Starting Soon!', desc: 'SMIT is launching new batches for Web Dev, AI, and Cybersecurity courses. Apply Now!', date: 'April 1, 2025', img: 'https://placehold.co/400x220/1e3a5f/white?text=SMIT+News' },
    { id: 2, title: 'Free Courses for Youth', desc: 'Saylani Welfare Trust offering 100% free IT courses for deserving students across Pakistan.', date: 'March 28, 2025', img: 'https://placehold.co/400x220/166534/white?text=Free+Courses' },
    { id: 3, title: 'Graduation Ceremony 2025', desc: 'Congratulations to our batch 12 graduates! Join us for the ceremony at SMIT Karachi.', date: 'March 20, 2025', img: 'https://placehold.co/400x220/1e3a5f/white?text=Graduation' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
             <img src={smitLogo} alt="SMIT" className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
          <div className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">Saylani Mass IT Training</div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">Empowering Pakistan's<br /><span className="text-green-400">Digital Future</span></h1>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">Join thousands of students learning world-class IT skills for free. Apply for courses, manage your learning journey, all in one place.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/student/login" className="bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-3 rounded-full transition transform hover:scale-105 shadow-lg">Student Login</Link>
            <Link to="/student/signup" className="bg-white text-blue-900 hover:bg-blue-50 font-bold px-8 py-3 rounded-full transition transform hover:scale-105 shadow-lg">Sign Up</Link>
            <Link to="/courses" className="border-2 border-white hover:bg-white hover:text-blue-900 font-bold px-8 py-3 rounded-full transition transform hover:scale-105">View Courses →</Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-10 shadow-sm">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center px-4">
          {[['10,000+','Students Enrolled'],['25+','Courses Available'],['50+','Expert Instructors'],['100%','Free Education']].map(([num, label]) => (
            <div key={label}>
              <div className="text-3xl font-black text-blue-800">{num}</div>
              <div className="text-gray-500 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Facebook Posts */}
      <div className="max-w-6xl mx-auto py-14 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-blue-900">Latest Updates</h2>
          <p className="text-gray-500 mt-2">From our official Facebook page</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
              <img src={post.img} alt={post.title} className="w-full h-44 object-cover" />
              <div className="p-5">
                <span className="text-xs text-green-600 font-semibold">{post.date}</span>
                <h3 className="font-bold text-blue-900 text-lg mt-1">{post.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{post.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-green-700 to-blue-800 text-white py-14 text-center px-4">
        <h2 className="text-3xl font-black mb-3">Ready to Start Your Journey?</h2>
        <p className="text-green-200 mb-6">Enroll in free IT courses and transform your career today.</p>
        <Link to="/courses" className="bg-white text-blue-900 font-bold px-10 py-3 rounded-full hover:bg-green-100 transition text-lg">Explore Courses</Link>
      </div>

      <footer className="bg-blue-950 text-blue-300 text-center py-6 text-sm">
        © 2025 SMIT Connect Portal — Saylani Welfare International Trust
      </footer>
    </div>
  )
}