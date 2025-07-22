import React, { useState } from 'react';
import { X, Zap, Save } from 'lucide-react';
import { Power } from '../../utils/powers';

interface CustomPowerCreatorProps {
  onSave: (power: Power) => void;
  onClose: () => void;
}

const CustomPowerCreator: React.FC<CustomPowerCreatorProps> = ({ onSave, onClose }) => {
  const [powerData, setPowerData] = useState<Power>({
    name: '',
    attack: 25,
    defense: 25,
    magic: 25,
    description: ''
  });
  const [descriptionCount, setDescriptionCount] = useState(0);

  const totalStats = powerData.attack + powerData.defense + powerData.magic;
  const maxStats = 75; // Total stat points allowed

  const handleStatChange = (stat: keyof Pick<Power, 'attack' | 'defense' | 'magic'>, value: number) => {
    const otherStats = Object.entries(powerData)
      .filter(([key]) => key !== stat && ['attack', 'defense', 'magic'].includes(key))
      .reduce((sum, [, val]) => sum + (val as number), 0);
    
    const maxAllowed = maxStats - otherStats;
    const clampedValue = Math.min(Math.max(0, value), maxAllowed);
    
    setPowerData(prev => ({
      ...prev,
      [stat]: clampedValue
    }));
  };

  const handleDescriptionChange = (value: string) => {
    if (value.length <= 200) {
      setPowerData(prev => ({ ...prev, description: value }));
      setDescriptionCount(value.length);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!powerData.name.trim()) {
      alert('Please enter a power name');
      return;
    }
    
    if (!powerData.description.trim()) {
      alert('Please enter a power description');
      return;
    }
    
    if (totalStats !== maxStats) {
      alert(`Please allocate exactly ${maxStats} stat points`);
      return;
    }
    
    onSave(powerData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full border border-purple-500/30">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-yellow-400" />
            <h2 className="text-xl font-bold text-yellow-400">Create Custom Power</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Power Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Power Name
            </label>
            <input
              type="text"
              value={powerData.name}
              onChange={(e) => setPowerData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter unique power name"
              required
            />
          </div>

          {/* Stats Allocation */}
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">
              Stats Allocation ({totalStats}/{maxStats})
            </h3>
            
            <div className="space-y-3">
              {/* Attack */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-red-400">Attack</label>
                  <span className="text-red-400 font-bold">{powerData.attack}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxStats - powerData.defense - powerData.magic}
                  value={powerData.attack}
                  onChange={(e) => handleStatChange('attack', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Defense */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-blue-400">Defense</label>
                  <span className="text-blue-400 font-bold">{powerData.defense}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxStats - powerData.attack - powerData.magic}
                  value={powerData.defense}
                  onChange={(e) => handleStatChange('defense', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Magic */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-purple-400">Magic</label>
                  <span className="text-purple-400 font-bold">{powerData.magic}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxStats - powerData.attack - powerData.defense}
                  value={powerData.magic}
                  onChange={(e) => handleStatChange('magic', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className={`text-center mt-2 text-sm ${
              totalStats === maxStats ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {totalStats === maxStats ? '✓ Perfect allocation!' : `${maxStats - totalStats} points remaining`}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Power Description ({descriptionCount}/200)
            </label>
            <textarea
              value={powerData.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none"
              placeholder="Describe how your custom power works..."
              maxLength={200}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={totalStats !== maxStats}
            className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Create Power</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomPowerCreator;