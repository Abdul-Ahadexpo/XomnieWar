import React, { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../../firebase/config';
import { OC } from '../../types';
import { Trophy, Crown, Zap, Target } from 'lucide-react';
import { getTitleForOC, getTitleColor } from '../../utils/titles';

interface LeaderboardEntry {
  uid: string;
  oc: OC;
  wins: number;
  powersCount: number;
  totalPower: number;
}

const Leaderboard: React.FC = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'wins' | 'powers' | 'totalPower'>('wins');

  useEffect(() => {
    const usersRef = ref(database, 'users');
    
    const handleData = (snapshot: any) => {
      const users = snapshot.val();
      if (users) {
        const leaderboardData: LeaderboardEntry[] = [];
        
        Object.entries(users).forEach(([uid, userData]: [string, any]) => {
          if (userData.oc && !userData.banned) {
            const oc = userData.oc;
            leaderboardData.push({
              uid,
              oc,
              wins: oc.wins || 0,
              powersCount: oc.powers.length,
              totalPower: oc.stats.strength + oc.stats.speed + oc.stats.intelligence
            });
          }
        });
        
        setLeaders(leaderboardData);
      }
      setLoading(false);
    };

    onValue(usersRef, handleData);

    return () => off(usersRef, 'value', handleData);
  }, []);

  const sortedLeaders = [...leaders].sort((a, b) => {
    switch (sortBy) {
      case 'wins':
        return b.wins - a.wins || b.totalPower - a.totalPower;
      case 'powers':
        return b.powersCount - a.powersCount || b.wins - a.wins;
      case 'totalPower':
        return b.totalPower - a.totalPower || b.wins - a.wins;
      default:
        return 0;
    }
  }).slice(0, 10);

  if (loading) {
    return (
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          <h3 className="text-2xl font-bold text-white">Leaderboard</h3>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setSortBy('wins')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              sortBy === 'wins' 
                ? 'bg-yellow-600/30 text-yellow-400' 
                : 'bg-gray-700/50 text-gray-400 hover:text-gray-300'
            }`}
          >
            Wins
          </button>
          <button
            onClick={() => setSortBy('powers')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              sortBy === 'powers' 
                ? 'bg-purple-600/30 text-purple-400' 
                : 'bg-gray-700/50 text-gray-400 hover:text-gray-300'
            }`}
          >
            Powers
          </button>
          <button
            onClick={() => setSortBy('totalPower')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              sortBy === 'totalPower' 
                ? 'bg-blue-600/30 text-blue-400' 
                : 'bg-gray-700/50 text-gray-400 hover:text-gray-300'
            }`}
          >
            Total Power
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sortedLeaders.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No warriors to display yet.</p>
        ) : (
          sortedLeaders.map((entry, index) => {
            const title = getTitleForOC(entry.oc);
            const titleColor = getTitleColor(title);
            const rankIcon = index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
            
            return (
              <div
                key={entry.uid}
                className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
                  index === 0 
                    ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/50' 
                    : index === 1
                    ? 'bg-gradient-to-r from-gray-700/30 to-gray-600/30 border-gray-400/50'
                    : index === 2
                    ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-500/50'
                    : 'bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30'
                }`}
              >
                <div className="text-2xl font-bold text-white min-w-[3rem] text-center">
                  {rankIcon}
                </div>
                
                <img
                  src={entry.oc.avatar}
                  alt={entry.oc.name}
                  className="w-12 h-12 rounded-full border-2 border-purple-500 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/48x48/8B5CF6/FFFFFF?text=' + entry.oc.name[0];
                  }}
                />
                
                <div className="flex-1">
                  <h4 className="font-bold text-white">{entry.oc.name}</h4>
                  <p className={`text-sm font-medium ${titleColor}`}>{title}</p>
                </div>
                
                <div className="flex space-x-4 text-sm">
                  <div className="text-center">
                    <div className="text-yellow-400 font-bold">{entry.wins}</div>
                    <div className="text-gray-400">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-bold">{entry.powersCount}</div>
                    <div className="text-gray-400">Powers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 font-bold">{entry.totalPower}</div>
                    <div className="text-gray-400">Total</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Leaderboard;