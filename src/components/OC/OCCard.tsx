import React, { useState } from 'react';
import { OC } from '../../types';
import { Sword, Zap, Brain, Share2, Edit, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [expandedBackstory, setExpandedBackstory] = useState(false);
  const [expandedAbility, setExpandedAbility] = useState(false);
  
  const totalPower = oc.stats.strength + oc.stats.speed + oc.stats.intelligence;
  const maxPowers = 4;
  const title = getTitleForOC(oc);
  const titleColor = getTitleColor(title);

  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

  const shouldShowExpand = (text: string) => text.length > 300;

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 truncate">{oc.name}</h2>
          <p className={`text-sm font-medium mb-1 ${titleColor}`}>{title}</p>
          <p className="text-purple-400 font-medium text-sm sm:text-base">Total Power: {totalPower}</p>
          {(oc.wins || 0) > 0 && (
            <p className="text-yellow-400 font-medium text-xs sm:text-sm">🏆 Victories: {oc.wins}</p>
          )}
        </div>
        <div className="flex space-x-2 ml-2">
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
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="relative">
          <img
            src={oc.avatar}
            alt={oc.name}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-purple-500/50 object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/128x128/8B5CF6/FFFFFF?text=' + oc.name[0];
            }}
          />
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-2">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
        </div>
      </div>

      {/* Powers */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3">
          Powers ({oc.powers.length})
        </h3>
        <div className="space-y-2">
          {oc.powers.map((power, index) => (
            <div key={index} className={`rounded-lg p-2 sm:p-3 border ${
              index < 2 
                ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30' 
                : 'bg-gradient-to-r from-red-600/20 to-orange-600/20 border-red-500/30'
            }`}>
              <span className="text-purple-300 font-medium text-sm sm:text-base">{power}</span>
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
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Sword className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-300 text-sm sm:text-base">Strength</span>
                <span className="text-red-400 font-bold text-sm sm:text-base">{oc.stats.strength}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(oc.stats.strength / 150) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-300 text-sm sm:text-base">Speed</span>
                <span className="text-yellow-400 font-bold text-sm sm:text-base">{oc.stats.speed}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(oc.stats.speed / 150) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-300 text-sm sm:text-base">Intelligence</span>
                <span className="text-blue-400 font-bold text-sm sm:text-base">{oc.stats.intelligence}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(oc.stats.intelligence / 150) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Ability */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Special Ability</h3>
        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-3 sm:p-4 border border-purple-500/30">
          <div className="prose prose-sm prose-invert max-w-none">
            {shouldShowExpand(oc.specialAbility) ? (
              <>
                {(expandedAbility ? oc.specialAbility : truncateText(oc.specialAbility, 300))
                  .split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="text-gray-200 leading-relaxed mb-2 last:mb-0 text-sm sm:text-base">
                        {paragraph.trim()}
                      </p>
                    )
                  ))}
                <button
                  onClick={() => setExpandedAbility(!expandedAbility)}
                  className="flex items-center space-x-1 mt-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                >
                  {expandedAbility ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  <span>{expandedAbility ? 'Show Less' : 'Show More'}</span>
                </button>
              </>
            ) : (
              oc.specialAbility.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-gray-200 leading-relaxed mb-2 last:mb-0 text-sm sm:text-base">
                    {paragraph.trim()}
                  </p>
                )
              ))
            )}
          </div>
        </div>
      </div>

      {/* Backstory */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Backstory</h3>
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-lg p-3 sm:p-4 border border-gray-600/50">
          <div className="prose prose-sm prose-invert max-w-none">
            {shouldShowExpand(oc.backstory) ? (
              <>
                {(expandedBackstory ? oc.backstory : truncateText(oc.backstory, 300))
                  .split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="text-gray-200 leading-relaxed mb-3 last:mb-0 indent-4 text-sm sm:text-base">
                        {paragraph.trim()}
                      </p>
                    )
                  ))}
                <button
                  onClick={() => setExpandedBackstory(!expandedBackstory)}
                  className="flex items-center space-x-1 mt-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                  {expandedBackstory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  <span>{expandedBackstory ? 'Show Less' : 'Show More'}</span>
                </button>
              </>
            ) : (
              oc.backstory.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-gray-200 leading-relaxed mb-3 last:mb-0 indent-4 text-sm sm:text-base">
                    {paragraph.trim()}
                  </p>
                )
              ))
            )}
          </div>
        </div>
      </div>

      {/* Battle Button - Only show Battle Request option */}
      {!isOwner && onBattleRequest && (
        <div className="space-y-3">
          <button
            onClick={onBattleRequest}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border-2 border-orange-500/50 text-sm sm:text-base"
          >
            <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>🔥 SEND BATTLE REQUEST 🔥</span>
          </button>
        </div>
      )}
      
      {/* Battle History */}
      {isOwner && oc.history && oc.history.length > 0 && (
        <div className="mt-4 sm:mt-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Battle History</h3>
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