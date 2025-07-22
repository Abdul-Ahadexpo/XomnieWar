import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { OC } from '../../types';
import OCCard from '../OC/OCCard';
import BattleArena from '../Battle/BattleArena';
import { User, Sword, LogOut, Home, Trophy, Skull, Bell, Search, BarChart3, Menu, X } from 'lucide-react';
import { Book } from 'lucide-react';
import HallOfDestruction from './HallOfDestruction';
import BattleRequests from './BattleRequests';
import Leaderboard from './Leaderboard';
import ExploreOCs from './ExploreOCs';
import InteractionGuide from '../Guide/InteractionGuide';

interface DashboardProps {
  oc: OC;
  uid: string;
  onEdit: () => void;
}

type TabType = 'profile' | 'battle' | 'hall' | 'requests' | 'leaderboard' | 'explore' | 'guide';

const Dashboard: React.FC<DashboardProps> = ({ oc, uid, onEdit }) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/oc/${uid}`;
    
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

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: Home },
    { id: 'battle', label: 'Battle Arena', icon: Trophy },
    { id: 'hall', label: 'Hall of Destruction', icon: Skull },
    { id: 'requests', label: 'Battle Requests', icon: Bell },
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'guide', label: 'Guide', icon: Book },
  ];

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Sword className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                XomnieWar
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TabType)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                      activeTab === item.id
                        ? 'bg-purple-600/30 text-purple-300'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-gray-300">
                <User className="h-4 w-4" />
                <span className="text-sm truncate max-w-32">{auth.currentUser?.email}</span>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-sm"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-purple-500/20 py-4">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id as TabType)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeTab === item.id
                          ? 'bg-purple-600/30 text-purple-300'
                          : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Your Character</h1>
              <p className="text-gray-300">Manage and share your original character</p>
            </div>
            
            <div className="max-w-md mx-auto">
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

        {activeTab === 'guide' && (
          <InteractionGuide />
        )}
      </div>
    </div>
  );
};

export default Dashboard;