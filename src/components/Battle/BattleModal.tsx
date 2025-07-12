import React, { useState, useEffect } from 'react';
import { useOC } from '../../hooks/useOC';
import { useAuth } from '../../hooks/useAuth';
import { OC } from '../../types';
import { X, Sword, Zap, Trophy, Flame, Skull, Crown } from 'lucide-react';

interface BattleModalProps {
  playerOC: OC;
  opponentOC: OC;
  opponentUid: string;
  onClose: () => void;
}

const BattleModal: React.FC<BattleModalProps> = ({ playerOC, opponentOC, opponentUid, onClose }) => {
  const { user } = useAuth();
  const { executeBattleResult } = useOC(user?.uid);
  const [battlePhase, setBattlePhase] = useState<'intro' | 'confirm' | 'fighting' | 'result'>('intro');
  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);
  const [playerPower, setPlayerPower] = useState(0);
  const [opponentPower, setOpponentPower] = useState(0);
  const [powersToTransfer, setPowersToTransfer] = useState<string[]>([]);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    const playerTotal = playerOC.stats.strength + playerOC.stats.speed + playerOC.stats.intelligence;
    const opponentTotal = opponentOC.stats.strength + opponentOC.stats.speed + opponentOC.stats.intelligence;
    
    setPlayerPower(playerTotal);
    setOpponentPower(opponentTotal);
  }, [playerOC, opponentOC]);

  const showConfirmation = () => {
    setBattlePhase('confirm');
  };

  const startBattle = async () => {
    setBattlePhase('fighting');
    
    // Simulate battle with animation delay
    setTimeout(() => {
      const battleWinner = playerPower > opponentPower ? 'player' : 
                          opponentPower > playerPower ? 'opponent' : 
                          Math.random() > 0.5 ? 'player' : 'opponent';
      
      setWinner(battleWinner);
      
      // Determine powers to transfer
      const loserOC = battleWinner === 'player' ? opponentOC : playerOC;
      setPowersToTransfer(loserOC.powers);
      
      setBattlePhase('result');
    }, 3000);
  };

  const executeBattle = async () => {
    if (!winner || !user) return;
    
    setExecuting(true);
    
    try {
      if (winner === 'player') {
        // Player wins - absorb opponent's powers and stats
        const newStats = {
          strength: Math.min(150, playerOC.stats.strength + 10),
          speed: Math.min(150, playerOC.stats.speed + 10),
          intelligence: Math.min(150, playerOC.stats.intelligence + 10)
        };
        
        await executeBattleResult(
          user.uid,
          opponentUid,
          playerOC,
          opponentOC,
          newStats,
          powersToTransfer
        );
      } else {
        // Opponent wins - player gets banned
        const newStats = {
          strength: Math.min(150, opponentOC.stats.strength + 10),
          speed: Math.min(150, opponentOC.stats.speed + 10),
          intelligence: Math.min(150, opponentOC.stats.intelligence + 10)
        };
        
        await executeBattleResult(
          opponentUid,
          user.uid,
          opponentOC,
          playerOC,
          newStats,
          playerOC.powers
        );
      }
      
      // Close modal after execution
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error executing battle result:', error);
    } finally {
      setExecuting(false);
    }
  };

  const getBattleResultMessage = () => {
    if (!winner) return '';
    
    const winnerOC = winner === 'player' ? playerOC : opponentOC;
    const loserOC = winner === 'player' ? opponentOC : playerOC;
    
    return `💀 ${winnerOC.name} DESTROYS ${loserOC.name}! Powers absorbed! Account BANNED! 💀`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 max-w-4xl w-full border border-purple-500/30 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Battle Arena
          </h2>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
          </button>
        </div>

        {battlePhase === 'intro' && (
          <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Character Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-center">
              {/* Player OC */}
              <div className="text-center">
                <img
                  src={playerOC.avatar}
                  alt={playerOC.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-2 sm:border-4 border-blue-500 mx-auto mb-2 sm:mb-4 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/96x96/3B82F6/FFFFFF?text=' + playerOC.name[0];
                  }}
                />
                <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-blue-400 truncate">{playerOC.name}</h3>
                <p className="text-xs sm:text-sm lg:text-base text-blue-300">Power: {playerPower}</p>
              </div>

              {/* VS */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-full w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <span className="text-white font-bold text-sm sm:text-lg lg:text-xl">VS</span>
                </div>
                <Sword className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto" />
              </div>

              {/* Opponent OC */}
              <div className="text-center">
                <img
                  src={opponentOC.avatar}
                  alt={opponentOC.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-2 sm:border-4 border-red-500 mx-auto mb-2 sm:mb-4 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/96x96/EF4444/FFFFFF?text=' + opponentOC.name[0];
                  }}
                />
                <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-red-400 truncate">{opponentOC.name}</h3>
                <p className="text-xs sm:text-sm lg:text-base text-red-300">Power: {opponentPower}</p>
              </div>
            </div>

            <button
              onClick={startBattle}
              onClick={showConfirmation}
              className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 mx-auto text-sm sm:text-base"
            >
              <Sword className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              <span>CHALLENGE TO DEATH BATTLE!</span>
            </button>
          </div>
        )}

        {battlePhase === 'confirm' && (
          <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-lg p-4 sm:p-6 border-2 border-red-500/50">
              <Skull className="h-12 w-12 sm:h-16 sm:w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-400 mb-4">
                ⚠️ WINNER TAKES ALL ⚠️
              </h3>
              <div className="text-left space-y-2 text-sm sm:text-base text-gray-200">
                <p>🔥 <strong>If you WIN:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Absorb ALL of {opponentOC.name}'s powers: {opponentOC.powers.join(', ')}</li>
                  <li>Gain +10 to ALL stats (capped at 150)</li>
                  <li>{opponentOC.name} is PERMANENTLY DELETED</li>
                  <li>Their account gets BANNED forever</li>
                </ul>
                
                <p className="mt-4">💀 <strong>If you LOSE:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>YOUR character {playerOC.name} gets DELETED</li>
                  <li>YOUR account gets BANNED</li>
                  <li>You can NEVER play again</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setBattlePhase('intro')}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={startBattle}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Skull className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>I ACCEPT THE RISK!</span>
              </button>
            </div>
          </div>
        )}

        {battlePhase === 'fighting' && (
          <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="relative">
              <Flame className="h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 text-orange-500 mx-auto animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-yellow-400 animate-bounce" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white animate-pulse">
              DEATH BATTLE IN PROGRESS...
            </h3>
            <p className="text-sm sm:text-base text-gray-300 px-4">
              {playerOC.name} and {opponentOC.name} are fighting to the DEATH!
            </p>
          </div>
        )}

        {battlePhase === 'result' && winner && (
          <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="relative">
              {winner === 'player' ? (
                <Crown className="h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 text-yellow-400 mx-auto" />
              ) : (
                <Skull className="h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 text-red-400 mx-auto" />
              )}
              {winner === 'player' && (
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-green-500 rounded-full p-1 sm:p-2">
                  <span className="text-white font-bold text-xs sm:text-sm">VICTORY!</span>
                </div>
              )}
              {winner === 'opponent' && (
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-red-500 rounded-full p-1 sm:p-2">
                  <span className="text-white font-bold text-xs sm:text-sm">DEFEAT!</span>
                </div>
              )}
            </div>

            <div className={`rounded-lg p-3 sm:p-4 lg:p-6 border-2 ${
              winner === 'player' 
                ? 'bg-gradient-to-r from-green-900/50 to-yellow-900/50 border-green-500/50' 
                : 'bg-gradient-to-r from-red-900/50 to-gray-900/50 border-red-500/50'
            }`}>
              <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-4 ${
                winner === 'player' ? 'text-green-400' : 'text-red-400'
              }`}>
                {winner === 'player' ? '🏆 TOTAL DOMINATION!' : '💀 YOU HAVE BEEN DESTROYED!'}
              </h3>
              <p className="text-white text-sm sm:text-base lg:text-lg break-words">{getBattleResultMessage()}</p>
              
              {winner === 'player' && powersToTransfer.length > 0 && (
                <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                  <h4 className="text-purple-400 font-bold mb-2">Powers Absorbed:</h4>
                  <div className="flex flex-wrap gap-2">
                    {powersToTransfer.map((power, index) => (
                      <span key={index} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs sm:text-sm">
                        {power}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={executeBattle}
              disabled={executing}
              className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-200 text-sm sm:text-base disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {executing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>EXECUTING JUDGMENT...</span>
                </>
              ) : (
                <>
                  <Skull className="h-4 w-4" />
                  <span>EXECUTE BATTLE RESULT</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleModal;