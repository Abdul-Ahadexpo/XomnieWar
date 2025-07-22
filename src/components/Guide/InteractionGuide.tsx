import React, { useState } from 'react';
import { ArrowLeft, Book, User, Sword, Trophy, Bell, Search, Skull, BarChart3, Zap, Shield, Target, Crown, Star, Info, Sparkles, Plus } from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
}

const InteractionGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [animatedElements, setAnimatedElements] = useState<Set<string>>(new Set());

  const triggerAnimation = (elementId: string) => {
    setAnimatedElements(prev => new Set([...prev, elementId]));
    setTimeout(() => {
      setAnimatedElements(prev => {
        const newSet = new Set(prev);
        newSet.delete(elementId);
        return newSet;
      });
    }, 1000);
  };

  const sections: GuideSection[] = [
    {
      id: 'overview',
      title: 'Game Overview',
      icon: Book,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-6 border border-purple-500/30 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
            <h3 className="text-xl font-bold text-purple-400 mb-4">Welcome to XomnieWar!</h3>
            <p className="text-gray-200 mb-4">
              XomnieWar is a strategic character battle game where you create your own Original Character (OC) 
              and battle against other players' characters. The stakes are high - winners absorb all powers 
              from defeated opponents, while losers get permanently banned!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30 transform transition-all duration-300 hover:scale-105 hover:bg-green-900/30">
                <h4 className="text-green-400 font-bold mb-2">🏆 Victory Rewards:</h4>
                <ul className="text-green-200 text-sm space-y-1">
                  <li>• Absorb ALL opponent's powers</li>
                  <li>• Gain +10 to all stats</li>
                  <li>• Increase your win count</li>
                  <li>• Climb the leaderboard</li>
                </ul>
              </div>
              <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30 transform transition-all duration-300 hover:scale-105 hover:bg-red-900/30">
                <h4 className="text-red-400 font-bold mb-2">💀 Defeat Consequences:</h4>
                <ul className="text-red-200 text-sm space-y-1">
                  <li>• Character permanently deleted</li>
                  <li>• Account gets banned forever</li>
                  <li>• Added to Hall of Destruction</li>
                  <li>• Cannot create new characters</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'create-oc',
      title: 'Creating Your OC',
      icon: User,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-500/30 transform transition-all duration-500 hover:scale-105">
            <h3 className="text-xl font-bold text-blue-400 mb-4">Step-by-Step OC Creation</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-800/30 rounded-lg p-4 transform transition-all duration-300 hover:bg-gray-700/40 hover:scale-102">
                <h4 className="text-yellow-400 font-bold mb-2">1. Character Name</h4>
                <p className="text-gray-200 text-sm mb-2">Choose a unique name for your character.</p>
                <div className="bg-red-900/20 rounded p-2 border border-red-500/30 animate-pulse">
                  <p className="text-red-300 text-xs">⚠️ Names must be unique! "Natsuo" is reserved for the legendary king.</p>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 transform transition-all duration-300 hover:bg-gray-700/40 hover:scale-102">
                <h4 className="text-yellow-400 font-bold mb-2">2. Character Avatar</h4>
                <p className="text-gray-200 text-sm mb-2">Upload an image or provide a URL for your character's appearance.</p>
                <ul className="text-gray-300 text-xs space-y-1">
                  <li>• Drag & drop images directly</li>
                  <li>• Click to browse files</li>
                  <li>• Paste image URLs</li>
                  <li>• Max file size: 32MB</li>
                </ul>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 transform transition-all duration-300 hover:bg-gray-700/40 hover:scale-102">
                <h4 className="text-yellow-400 font-bold mb-2">3. Powers (Choose 2) - NEW SYSTEM!</h4>
                <p className="text-gray-200 text-sm mb-2">Select 2 powers with Attack, Defense, and Magic stats.</p>
                <div className="bg-blue-900/20 rounded p-2 border border-blue-500/30 mb-2">
                  <p className="text-blue-300 text-xs">✨ Each power has Attack, Defense, and Magic values that affect battle outcomes!</p>
                </div>
                <div className="bg-yellow-900/20 rounded p-2 border border-yellow-500/30 mb-2">
                  <p className="text-yellow-300 text-xs">⭐ Legendary players (10+ wins) can create custom powers!</p>
                </div>
                <div className="bg-orange-900/20 rounded p-2 border border-orange-500/30">
                  <p className="text-orange-300 text-xs">🔒 Powers cannot be changed after creation! Choose wisely.</p>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 transform transition-all duration-300 hover:bg-gray-700/40 hover:scale-102">
                <h4 className="text-yellow-400 font-bold mb-2">4. Stats Distribution</h4>
                <p className="text-gray-200 text-sm mb-2">Allocate points between Strength, Speed, and Intelligence (1-100 each).</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-red-400 font-bold">Strength</div>
                    <div className="text-gray-400">Attack power</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 font-bold">Speed</div>
                    <div className="text-gray-400">Agility & evasion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 font-bold">Intelligence</div>
                    <div className="text-gray-400">Special abilities</div>
                  </div>
                </div>
                <div className="bg-orange-900/20 rounded p-2 border border-orange-500/30 mt-2">
                  <p className="text-orange-300 text-xs">🔒 Stats cannot be changed after creation! Only improve through victories.</p>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 transform transition-all duration-300 hover:bg-gray-700/40 hover:scale-102">
                <h4 className="text-yellow-400 font-bold mb-2">5. Special Ability (Max 700 chars)</h4>
                <p className="text-gray-200 text-sm mb-2">Describe your character's ultimate ability in detail.</p>
                <p className="text-gray-400 text-xs">This can be edited later, unlike powers and stats.</p>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 transform transition-all duration-300 hover:bg-gray-700/40 hover:scale-102">
                <h4 className="text-yellow-400 font-bold mb-2">6. Backstory</h4>
                <p className="text-gray-200 text-sm mb-2">Write your character's origin story and background.</p>
                <p className="text-gray-400 text-xs">Use line breaks to separate paragraphs for better formatting.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'battle-system',
      title: 'Battle System',
      icon: Sword,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-lg p-6 border border-red-500/30 transform transition-all duration-500 hover:scale-105">
            <h3 className="text-xl font-bold text-red-400 mb-4">How Battles Work</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-800/30 rounded-lg p-4 transform transition-all duration-300 hover:bg-gray-700/40">
                <h4 className="text-orange-400 font-bold mb-2">Power Requirements</h4>
                <p className="text-gray-200 text-sm mb-2">You need at least 100 power less than your opponent to battle them.</p>
                <div className="bg-blue-900/20 rounded p-2 border border-blue-500/30">
                  <p className="text-blue-300 text-xs">Example: If opponent has 400 power, you need at least 300 power to challenge them.</p>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 transform transition-all duration-300 hover:bg-gray-700/40">
                <h4 className="text-orange-400 font-bold mb-2">Battle Request System</h4>
                <ol className="text-gray-200 text-sm space-y-1 list-decimal list-inside">
                  <li>Send a battle request to your target</li>
                  <li>Wait for them to accept or reject</li>
                  <li>If accepted, both players enter battle mode</li>
                  <li>Fight in real-time turn-based combat</li>
                </ol>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 transform transition-all duration-300 hover:bg-gray-700/40">
                <h4 className="text-orange-400 font-bold mb-2">Combat Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-red-900/20 rounded p-3 border border-red-500/30 text-center transform transition-all duration-300 hover:scale-110 hover:bg-red-900/40">
                    <Sword className="h-6 w-6 text-red-400 mx-auto mb-2" />
                    <div className="text-red-400 font-bold text-sm">Attack</div>
                    <div className="text-gray-300 text-xs">High damage to opponent</div>
                  </div>
                  <div className="bg-blue-900/20 rounded p-3 border border-blue-500/30 text-center transform transition-all duration-300 hover:scale-110 hover:bg-blue-900/40">
                    <Shield className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-blue-400 font-bold text-sm">Defend</div>
                    <div className="text-gray-300 text-xs">Reduce incoming damage</div>
                  </div>
                  <div className="bg-purple-900/20 rounded p-3 border border-purple-500/30 text-center transform transition-all duration-300 hover:scale-110 hover:bg-purple-900/40">
                    <Zap className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-purple-400 font-bold text-sm">Special</div>
                    <div className="text-gray-300 text-xs">Ultimate ability attack</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 transform transition-all duration-300 hover:bg-gray-700/40">
                <h4 className="text-orange-400 font-bold mb-2">NEW: Strategic Combat System</h4>
                <p className="text-gray-200 text-sm mb-2">Battles now use power stats for fair calculations:</p>
                <ul className="text-gray-300 text-xs space-y-1">
                  <li>• <span className="text-red-400">Attack</span> determines damage output</li>
                  <li>• <span className="text-blue-400">Defense</span> reduces incoming damage</li>
                  <li>• <span className="text-purple-400">Magic</span> enhances special abilities</li>
                  <li>• Turn-based combat with 100 HP each</li>
                </ul>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 transform transition-all duration-300 hover:bg-gray-700/40">
                <h4 className="text-orange-400 font-bold mb-2">Victory Conditions</h4>
                <p className="text-gray-200 text-sm mb-2">Battle continues until one character reaches 0 HP.</p>
                <div className="bg-yellow-900/20 rounded p-2 border border-yellow-500/30 animate-pulse">
                  <p className="text-yellow-300 text-xs">👑 Special Rule: The current King can never be defeated!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'navigation',
      title: 'Navigation Guide',
      icon: Search,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-lg p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-green-400 mb-4">Dashboard Navigation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-blue-400" />
                    <span className="text-blue-400 font-bold text-sm">Profile</span>
                  </div>
                  <p className="text-gray-300 text-xs">View and edit your character. Share your OC with others.</p>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm">Battle Arena</span>
                  </div>
                  <p className="text-gray-300 text-xs">Browse all available opponents and send battle requests.</p>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Skull className="h-4 w-4 text-red-400" />
                    <span className="text-red-400 font-bold text-sm">Hall of Destruction</span>
                  </div>
                  <p className="text-gray-300 text-xs">Memorial for all defeated characters and their final stats.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Bell className="h-4 w-4 text-orange-400" />
                    <span className="text-orange-400 font-bold text-sm">Battle Requests</span>
                  </div>
                  <p className="text-gray-300 text-xs">Manage incoming battle challenges. Accept or reject requests.</p>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                    <span className="text-purple-400 font-bold text-sm">Leaderboard</span>
                  </div>
                  <p className="text-gray-300 text-xs">See the top 10 most powerful characters in the game.</p>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Search className="h-4 w-4 text-cyan-400" />
                    <span className="text-cyan-400 font-bold text-sm">Explore</span>
                  </div>
                  <p className="text-gray-300 text-xs">Discover random characters and potential opponents.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sharing',
      title: 'Sharing & Comments',
      icon: Star,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-6 border border-cyan-500/30">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Social Features</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-800/30 rounded-lg p-4">
                <h4 className="text-cyan-400 font-bold mb-2">Sharing Your Character</h4>
                <p className="text-gray-200 text-sm mb-2">Every character has a unique shareable link:</p>
                <div className="bg-gray-700/50 rounded p-2 font-mono text-xs text-green-400">
                  https://xomniewar.app/oc/your-character-id
                </div>
                <p className="text-gray-400 text-xs mt-2">Click the share button on your profile to copy the link.</p>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4">
                <h4 className="text-cyan-400 font-bold mb-2">Viewing Other Characters</h4>
                <ul className="text-gray-200 text-sm space-y-1">
                  <li>• Visit shared links to see other characters</li>
                  <li>• View their powers, stats, and backstory</li>
                  <li>• Send battle requests directly from their page</li>
                  <li>• Leave comments (max 100 characters)</li>
                </ul>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4">
                <h4 className="text-cyan-400 font-bold mb-2">Comments System</h4>
                <p className="text-gray-200 text-sm mb-2">Interact with other players' characters:</p>
                <ul className="text-gray-300 text-xs space-y-1">
                  <li>• Leave short comments on character pages</li>
                  <li>• Comments are limited to 100 characters</li>
                  <li>• Comments appear in real-time</li>
                  <li>• Cannot comment on your own character</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'titles',
      title: 'Titles & Achievements',
      icon: Crown,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-6 border border-yellow-500/30 transform transition-all duration-500 hover:scale-105">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Achievement System</h3>
            
            <div className="space-y-4">
              <p className="text-gray-200 text-sm mb-4">
                Earn prestigious titles based on your achievements in battle:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gray-800/30 rounded-lg p-3 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700/40">
                  <div className="text-gray-400 font-bold text-sm mb-1">🌱 Rookie</div>
                  <div className="text-gray-300 text-xs">New players starting their journey</div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-3 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700/40">
                  <div className="text-blue-400 font-bold text-sm mb-1">🔥 Battle Tested</div>
                  <div className="text-gray-300 text-xs">Win your first battle</div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-3 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700/40">
                  <div className="text-orange-400 font-bold text-sm mb-1">⚡ Overpowered</div>
                  <div className="text-gray-300 text-xs">Collect 4 or more powers</div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-3 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700/40">
                  <div className="text-purple-400 font-bold text-sm mb-1">💀 The Void</div>
                  <div className="text-gray-300 text-xs">Achieve 3 or more victories</div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-3 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700/40">
                  <div className="text-red-400 font-bold text-sm mb-1">👑 The Destroyer</div>
                  <div className="text-gray-300 text-xs">Dominate with 5+ victories</div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-3 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700/40">
                  <div className="text-yellow-400 font-bold text-sm mb-1">🌟 The Legendary</div>
                  <div className="text-gray-300 text-xs">Reach 10+ victories - Unlock custom power creation!</div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-3 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700/40">
                  <div className="text-red-500 font-bold text-sm mb-1">🔥 The Annihilator</div>
                  <div className="text-gray-300 text-xs">Achieve 20 or more victories</div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-3 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700/40">
                  <div className="text-cyan-400 font-bold text-sm mb-1">⚡ The Unstoppable</div>
                  <div className="text-gray-300 text-xs">Dominate with 30+ victories</div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-3 transform transition-all duration-300 hover:scale-105 hover:bg-gray-700/40">
                  <div className="text-purple-500 font-bold text-sm mb-1">🌌 The Omnipotent</div>
                  <div className="text-gray-300 text-xs">Reach the ultimate 50+ victories</div>
                </div>
              </div>

              <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30 transform transition-all duration-500 hover:scale-105 animate-pulse">
                <h4 className="text-yellow-400 font-bold mb-2 flex items-center space-x-2">
                  <Crown className="h-5 w-5" />
                  <span>👑 Special: The King</span>
                  <Crown className="h-5 w-5" />
                </h4>
                <p className="text-yellow-300 text-sm">
                  The top player on the leaderboard becomes "The King" and can never be defeated in battle! 
                  Challenge them to steal their crown, but beware - they have divine protection!
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-4 border border-yellow-500/30 transform transition-all duration-500 hover:scale-105">
                <h4 className="text-yellow-400 font-bold mb-2 flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>⭐ NEW: Custom Power Creation</span>
                  <Plus className="h-5 w-5" />
                </h4>
                <p className="text-yellow-300 text-sm mb-2">
                  Legendary players (10+ wins) can create their own unique powers!
                </p>
                <ul className="text-yellow-200 text-xs space-y-1">
                  <li>• Allocate 75 total stat points across Attack, Defense, Magic</li>
                  <li>• Write custom descriptions up to 200 characters</li>
                  <li>• Your custom powers are marked with ⭐</li>
                  <li>• Only you can create powers with your unique style!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentSection = sections.find(s => s.id === activeSection) || sections[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Book className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              XomnieWar Guide
            </h1>
            <Info className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
          </div>
          <p className="text-sm sm:text-base text-gray-300 px-4">
            Complete guide to mastering XomnieWar - from character creation to legendary battles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-4 border border-purple-500/20 sticky top-4 transform transition-all duration-500 hover:scale-105">
              <h3 className="text-lg font-bold text-white mb-4">Guide Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                        activeSection === section.id
                          ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 transform scale-105'
                          : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30 hover:scale-102'
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 transform transition-all duration-500 hover:shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <currentSection.icon className={`h-6 w-6 text-purple-400 ${animatedElements.has(currentSection.id) ? 'animate-spin' : ''}`} />
                <h2 className="text-2xl font-bold text-white">{currentSection.title}</h2>
                <button
                  onClick={() => triggerAnimation(currentSection.id)}
                  className="ml-auto p-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </button>
              </div>
              
              <div className="prose prose-invert max-w-none">
                {currentSection.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractionGuide;