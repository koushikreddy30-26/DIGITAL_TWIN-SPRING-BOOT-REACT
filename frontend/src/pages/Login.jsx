import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Loader2, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Floating Glowing Shapes */}
      <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-white/10 rounded-full blur-3xl" style={{animation: 'pulse-glow 4s ease-in-out infinite'}} />
      <div className="absolute bottom-[10%] right-[15%] w-96 h-96 bg-pink-300/10 rounded-full blur-3xl" style={{animation: 'pulse-glow 5s ease-in-out infinite 1s'}} />
      <div className="absolute top-[50%] right-[5%] w-48 h-48 bg-blue-300/10 rounded-full blur-3xl" style={{animation: 'pulse-glow 3s ease-in-out infinite 2s'}} />

      <div className="glass p-10 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">Digital Twin</h1>
          <p className="text-white/70 text-sm mt-2">Track. Predict. Improve.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 text-white p-3 rounded-xl text-sm text-center mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input
              type="email"
              required
              className="w-full pl-12 pr-4 py-3.5 rounded-xl input-glass text-sm font-medium"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input
              type="password"
              required
              className="w-full pl-12 pr-4 py-3.5 rounded-xl input-glass text-sm font-medium"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-indigo-600 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-white/70 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-white font-semibold underline underline-offset-4 decoration-white/40 hover:decoration-white transition-all">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;