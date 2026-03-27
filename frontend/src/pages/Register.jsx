import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { User, Mail, Lock, Loader2, UserPlus, ChevronDown } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Floating Glowing Shapes */}
      <div className="absolute top-[15%] right-[10%] w-72 h-72 bg-white/10 rounded-full blur-3xl" style={{animation: 'pulse-glow 4s ease-in-out infinite'}} />
      <div className="absolute bottom-[5%] left-[10%] w-96 h-96 bg-purple-300/10 rounded-full blur-3xl" style={{animation: 'pulse-glow 5s ease-in-out infinite 1s'}} />

      <div className="glass p-10 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-white/70 text-sm mt-2">Join the Digital Twin platform</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 text-white p-3 rounded-xl text-sm text-center mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input
              type="text"
              required
              className="w-full pl-12 pr-4 py-3.5 rounded-xl input-glass text-sm font-medium"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input
              type="email"
              required
              className="w-full pl-12 pr-4 py-3.5 rounded-xl input-glass text-sm font-medium"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input
              type="password"
              required
              className="w-full pl-12 pr-4 py-3.5 rounded-xl input-glass text-sm font-medium"
              placeholder="Password (min 6 chars)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="relative">
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={18} />
            <select
              className="w-full px-4 py-3.5 rounded-xl input-glass text-sm font-medium appearance-none cursor-pointer"
              defaultValue="STUDENT"
            >
              <option value="STUDENT" className="bg-indigo-600 text-white">Student</option>
              <option value="ADMIN" className="bg-indigo-600 text-white">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-indigo-600 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-white/70 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-semibold underline underline-offset-4 decoration-white/40 hover:decoration-white transition-all">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
