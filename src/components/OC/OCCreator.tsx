import React, { useState } from 'react';
import { OC } from '../../types';
import { Wand2, Save } from 'lucide-react';

interface OCCreatorProps {
  onSave: (oc: OC) => Promise<void>;
  existingOC?: OC;
}

const POWER_OPTIONS = [
  'Telekinesis',
  'Fire Manipulation',
  'Ice Control',
  'Lightning Strike',
  'Time Manipulation',
  'Shadow Control',
  'Healing',
  'Mind Reading',
  'Teleportation',
  'Super Strength',
  'Invisibility',
  'Energy Blast',
  'Force Field',
  'Shape Shifting',
  'Portal Creation',
  'Elemental Control',
  'Flight',
  'Speed Force'
];

const OCCreator: React.FC<OCCreatorProps> = ({ onSave, existingOC }) => {
  const [formData, setFormData] = useState<OC>(existingOC || {
    name: '',
    backstory: '',
    avatar: '',
    powers: ['', ''],
    stats: {
      strength: 50,
      speed: 50,
      intelligence: 50
    },
    specialAbility: '',
    createdAt: 0
  });
  const [loading, setLoading] = useState(false);
  const [specialAbilityCount, setSpecialAbilityCount] = useState(existingOC?.specialAbility.length || 0);

  const handleStatChange = (stat: keyof OC['stats'], value: number) => {
    setFormData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: value
      }
    }));
  };

  const handlePowerChange = (index: number, value: string) => {
    const newPowers = [...formData.powers];
    newPowers[index] = value;
    setFormData(prev => ({
      ...prev,
      powers: newPowers
    }));
  };

  const handleSpecialAbilityChange = (value: string) => {
    if (value.length <= 1000) {
      setFormData(prev => ({ ...prev, specialAbility: value }));
      setSpecialAbilityCount(value.length);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving OC:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalStats = formData.stats.strength + formData.stats.speed + formData.stats.intelligence;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Wand2 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {existingOC ? 'Edit Your Character' : 'Create Your Character'}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-300 px-4">Design your ultimate original character for battle</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-black/20 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 border border-purple-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                  Character Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  placeholder="Enter character name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  placeholder="https://example.com/avatar.jpg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                  Power 1
                </label>
                <select
                  value={formData.powers[0]}
                  onChange={(e) => handlePowerChange(0, e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  required
                >
                  <option value="">Select a power</option>
                  {POWER_OPTIONS.map(power => (
                    <option key={power} value={power}>{power}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                  Power 2
                </label>
                <select
                  value={formData.powers[1]}
                  onChange={(e) => handlePowerChange(1, e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  required
                >
                  <option value="">Select a power</option>
                  {POWER_OPTIONS.map(power => (
                    <option key={power} value={power}>{power}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                  Backstory
                </label>
                <p className="text-xs sm:text-sm text-gray-400 mb-2">
                  Use line breaks to separate paragraphs for better formatting
                </p>
                <textarea
                  value={formData.backstory}
                  onChange={(e) => setFormData(prev => ({ ...prev, backstory: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-28 sm:h-32 resize-none text-sm sm:text-base leading-relaxed"
                  placeholder="Tell us about your character's origin story...&#10;&#10;You can use multiple paragraphs to organize your backstory better."
                  required
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                  Special Ability Description
                </label>
                <p className="text-xs sm:text-sm text-gray-400 mb-2">
                  Describe your ultimate ability in detail ({specialAbilityCount}/300)
                </p>
                <textarea
                  value={formData.specialAbility}
                  onChange={(e) => handleSpecialAbilityChange(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-28 sm:h-32 resize-none text-sm sm:text-base leading-relaxed"
                  placeholder="Describe your character's ultimate ability...&#10;&#10;Include details about how it works and its effects."
                  maxLength={1000}
                  required
                />
                <div className={`text-xs mt-1 ${specialAbilityCount >= 280 ? 'text-red-400' : 'text-gray-500'}`}>
                  {specialAbilityCount}/300 characters
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4 border border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                  Stats (Total: {totalStats}/300)
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
                  {Object.entries(formData.stats).map(([stat, value]) => (
                    <div key={stat}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-300 capitalize">
                          {stat}
                        </label>
                        <span className="text-purple-400 font-bold text-sm sm:text-base">{value}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={value}
                        onChange={(e) => handleStatChange(stat as keyof OC['stats'], parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${value}%, #374151 ${value}%, #374151 100%)`
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{existingOC ? 'Update Character' : 'Create Character'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OCCreator;
