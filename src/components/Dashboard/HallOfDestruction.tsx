import React, { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../../firebase/config';
import { Skull, Trophy, Calendar, Zap } from 'lucide-react';

interface DestroyedOC {
  name: string;
  defeatedBy: string;
  powersStolen: string[];
  timestamp: number;
  date: string;
  stats: {
    strength: number;
    speed: number;
    intelligence: number;
  };
  avatar: string;
}

const HallOfDestruction: React.FC = () => {
  const [destroyedOCs, setDestroyedOCs] = useState<DestroyedOC[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hallRef = ref(database, 'hallOfDestruction');
    
    const handleData = (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const destroyed = Object.values(data) as DestroyedOC[];
        // Sort by timestamp, most recent first
        destroyed.sort((a, b) => b.timestamp - a.timestamp);
        setDestroyedOCs(destroyed);
      }
      setLoading(false);
    };

    onValue(hallRef, handleData);

    return () => off(hallRef, 'value', handleData);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Skull className="h-8 w-8 text-red-400" />
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Hall of Destruction
            </h1>
            <Trophy className="h-8 w-8 text-yellow-400" />
          </div>
          <p className="text-gray-300">Fallen warriors who dared to challenge the strong</p>
        </div>

        {destroyedOCs.length === 0 ? (
          <div className="text-center py-16">
            <Skull className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">No Fallen Warriors Yet</h2>
            <p className="text-gray-500">
              The hall awaits its first victim...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destroyedOCs.map((oc, index) => (
              <div key={index} className="bg-gradient-to-br from-red-900/20 to-gray-900/20 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30">
                <div className="text-center mb-4">
                  <img
                    src={oc.avatar}
                    alt={oc.name}
                    className="w-20 h-20 rounded-full border-2 border-red-500 mx-auto mb-3 object-cover grayscale"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/80x80/EF4444/FFFFFF?text=' + oc.name[0];
                    }}
                  />
                  <h3 className="text-xl font-bold text-red-400 mb-1">{oc.name}</h3>
                  <p className="text-gray-400 text-sm">💀 DESTROYED 💀</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-red-900/30 rounded-lg p-3 border border-red-500/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium text-sm">Defeated By</span>
                    </div>
                    <p className="text-white font-bold">{oc.defeatedBy}</p>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-600/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400 font-medium text-sm">Date of Destruction</span>
                    </div>
                    <p className="text-gray-300">{oc.date}</p>
                  </div>

                  <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="h-4 w-4 text-purple-400" />
                      <span className="text-purple-400 font-medium text-sm">Powers Stolen</span>
                    </div>
                    <div className="space-y-1">
                      {oc.powersStolen.map((power, powerIndex) => (
                        <div key={powerIndex} className="text-purple-300 text-sm">
                          • {power}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-500/30">
                    <div className="text-blue-400 font-medium text-sm mb-2">Final Stats</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-red-400 font-bold">{oc.stats.strength}</div>
                        <div className="text-gray-400">STR</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-400 font-bold">{oc.stats.speed}</div>
                        <div className="text-gray-400">SPD</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-bold">{oc.stats.intelligence}</div>
                        <div className="text-gray-400">INT</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HallOfDestruction;