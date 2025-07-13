import React, { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../../firebase/config';
import { OC } from '../../types';
import OCCard from '../OC/OCCard';
import { Sword, Trophy } from 'lucide-react';

interface BattleArenaProps {
  userOC: OC;
  currentUid: string;
}

interface UserWithOC {
  uid: string;
  oc: OC;
  banned?: boolean;
}

const BattleArena: React.FC<BattleArenaProps> = ({ userOC, currentUid }) => {
  const [opponents, setOpponents] = useState<UserWithOC[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = ref(database, 'users');
    
    const handleData = (snapshot: any) => {
      const users = snapshot.val();
      if (users) {
        const opponentsList: UserWithOC[] = [];
        
        Object.entries(users).forEach(([uid, userData]: [string, any]) => {
          if (uid !== currentUid && userData.oc && !userData.banned) {
            opponentsList.push({
              uid,
              oc: userData.oc,
              banned: userData.banned || false
            });
          }
        });
        
        setOpponents(opponentsList);
      }
      setLoading(false);
    };

    onValue(usersRef, handleData);

    return () => off(usersRef, 'value', handleData);
  }, [currentUid]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sword className="h-6 w-6 sm:h-8 sm:w-8 text-red-400" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Battle Arena
            </h1>
            <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
          </div>
          <p className="text-sm sm:text-base text-gray-300 px-4">Choose your opponent and engage in epic battles!</p>
        </div>

        {opponents.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <Sword className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-400 mb-2">No Opponents Available</h2>
            <p className="text-sm sm:text-base text-gray-500">
              There are no other characters to battle with yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {opponents.map((opponent) => (
              <OCCard
                key={opponent.uid}
                oc={opponent.oc}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleArena;