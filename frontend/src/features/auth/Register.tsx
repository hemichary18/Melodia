import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { username, email, password });
      login(data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const { data } = await api.post('/auth/google', { credential: credentialResponse.credential });
      login(data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google registration failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none">
        <div className="absolute bottom-0 -left-1/4 w-3/4 h-3/4 bg-pink-600/40 rounded-full blur-[150px] animate-spin-slow" />
        <div className="absolute top-0 -right-1/4 w-3/4 h-3/4 bg-primary/30 rounded-full blur-[150px] animate-spin-slow" style={{ animationDirection: 'reverse' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10 p-8 glass-card"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400 text-sm">Join Melodia and start listening</p>
        </div>

        {error && (
          <div className="bg-destructive/20 border border-destructive text-destructive-foreground p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                placeholder="Choose a username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                placeholder="Create a password"
                required
                minLength={6}
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all mt-4"
          >
            Sign Up
          </motion.button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-4">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-gray-500 text-sm">or sign up with</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setError('Google Sign Up Failed');
            }}
            theme="filled_black"
            shape="pill"
            text="signup_with"
          />
        </div>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:text-pink-500 font-medium transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};
