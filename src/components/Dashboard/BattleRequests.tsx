import React from 'react';
import { useBattleRequests } from '../../hooks/useBattleRequests';
import { useOC } from '../../hooks/useOC';
import { useAuth } from '../../hooks/useAuth';
import { BattleRequest } from '../../types';
import { Sword, Check, X, Clock } from 'lucide-react';
import InteractiveBattleModal from '../Battle/InteractiveBattleModal';

const BattleRequests: React.FC = () => {
  const { user } = useAuth();
  const { oc } = useOC(user?.uid);
  const { incomingRequests, acceptBattleRequest, rejectBattleRequest, removeRequest } = useBattleRequests(user?.uid);
  const [selectedRequest, setSelectedRequest] = React.useState<{ request: BattleRequest; fromUid: string } | null>(null);

  const pendingRequests = Object.entries(incomingRequests).filter(([_, request]) => request.status === 'pending');
  const acceptedRequests = Object.entries(incomingRequests).filter(([_, request]) => request.status === 'accepted');

  const handleAccept = async (fromUid: string) => {
    try {
      await acceptBattleRequest(fromUid);
      // Set up battle
      const request = incomingRequests[fromUid];
      setSelectedRequest({ request, fromUid });
    } catch (error) {
      console.error('Error accepting battle request:', error);
    }
  };

  const handleReject = async (fromUid: string) => {
    try {
      await rejectBattleRequest(fromUid);
    } catch (error) {
      console.error('Error rejecting battle request:', error);
    }
  };

  const handleBattleComplete = () => {
    if (selectedRequest) {
      removeRequest(selectedRequest.fromUid);
      setSelectedRequest(null);
    }
  };

  if (!oc) return null;

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-orange-400" />
            <h3 className="text-xl font-bold text-orange-400">Incoming Battle Requests</h3>
          </div>
          
          <div className="space-y-4">
            {pendingRequests.map(([fromUid, request]) => (
              <div key={fromUid} className="bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-lg p-4 border border-orange-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={request.fromOCAvatar}
                      alt={request.fromOCName}
                      className="w-12 h-12 rounded-full border-2 border-orange-500 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/48x48/F97316/FFFFFF?text=' + request.fromOCName[0];
                      }}
                    />
                    <div>
                      <h4 className="font-bold text-white">{request.fromOCName}</h4>
                      <p className="text-orange-300 text-sm">Power: {request.fromOCPower}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(request.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAccept(fromUid)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Check className="h-4 w-4" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleReject(fromUid)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Battle Modal */}
      {selectedRequest && (
        <InteractiveBattleModal
          playerOC={oc}
          opponentOC={{
            name: selectedRequest.request.fromOCName,
            avatar: selectedRequest.request.fromOCAvatar,
            powers: [], // We'll need to fetch full OC data
            stats: { strength: 50, speed: 50, intelligence: 50 }, // Placeholder
            backstory: '',
            specialAbility: '',
            createdAt: 0
          }}
          opponentUid={selectedRequest.fromUid}
          onClose={handleBattleComplete}
        />
      )}
    </div>
  );
};

export default BattleRequests;