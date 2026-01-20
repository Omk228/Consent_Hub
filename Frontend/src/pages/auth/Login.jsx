import React, { useState } from "react";
import { useAuth } from "../../api/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulation: owner@test.com will be OWNER, else CONSUMER
    const role = email.toLowerCase().includes('owner') ? 'OWNER' : 'CONSUMER'; 
    
    const userData = { id: 'user_' + Date.now(), email, role };
    login(userData, 'mock-jwt-token'); 
    
    // Immediate navigation after state update
    navigate(role === 'OWNER' ? '/owner/dashboard' : '/consumer/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-white">
      {/* Left Branding Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600 blur-[100px] rounded-full" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <Shield className="w-16 h-16 text-indigo-400 mx-auto mb-8" />
          <h1 className="text-5xl font-bold text-white mb-6">ConsentHub</h1>
          <p className="text-slate-400 text-lg leading-relaxed">Enterprise-grade data consent management platform.</p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 mt-2">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none text-slate-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none text-slate-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]">
              Sign in
            </button>
          </form>

          <p className="text-center text-slate-600 text-sm">
            Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;