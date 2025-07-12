import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuth';
import { useBattleRequests } from '../../hooks/useBattleRequests';
import { useComments } from '../../hooks/useComments';
import { OC } from '../../types';
import OCCard from './OCCard';
import BattleModal from '../Battle/BattleModal';
import { ArrowLeft, MessageCircle, Send, Loader2 } from 'lucide-react';

const OCViewer: React.FC = () => {
  const { uid: targetUid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sendBattleRequest } = useBattleRequests(user?.uid);
  const { comments, addComment } = useComments(targetUid);
  
  const [targetOC, setTargetOC] = useState<OC | null>(null);
  const [userOC, setUserOC] = useState<OC | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBattle, setShowBattle] = useState(false);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    if (!targetUid) return;

    const targetRef = ref(database, `users/${targetUid}/oc`);
    
    const handleTargetData = (snapshot: any) => {
      const data = snapshot.val();
      setTargetOC(data);
      setLoading(false);
    };

    onValue(targetRef, handleTargetData);

    return () => off(targetRef, 'value', handleTargetData);
  }, [targetUid]);

  useEffect(() => {
    if (!user?.uid) return;

    const userRef = ref(database, `users/${user.uid}/oc`);
    
    const handleUserData = (snapshot: any) => {
      const data = snapshot.val();
      setUserOC(data);
    };

    onValue(userRef, handleUserData);

    return () => off(userRef, 'value', handleUserData);
  }, [user?.uid]);

  const handleBattleRequest = async () => {
    if (!user?.uid || !userOC || !targetUid) return;
    
    try {
      await sendBattleRequest(targetUid, userOC);
      setRequestSent(true);
      setTimeout(() => setRequestSent(false), 3000);
    } catch (error) {
      console.error('Error sending battle request:', error);
    }
  };

  const handleInstantBattle = () => {
    setShowBattle(true);
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !user?.uid || !userOC) return;
    
    setSubmittingComment(true);
    try {
      await addComment(comment.trim(), user.uid, userOC.name);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const isOwner = user?.uid === targetUid;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!targetOC) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Character Not Found</h1>
          <p className="text-gray-300 mb-6">This character doesn't exist or has been destroyed.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          
          {requestSent && (
            <div className="bg-green-600/20 border border-green-500/50 rounded-lg px-4 py-2">
              <span className="text-green-400 text-sm">✅ Battle request sent!</span>
            </div>
          )}
        </div>

        {/* OC Card */}
        <div className="max-w-md mx-auto mb-8">
          <OCCard
            oc={targetOC}
            isOwner={isOwner}
            onEdit={isOwner ? () => navigate('/') : undefined}
            onBattle={!isOwner && userOC ? handleInstantBattle : undefined}
            onBattleRequest={!isOwner && userOC ? handleBattleRequest : undefined}
          />
        </div>

        {/* Comments Section */}
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center space-x-2 mb-6">
            <MessageCircle className="h-5 w-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Comments</h3>
          </div>

          {/* Add Comment */}
          {user && userOC && !isOwner && (
            <div className="mb-6">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 100))}
                  placeholder="Leave a comment... (max 100 chars)"
                  className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength={100}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!comment.trim() || submittingComment}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  {submittingComment ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-1">{comment.length}/100 characters</div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment, index) => (
                <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-purple-400">{comment.username}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-200">{comment.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Battle Modal */}
        {showBattle && userOC && (
          <BattleModal
            playerOC={userOC}
            opponentOC={targetOC}
            opponentUid={targetUid!}
            onClose={() => setShowBattle(false)}
          />
        )}
      </div>
    </div>
  );
};

export default OCViewer;