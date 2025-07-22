import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useOC } from '../../hooks/useOC';
import { Power, POWER_OPTIONS } from '../../utils/powers';
import { User, Wand2, Shield, Zap, Upload, Link, Eye, EyeOff } from 'lucide-react';
import ImageUploader from './ImageUploader';
import CustomPowerCreator from './CustomPowerCreator';
import { canCreateCustomPower } from '../../utils/titles';

interface OCCreatorProps {
  onClose: () => void;
  editingOC?: any;
}

const OCCreator: React.FC<OCCreatorProps> = ({ onClose, editingOC }) => {
  const { user } = useAuth();
  const { createOC, updateOC, checkNameExists } = useOC();
  
  const [formData, setFormData] = useState({
    name: '',
    backstory: '',
    avatar: '',
    specialAbility: '',
    powers: [] as Power[],
    stats: {
      strength: 50,
      intelligence: 50,
      speed: 50,
      durability: 50
    }
  });

  const [selectedPowers, setSelectedPowers] = useState<string[]>([]);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [nameError, setNameError] = useState('');
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [showCustomPowerCreator, setShowCustomPowerCreator] = useState(false);
  const [customPowers, setCustomPowers] = useState<Power[]>([]);

  const isEditing = !!editingOC;
  const remainingPoints = 200 - Object.values(formData.stats).reduce((sum, val) => sum + val, 0);

  useEffect(() => {
    if (editingOC) {
      setFormData({
        name: editingOC.name || '',
        backstory: editingOC.backstory || '',
        avatar: editingOC.avatar || '',
        specialAbility: editingOC.specialAbility || '',
        powers: editingOC.powers || [],
        stats: editingOC.stats || {
          strength: 50,
          intelligence: 50,
          speed: 50,
          durability: 50
        }
      });
      
      // Handle both old string powers and new Power objects
      const powerNames = editingOC.powers?.map((power: any) => 
        typeof power === 'string' ? power : power.name
      ) || [];
      setSelectedPowers(powerNames);
    }
  }, [editingOC]);

  const checkName = async (name: string) => {
    if (!name.trim() || name === editingOC?.name) {
      setNameError('');
      return;
    }

    setIsCheckingName(true);
    try {
      const exists = await checkNameExists(name.trim());
      if (exists) {
        setNameError('This name is already taken');
      } else {
        setNameError('');
      }
    } catch (error) {
      console.error('Error checking name:', error);
    } finally {
      setIsCheckingName(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData(prev => ({ ...prev, name: newName }));
    
    // Debounce name checking
    const timeoutId = setTimeout(() => checkName(newName), 500);
    return () => clearTimeout(timeoutId);
  };

  const handleStatChange = (stat: keyof typeof formData.stats, value: number) => {
    if (isEditing) return; // Can't edit stats after creation
    
    const newValue = Math.max(10, Math.min(150, value));
    const currentTotal = Object.values(formData.stats).reduce((sum, val) => sum + val, 0);
    const otherStats = currentTotal - formData.stats[stat];
    
    if (otherStats + newValue <= 200) {
      setFormData(prev => ({
        ...prev,
        stats: { ...prev.stats, [stat]: newValue }
      }));
    }
  };

  const handlePowerToggle = (powerName: string) => {
    if (isEditing) return; // Can't edit powers after creation
    
    setSelectedPowers(prev => {
      if (prev.includes(powerName)) {
        return prev.filter(p => p !== powerName);
      } else if (prev.length < 4) {
        return [...prev, powerName];
      }
      return prev;
    });
  };

  const handleCustomPowerCreated = (power: Power) => {
    setCustomPowers(prev => [...prev, power]);
    setShowCustomPowerCreator(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    if (nameError) return;
    if (!isEditing && selectedPowers.length === 0) {
      alert('Please select at least one power');
      return;
    }

    try {
      // Get selected powers (including custom ones)
      const allAvailablePowers = [...POWER_OPTIONS, ...customPowers];
      const selectedPowerObjects = selectedPowers.map(powerName => 
        allAvailablePowers.find(p => p.name === powerName)
      ).filter(Boolean) as Power[];

      const ocData = {
        ...formData,
        powers: isEditing ? formData.powers : selectedPowerObjects,
        userId: user.uid,
        createdAt: editingOC?.createdAt || new Date().toISOString(),
        wins: editingOC?.wins || 0,
        powersStolen: editingOC?.powersStolen || []
      };

      if (isEditing) {
        await updateOC(editingOC.id, ocData);
      } else {
        await createOC(ocData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving OC:', error);
      alert('Error saving character. Please try again.');
    }
  };

  const canCreateCustom = editingOC && canCreateCustomPower(editingOC);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isEditing ? 'Edit Character' : 'Create Your OC'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Character Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Character Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                className={`w-full p-3 border rounded-lg ${nameError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter character name"
                required
              />
              {isCheckingName && <p className="text-blue-500 text-sm mt-1">Checking availability...</p>}
              {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Upload className="inline w-4 h-4 mr-1" />
                Avatar
              </label>
              <div className="flex items-center space-x-4">
                {formData.avatar && (
                  <img 
                    src={formData.avatar} 
                    alt="Avatar" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter image URL"
                  />
                  <button
                    type="button"
                    onClick={() => setShowImageUploader(!showImageUploader)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {showImageUploader ? <EyeOff className="w-4 h-4 inline mr-1" /> : <Eye className="w-4 h-4 inline mr-1" />}
                    {showImageUploader ? 'Hide' : 'Show'} Uploader
                  </button>
                </div>
              </div>
              
              {showImageUploader && (
                <div className="mt-4">
                  <ImageUploader
                    onImageUploaded={(url) => {
                      setFormData(prev => ({ ...prev, avatar: url }));
                      setShowImageUploader(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Backstory */}
            <div>
              <label className="block text-sm font-medium mb-2">Backstory</label>
              <textarea
                value={formData.backstory}
                onChange={(e) => setFormData(prev => ({ ...prev, backstory: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg h-24"
                placeholder="Tell us about your character's background..."
                maxLength={500}
              />
              <p className="text-sm text-gray-500 mt-1">{formData.backstory.length}/500 characters</p>
            </div>

            {/* Special Ability */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Wand2 className="inline w-4 h-4 mr-1" />
                Special Ability Description
              </label>
              <textarea
                value={formData.specialAbility}
                onChange={(e) => setFormData(prev => ({ ...prev, specialAbility: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg h-24"
                placeholder="Describe your character's unique special ability..."
                maxLength={700}
                required
              />
              <p className={`text-sm mt-1 ${formData.specialAbility.length > 600 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.specialAbility.length}/700 characters
              </p>
            </div>

            {/* Stats */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Shield className="inline w-4 h-4 mr-1" />
                Stats {isEditing && <span className="text-red-500">(Cannot be changed after creation)</span>}
              </label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData.stats).map(([stat, value]) => (
                  <div key={stat}>
                    <label className="block text-sm font-medium mb-1 capitalize">{stat}</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="10"
                        max="150"
                        value={value}
                        onChange={(e) => handleStatChange(stat as keyof typeof formData.stats, parseInt(e.target.value))}
                        className="flex-1"
                        disabled={isEditing}
                      />
                      <span className="w-12 text-center font-medium">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className={`text-sm mt-2 ${remainingPoints < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                Points remaining: {remainingPoints}
              </p>
            </div>

            {/* Powers */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Zap className="inline w-4 h-4 mr-1" />
                Powers {isEditing && <span className="text-red-500">(Cannot be changed after creation)</span>}
              </label>
              
              {!isEditing && (
                <>
                  <p className="text-sm text-gray-600 mb-3">Select up to 4 powers ({selectedPowers.length}/4)</p>
                  
                  {canCreateCustom && (
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={() => setShowCustomPowerCreator(true)}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        ⭐ Create Custom Power
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {[...POWER_OPTIONS, ...customPowers].map((power) => (
                      <div
                        key={power.name}
                        onClick={() => handlePowerToggle(power.name)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedPowers.includes(power.name)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{power.name}</h4>
                          {customPowers.includes(power) && <span className="text-yellow-500">⭐</span>}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{power.description}</p>
                        <div className="flex space-x-4 text-xs">
                          <span className="text-red-600">ATK: {power.attack}</span>
                          <span className="text-blue-600">DEF: {power.defense}</span>
                          <span className="text-purple-600">MAG: {power.magic}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {isEditing && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Current Powers:</p>
                  {formData.powers.map((power, index) => (
                    <div key={index} className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{typeof power === 'string' ? power : power.name}</h4>
                      </div>
                      {typeof power === 'object' && (
                        <>
                          <p className="text-sm text-gray-600 mb-2">{power.description}</p>
                          <div className="flex space-x-4 text-xs">
                            <span className="text-red-600">ATK: {power.attack}</span>
                            <span className="text-blue-600">DEF: {power.defense}</span>
                            <span className="text-purple-600">MAG: {power.magic}</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={nameError || isCheckingName || (!isEditing && selectedPowers.length === 0) || remainingPoints < 0}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isEditing ? 'Update Character' : 'Create Character'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showCustomPowerCreator && (
        <CustomPowerCreator
          onClose={() => setShowCustomPowerCreator(false)}
          onPowerCreated={handleCustomPowerCreated}
        />
      )}
    </div>
  );
};

export default OCCreator;
