import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { Skull, LogOut } from 'lucide-react';

const BannedScreen: React.FC = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border-2 border-red-500/50 text-center">
          <Skull className="h-16 w-16 sm:h-20 sm:w-20 text-red-400 mx-auto mb-6 animate-pulse" />
          
          <h1 className="text-2xl sm:text-3xl font-bold text-red-400 mb-4">
            💀 YOU HAVE BEEN DESTROYED 💀
          </h1>
          
          <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/30 mb-6">
            <p className="text-red-300 text-sm sm:text-base mb-3">
              Your character has been defeated in battle and permanently deleted.
            </p>
            <p className="text-red-400 font-bold text-sm sm:text-base">
              Your account is now BANNED from XomnieWar.
            </p>
          </div>
          
          <div className="space-y-3 text-gray-300 text-sm">
            <p>⚔️ You challenged a stronger opponent</p>
            <p>💀 Your OC was completely destroyed</p>
            <p>🚫 You can never create another character</p>
            <p>🔒 This ban is permanent and irreversible</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full mt-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Leave XomnieWar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannedScreen;