import React, { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuth';
import { OC } from '../../types';
import OCCard from '../OC/OCCard';
import { Shuffle, Search } from 'lucide-react';

interface OCWithUid {
  uid: string;
  oc: OC;
}

const ExploreOCs: React.FC = () => {
  const { user } = useAuth();
  const [allOCs, setAllOCs] = useState<OCWithUid[]>([]);
  const [displayedOCs, setDisplayedOCs] = useState<OCWithUid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = ref(database, 'users');
    
    const handleData = (snapshot: any) => {
      const users = snapshot.val();
      if (users) {
        const ocsList: OCWithUid[] = [];
        
        Object.entries(users).forEach(([uid, userData]: [string, any]) => {
          if (uid !== user?.uid && userData.oc && !userData.banned) {
            ocsList.push({
              uid,
              oc: userData.oc
            });
          }
        });
        
        setAllOCs(ocsList);
        shuffleOCs(ocsList);
      }
      setLoading(false);
    };

    onValue(usersRef, handleData);

    return () => off(usersRef, 'value', handleData);
  }, [user?.uid]);

  const shuffleOCs = (ocs: OCWithUid[]) => {
    const shuffled = [...ocs].sort(() => Math.random() - 0.5);
    setDisplayedOCs(shuffled.slice(0, 12)); // Show 12 random OCs
  };

  const handleShuffle = () => {
    shuffleOCs(allOCs);
  };

  const handleShare = async (oc: OC, uid: string) => {
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
      prompt('Copy this URL to share this character:', url);
    });
  };

  if (loading) {
    return (
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-700 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Search className="h-6 w-6 text-purple-400" />
            <h3 className="text-2xl font-bold text-white">Explore Characters</h3>
          </div>
          
          <button
            onClick={handleShuffle}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition-colors"
          >
            <Shuffle className="h-4 w-4" />
            <span>Shuffle</span>
          </button>
        </div>

        {displayedOCs.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No Characters to Explore</h3>
            <p className="text-gray-500">
              There are no other characters available to explore yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedOCs.map(({ uid, oc }) => (
              <OCCard
                key={uid}
                oc={oc}
                onShare={() => handleShare(oc, uid)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreOCs;