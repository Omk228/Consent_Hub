import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react"; 
import { useAuth } from "../../api/AuthContext";
import api from "../../api/axios"; 

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // FIX 1: MySQL Role se sync karne ke liye 'OWNER' rakha hai
  const [role, setRole] = useState('OWNER'); 
  
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(''); 

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', {
        name: fullName,
        email,
        password,
        role // Ab ye sahi 'OWNER' ya 'CONSUMER' bhejega
      });
      
      const { user, token } = response.data;
      login(user, token); 

      // FIX 2: Navigation path simple dashboard rakha hai loop se bachne ke liye
      const target = role === 'OWNER' ? '/owner/dashboard' : '/consumer/dashboard';
      navigate(target, { replace: true });

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white">
      {/* Left Side: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] relative items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600 blur-[120px] rounded-full" />
        </div>
        <div className="relative z-10 max-w-md text-center">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-6">
            <Shield className="w-12 h-12 text-indigo-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">ConsentHub</h1>
          <p className="text-slate-400 text-lg mb-12">Grant, manage, and revoke access with complete transparency.</p>
          <ul className="space-y-4 text-left inline-block">
            {["Full control over data", "Real-time audit logs", "Enterprise-grade security"].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="w-5 h-5 text-indigo-500" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-6 py-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create your account</h2>
            <p className="text-slate-500 mt-2">Start managing your data consent today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Full name</label>
              <input
                type="text"
                required
                placeholder="John Smith"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Work email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create password"
                  className="w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Account type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('OWNER')}
                  className={`p-3 border rounded-xl text-left transition-all ${role === 'OWNER' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200'}`}
                >
                  <p className="font-bold text-sm text-slate-900 leading-none">Data Owner</p>
                  <p className="text-[10px] text-slate-500 mt-1">Manage own data</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('CONSUMER')}
                  className={`p-3 border rounded-xl text-left transition-all ${role === 'CONSUMER' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200'}`}
                >
                  <p className="font-bold text-sm text-slate-900 leading-none">Data Consumer</p>
                  <p className="text-[10px] text-slate-500 mt-1">Request access</p>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                id="agree"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 text-indigo-600 rounded border-slate-300 cursor-pointer"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <label htmlFor="agree" className="text-xs text-slate-600 leading-normal cursor-pointer">
                I agree to the <span className="text-indigo-600 font-bold">Terms of Service</span> and <span className="text-indigo-600 font-bold">Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!agreeTerms || !hasMinLength || !hasUppercase || !hasNumber || isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Create account'}
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-center text-sm mt-4">{error}</p>
          )}

          <p className="text-center text-sm text-slate-600">
            Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;