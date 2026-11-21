import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-bold text-white">FindMyPath</h3>
          <p className="mt-2 text-sm text-gray-400">
            Find the path between your skills and your future — step by step,
            from Class 10 to your first job.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
            <li><Link to="/degree-paths" className="hover:text-white">Degree Paths</Link></li>
            <li><Link to="/institutions" className="hover:text-white">Find Colleges</Link></li>
            <li><Link to="/scholarships" className="hover:text-white">Scholarships</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Your Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/register" className="hover:text-white">Sign Up</Link></li>
            <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-gray-500 flex flex-col md:flex-row gap-2 justify-between">
          <p>© {new Date().getFullYear()} FindMyPath. Built for students across India.</p>
          <p>College and scholarship details can change — always confirm on the official website before applying.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;