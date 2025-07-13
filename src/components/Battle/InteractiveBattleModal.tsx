import React, { useState, useEffect } from 'react';
import { useOC } from '../../hooks/useOC';
import { useAuth } from '../../hooks/useAuth';
import { OC } from '../../types';
import { X, Sword, Shield, Zap, Trophy, Flame, Skull, Crown, Target } from 'lucide-react';

interface InteractiveBattleModalProps {
  playerOC: OC;
  opponentOC: OC;
  opponentUid: string;
  onClose: () => void;
}

type BattlePhase = 'intro' | 'confirm' | 'round' | 'result';
type Action = 'attack' | 'defend' | 'special';

interface RoundResult {
  playerAction: Action;
  opponentAction: Action;
  playerDamage: number;
  opponentDamage: number;
  playerHP: number;
  opponentHP: number;
  description: string;
}

const InteractiveBattleModal: React.FC<InteractiveBattleModalProps> = ({ 
  playerOC, 
  opponentOC, 
  opponentUid, 
  onClose 
}) => {
  const { user } = useAuth();
  const { executeBattleResult } = useOC(user?.uid);
  const [battlePhase, setBattlePhase] = useState<BattlePhase>('intro');
  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [currentRound, setCurrentRound] = useState(1);
  const [battleLog, setBattleLog] = useState<RoundResult[]>([]);
  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);
  const [executing, setExecuting] = useState(false);
  const [playerAction, setPlayerAction] = useState<Action | null>(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);

  const playerPower = playerOC.stats.strength + playerOC.stats.speed + playerOC.stats.intelligence;
  const opponentPower = opponentOC.stats.strength + opponentOC.stats.speed + opponentOC.stats.intelligence;

  const calculateDamage = (attacker: OC, defender: OC, attackerAction: Action, defenderAction: Action) => {
    let baseDamage = 0;
    
    switch (attackerAction) {
      case 'attack':
        baseDamage = Math.floor(attacker.stats.strength / 3) + Math.random() * 15;
        break;
      case 'special':
        baseDamage = Math.floor((attacker.stats.strength + attacker.stats.intelligence) / 4) + Math.random() * 20;
        break;
      default:
        baseDamage = 0;
    }

    // Defender's action affects damage taken
    if (defenderAction === 'defend') {
      baseDamage *= 0.5; // 50% damage reduction when defending
    } else if (defenderAction === 'special' && attackerAction === 'attack') {
      baseDamage *= 0.7; // Special abilities provide some protection
    }

    return Math.max(5, Math.floor(baseDamage)); // Minimum 5 damage
  };

  const getOpponentAction = (): Action => {
    // Simple AI for opponent
    const random = Math.random();
    if (opponentHP < 30) return 'special'; // Use special when low HP
    if (random < 0.4) return 'attack';
    if (random < 0.7) return 'defend';
    return 'special';
  };

  const executeRound = (pAction: Action) => {
    const oAction = getOpponentAction();
    
    const playerDamage = calculateDamage(playerOC, opponentOC, pAction, oAction);
    const opponentDamage = calculateDamage(opponentOC, playerOC, oAction, pAction);

    const newPlayerHP = Math.max(0, playerHP - opponentDamage);
    const newOpponentHP = Math.max(0, opponentHP - playerDamage);

    const getActionDescription = (action: Action, isPlayer: boolean) => {
      const character = isPlayer ? playerOC.name : opponentOC.name;
      switch (action) {
        case 'attack':
          return `${character} launches a fierce attack!`;
        case 'defend':
          return `${character} takes a defensive stance!`;
        case 'special':
          return `${character} unleashes their special ability!`;
      }
    };

    const description = `${getActionDescription(pAction, true)} ${getActionDescription(oAction, false)}`;

    const roundResult: RoundResult = {
      playerAction: pAction,
      opponentAction: oAction,
      playerDamage,
      opponentDamage,
      playerHP: newPlayerHP,
      opponentHP: newOpponentHP,
      description
    };

    setBattleLog(prev => [...prev, roundResult]);
    setPlayerHP(newPlayerHP);
    setOpponentHP(newOpponentHP);
    setCurrentRound(prev => prev + 1);

    // Check for winner
    if (newPlayerHP <= 0 && newOpponentHP <= 0) {
      // Tie - higher total power wins
      setWinner(playerPower >= opponentPower ? 'player' : 'opponent');
      setBattlePhase('result');
    } else if (newPlayerHP <= 0) {
      setWinner('opponent');
      setBattlePhase('result');
    } else if (newOpponentHP <= 0) {
      setWinner('player');
      setBattlePhase('result');
    }

    setPlayerAction(null);
  };

  const handleAction = (action: Action) => {
    setPlayerAction(action);
    setWaitingForOpponent(true);
    
    // Simulate opponent thinking time
    setTimeout(() => {
      executeRound(action);
      setWaitingForOpponent(false);
    }, 1500);
  };

  const executeBattle = async () => {
    if (!winner || !user) return;
    
    setExecuting(true);
    
    try {
      if (winner === 'player') {
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
          opponentOC.powers
        );
      } else {
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
      
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error executing battle result:', error);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 max-w-4xl w-full border border-purple-500/30 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Interactive Battle Arena
          </h2>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
          </button>
        </div>

        {battlePhase === 'intro' && (
          <div className="text-center space-y-4 sm:space-y-6">
            {/* Character Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-center">
              <div className="text-center">
                <img
                  src={playerOC.avatar}
                  alt={playerOC.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-blue-500 mx-auto mb-2 sm:mb-4 object-cover"
                />
                <h3 className="text-sm sm:text-lg font-bold text-blue-400 truncate">{playerOC.name}</h3>
                <p className="text-xs sm:text-sm text-blue-300">Power: {playerPower}</p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <span className="text-white font-bold text-sm sm:text-lg">VS</span>
                </div>
                <Sword className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto" />
              </div>

              <div className="text-center">
                <img
                  src={opponentOC.avatar}
                  alt={opponentOC.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-red-500 mx-auto mb-2 sm:mb-4 object-cover"
                />
                <h3 className="text-sm sm:text-lg font-bold text-red-400 truncate">{opponentOC.name}</h3>
                <p className="text-xs sm:text-sm text-red-300">Power: {opponentPower}</p>
              </div>
            </div>

            <button
              onClick={() => setBattlePhase('confirm')}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 mx-auto text-sm sm:text-base"
            >
              <Sword className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>START INTERACTIVE BATTLE!</span>
            </button>
          </div>
        )}

        {battlePhase === 'confirm' && (
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-lg p-4 sm:p-6 border-2 border-red-500/50">
              <Skull className="h-12 w-12 sm:h-16 sm:w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-4">
                ⚠️ WINNER TAKES ALL ⚠️
              </h3>
              <div className="text-left space-y-2 text-sm sm:text-base text-gray-200">
                <p>🔥 <strong>If you WIN:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Absorb ALL of {opponentOC.name}'s powers</li>
                  <li>Gain +10 to ALL stats (capped at 150)</li>
                  <li>{opponentOC.name} is PERMANENTLY DELETED</li>
                  <li>Their account gets BANNED forever</li>
                </ul>
                
                <p className="mt-4">💀 <strong>If you LOSE:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>YOUR character gets DELETED</li>
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
                onClick={() => setBattlePhase('round')}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Skull className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>I ACCEPT THE RISK!</span>
              </button>
            </div>
          </div>
        )}

        {battlePhase === 'round' && (
          <div className="space-y-4 sm:space-y-6">
            {/* HP Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                <h4 className="text-blue-400 font-bold mb-2">{playerOC.name}</h4>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${playerHP}%` }}
                  ></div>
                </div>
                <p className="text-blue-300 text-sm mt-1">{playerHP}/100 HP</p>
              </div>

              <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/30">
                <h4 className="text-red-400 font-bold mb-2">{opponentOC.name}</h4>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${opponentHP}%` }}
                  ></div>
                </div>
                <p className="text-red-300 text-sm mt-1">{opponentHP}/100 HP</p>
              </div>
            </div>

            {/* Round Info */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Round {currentRound}</h3>
              {waitingForOpponent ? (
                <p className="text-yellow-400 animate-pulse">Opponent is choosing their action...</p>
              ) : (
                <p className="text-gray-300">Choose your action!</p>
              )}
            </div>

            {/* Action Buttons */}
            {!waitingForOpponent && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <button
                  onClick={() => handleAction('attack')}
                  className="flex flex-col items-center space-y-2 p-4 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg transition-colors"
                >
                  <Sword className="h-6 w-6 text-red-400" />
                  <span className="text-red-400 font-bold">Attack</span>
                  <span className="text-xs text-gray-400">High damage</span>
                </button>

                <button
                  onClick={() => handleAction('defend')}
                  className="flex flex-col items-center space-y-2 p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg transition-colors"
                >
                  <Shield className="h-6 w-6 text-blue-400" />
                  <span className="text-blue-400 font-bold">Defend</span>
                  <span className="text-xs text-gray-400">Reduce damage</span>
                </button>

                <button
                  onClick={() => handleAction('special')}
                  className="flex flex-col items-center space-y-2 p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-lg transition-colors"
                >
                  <Zap className="h-6 w-6 text-purple-400" />
                  <span className="text-purple-400 font-bold">Special</span>
                  <span className="text-xs text-gray-400">Ultimate ability</span>
                </button>
              </div>
            )}

            {/* Battle Log */}
            {battleLog.length > 0 && (
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600/30 max-h-32 overflow-y-auto">
                <h4 className="text-white font-bold mb-2">Battle Log</h4>
                <div className="space-y-1 text-sm">
                  {battleLog.slice(-3).map((round, index) => (
                    <p key={index} className="text-gray-300">{round.description}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {battlePhase === 'result' && winner && (
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="relative">
              {winner === 'player' ? (
                <Crown className="h-20 w-20 sm:h-24 sm:w-24 text-yellow-400 mx-auto" />
              ) : (
                <Skull className="h-20 w-20 sm:h-24 sm:w-24 text-red-400 mx-auto" />
              )}
            </div>

            <div className={`rounded-lg p-4 sm:p-6 border-2 ${
              winner === 'player' 
                ? 'bg-gradient-to-r from-green-900/50 to-yellow-900/50 border-green-500/50' 
                : 'bg-gradient-to-r from-red-900/50 to-gray-900/50 border-red-500/50'
            }`}>
              <h3 className={`text-lg sm:text-xl font-bold mb-4 ${
                winner === 'player' ? 'text-green-400' : 'text-red-400'
              }`}>
                {winner === 'player' ? '🏆 VICTORY!' : '💀 DEFEAT!'}
              </h3>
              <p className="text-white text-sm sm:text-base">
                {winner === 'player' 
                  ? `${playerOC.name} emerges victorious after ${currentRound - 1} rounds!`
                  : `${opponentOC.name} has defeated you after ${currentRound - 1} rounds!`
                }
              </p>
            </div>

            <button
              onClick={executeBattle}
              disabled={executing}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-200 text-sm sm:text-base disabled:opacity-50 flex items-center justify-center space-x-2"
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

export default InteractiveBattleModal;