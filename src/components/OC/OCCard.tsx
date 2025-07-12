import React from 'react';
import { OC } from '../../types';
import { Sword, Zap, Brain, Share2, Edit } from 'lucide-react';
import { getTitleForOC, getTitleColor } from '../../utils/titles';

interface OCCardProps {
  oc: OC;
  isOwner?: boolean;
  onEdit?: () => void;
  onBattle?: () => void;
  onShare?: () => void;
  onBattleRequest?: () => void;
}

const OCCard: React.FC<OCCardProps> = ({ oc, isOwner = false, onEdit, onBattle, onShare, onBattleRequest }) => {
  const totalPower = oc.stats.strength + oc.stats.speed + oc.stats.intelligence;
  const maxPowers = 4; // Can have up to 4 powers after winning battles
  const title = getTitleForOC(oc);
  const titleColor = getTitleColor(title);

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{oc.name}</h2>
          <p className={`text-sm font-medium mb-1 ${titleColor}`}>{title}</p>
          <p className="text-purple-400 font-medium">Total Power: {totalPower}</p>
          {(oc.wins || 0) > 0 && (
            <p className="text-yellow-400 font-medium text-sm">🏆 Victories: {oc.wins}</p>
          )}
        </div>
        <div className="flex space-x-2">
          {isOwner && onEdit && (
            <button
              onClick={onEdit}
              className="p-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4 text-purple-400" />
            </button>
          )}
          {onShare && (
            <button
              onClick={onShare}
              className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors"
            >
              <Share2 className="h-4 w-4 text-blue-400" />
            </button>
          )}
        </div>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <img
            src={oc.avatar}
            alt={oc.name}
            className="w-32 h-32 rounded-full border-4 border-purple-500/50 object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/128x128/8B5CF6/FFFFFF?text=' + oc.name[0];
            }}
          />
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-2">
            <Zap className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      {/* Powers */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">
          Powers ({oc.powers.length}/{maxPowers})
        </h3>
        <div className="space-y-2">
          {oc.powers.map((power, index) => (
            <div key={index} className={`rounded-lg p-3 border ${
              index < 2 
                ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30' 
                : 'bg-gradient-to-r from-red-600/20 to-orange-600/20 border-red-500/30'
            }`}>
              <span className="text-purple-300 font-medium">{power}</span>
              {index >= 2 && oc.powersAbsorbed && (
                <div className="text-xs text-red-400 mt-1">
                  ☠️ Absorbed from: {oc.powersAbsorbed.find(p => p.power === power)?.fromOpponent || 'Unknown'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Sword className="h-5 w-5 text-red-400" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-300">Strength</span>
                <span className="text-red-400 font-bold">{oc.stats.strength}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                  style={{ width: `${oc.stats.strength}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Zap className="h-5 w-5 text-yellow-400" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-300">Speed</span>
                <span className="text-yellow-400 font-bold">{oc.stats.speed}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full"
                  style={{ width: `${oc.stats.speed}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Brain className="h-5 w-5 text-blue-400" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-300">Intelligence</span>
                <span className="text-blue-400 font-bold">{oc.stats.intelligence}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                  style={{ width: `${oc.stats.intelligence}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Ability */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Special Ability</h3>
        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-500/30">
          <div className="prose prose-sm prose-invert max-w-none">
            {oc.specialAbility.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="text-gray-200 leading-relaxed mb-2 last:mb-0">
                  {paragraph.trim()}
                </p>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Backstory */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Backstory</h3>
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-lg p-4 border border-gray-600/50">
          <div className="prose prose-sm prose-invert max-w-none">
            {oc.backstory.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="text-gray-200 leading-relaxed mb-3 last:mb-0 indent-4">
                  {paragraph.trim()}
                </p>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Battle Button */}
      {!isOwner && (onBattle || onBattleRequest) && (
        <div className="space-y-3">
          {onBattle && (
            <button
              onClick={onBattle}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border-2 border-red-500/50"
            >
              <Sword className="h-5 w-5" />
              <span>💀 INSTANT BATTLE! 💀</span>
            </button>
          )}
          {onBattleRequest && (
            <button
              onClick={onBattleRequest}
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border-2 border-orange-500/50"
            >
              <Zap className="h-5 w-5" />
              <span>🔥 BATTLE REQUEST 🔥</span>
            </button>
          )}
        </div>
      )}
      
      {/* Battle History */}
      {isOwner && oc.history && oc.history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Battle History</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {oc.history.slice(-3).map((battle, index) => (
              <div key={index} className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-2 border border-yellow-500/30">
                <div className="text-sm text-yellow-300">
                  🏆 Defeated {battle.opponent}
                </div>
                <div className="text-xs text-gray-400">
                  {battle.date} • +{battle.statsGained} stats
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OCCard;