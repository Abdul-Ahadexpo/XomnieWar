import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { Sword, Shield, Zap } from 'lucide-react';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sword className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              XomnieWar
            </h1>
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
          </div>
          <p className="text-sm sm:text-base text-gray-300 px-4">Create your character. Battle others. Become legendary.</p>
        </div>

        {/* Auth Form */}
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 border border-purple-500/20">
          <div className="flex space-x-2 sm:space-x-4 mb-4 sm:mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                isLogin
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                !isLogin
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 sm:py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{isLogin ? 'Login' : 'Create Account'}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;