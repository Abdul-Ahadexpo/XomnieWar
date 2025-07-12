import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { OC } from '../../types';
import OCCard from '../OC/OCCard';
import BattleArena from '../Battle/BattleArena';
import { User, Sword, LogOut, Home, Trophy, Skull, Bell, Search, BarChart3 } from 'lucide-react';
import HallOfDestruction from './HallOfDestruction';
import BattleRequests from './BattleRequests';
import Leaderboard from './Leaderboard';
import ExploreOCs from './ExploreOCs';

interface DashboardProps {
  oc: OC;
  uid: string;
  onEdit: () => void;
}

type TabType = 'profile' | 'battle' | 'hall' | 'requests' | 'leaderboard' | 'explore';

const Dashboard: React.FC<DashboardProps> = ({ oc, uid, onEdit }) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/oc/${encodeURIComponent(oc.name)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${oc.name} on XomnieWar!`,
          text: `Meet ${oc.name}, a powerful character with ${oc.stats.strength + oc.stats.speed + oc.stats.intelligence} total power!`,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackShare(shareUrl);
      }
    } else {
      fallbackShare(shareUrl);
    }
  };

  const fallbackShare = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      alert('Character URL copied to clipboard!');
    }).catch(() => {
      prompt('Copy this URL to share your character:', url);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sword className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  XomnieWar
                </span>
              </div>
              
              <div className="hidden md:flex space-x-2 lg:space-x-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 lg:py-2 rounded-lg transition-colors text-sm lg:text-base ${
                    activeTab === 'profile'
                      ? 'bg-purple-600/30 text-purple-300'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <Home className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('battle')}
                  className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 lg:py-2 rounded-lg transition-colors text-sm lg:text-base ${
                    activeTab === 'battle'
                      ? 'bg-purple-600/30 text-purple-300'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <Trophy className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>Battle Arena</span>
                </button>
                <button
                  onClick={() => setActiveTab('hall')}
                  className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 lg:py-2 rounded-lg transition-colors text-sm lg:text-base ${
                    activeTab === 'hall'
                      ? 'bg-purple-600/30 text-purple-300'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <Skull className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>Hall of Destruction</span>
                </button>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 lg:py-2 rounded-lg transition-colors text-sm lg:text-base ${
                    activeTab === 'requests'
                      ? 'bg-purple-600/30 text-purple-300'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <Bell className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>Requests</span>
                </button>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 lg:py-2 rounded-lg transition-colors text-sm lg:text-base ${
                    activeTab === 'leaderboard'
                      ? 'bg-purple-600/30 text-purple-300'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <BarChart3 className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>Leaderboard</span>
                </button>
                <button
                  onClick={() => setActiveTab('explore')}
                  className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 lg:py-2 rounded-lg transition-colors text-sm lg:text-base ${
                    activeTab === 'explore'
                      ? 'bg-purple-600/30 text-purple-300'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <Search className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span>Explore</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2 text-gray-300">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline text-xs sm:text-sm truncate max-w-32">{auth.currentUser?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-xs sm:text-sm"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden bg-black/20 backdrop-blur-lg border-b border-purple-500/20">
        <div className="grid grid-cols-3 md:grid-cols-6 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center space-y-1 py-2 sm:py-3 ${
              activeTab === 'profile'
                ? 'bg-purple-600/30 text-purple-300'
                : 'text-gray-400'
            }`}
          >
            <Home className="h-3 w-3" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('battle')}
            className={`flex flex-col items-center justify-center space-y-1 py-2 sm:py-3 ${
              activeTab === 'battle'
                ? 'bg-purple-600/30 text-purple-300'
                : 'text-gray-400'
            }`}
          >
            <Trophy className="h-3 w-3" />
            <span>Battle</span>
          </button>
          <button
            onClick={() => setActiveTab('hall')}
            className={`flex flex-col items-center justify-center space-y-1 py-2 sm:py-3 ${
              activeTab === 'hall'
                ? 'bg-purple-600/30 text-purple-300'
                : 'text-gray-400'
            }`}
          >
            <Skull className="h-3 w-3" />
            <span>Hall</span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex flex-col items-center justify-center space-y-1 py-2 sm:py-3 ${
              activeTab === 'requests'
                ? 'bg-purple-600/30 text-purple-300'
                : 'text-gray-400'
            }`}
          >
            <Bell className="h-3 w-3" />
            <span>Requests</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex flex-col items-center justify-center space-y-1 py-2 sm:py-3 ${
              activeTab === 'leaderboard'
                ? 'bg-purple-600/30 text-purple-300'
                : 'text-gray-400'
            }`}
          >
            <BarChart3 className="h-3 w-3" />
            <span>Leaders</span>
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center justify-center space-y-1 py-2 sm:py-3 ${
              activeTab === 'explore'
                ? 'bg-purple-600/30 text-purple-300'
                : 'text-gray-400'
            }`}
          >
            <Search className="h-3 w-3" />
            <span>Explore</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-4">
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto px-2">
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">Your Character</h1>
              <p className="text-sm sm:text-base text-gray-300 px-4">Manage and share your original character</p>
            </div>
            
            <div className="max-w-sm sm:max-w-md mx-auto">
              <OCCard
                oc={oc}
                isOwner={true}
                onEdit={onEdit}
                onShare={handleShare}
              />
            </div>
          </div>
        )}

        {activeTab === 'battle' && (
          <BattleArena userOC={oc} currentUid={uid} />
        )}

        {activeTab === 'hall' && (
          <HallOfDestruction />
        )}

        {activeTab === 'requests' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Battle Requests</h1>
              <p className="text-gray-300">Manage incoming battle challenges</p>
            </div>
            <BattleRequests />
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Leaderboard</h1>
              <p className="text-gray-300">Top warriors in XomnieWar</p>
            </div>
            <Leaderboard />
          </div>
        )}

        {activeTab === 'explore' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Explore Characters</h1>
              <p className="text-gray-300">Discover other warriors and potential opponents</p>
            </div>
            <ExploreOCs />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;