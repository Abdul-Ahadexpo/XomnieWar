import { OC } from '../types';

export const getTitleForOC = (oc: OC, isTopPlayer: boolean = false): string => {
  const wins = oc.wins || 0;
  const powers = oc.powers.length;
  
  // Special title for top player
  if (isTopPlayer) return "👑 The King";
  
  // Special titles based on achievements
  if (wins >= 100) return "🌌 The Omnipotent";
  if (wins >= 75) return "⚡ The Unstoppable";
  if (wins >= 50) return "🔥 The Annihilator";
  if (wins >= 30) return "💀 The Destroyer";
  if (wins >= 20) return "🌟 The Legendary";
  if (wins >= 15) return "👑 The Conqueror";
  if (wins >= 10) return "⚔️ The Warrior";
  if (wins >= 5) return "🛡️ The Guardian";
  if (wins >= 3) return "💪 The Fighter";
  if (powers >= 4) return "⚡ Overpowered";
  if (wins >= 1) return "🔥 Battle Tested";
  
  return "🌱 Rookie";
};

export const getTitleColor = (title: string): string => {
  if (title.includes("King")) return "text-yellow-500";
  if (title.includes("Omnipotent")) return "text-purple-500";
  if (title.includes("Unstoppable")) return "text-cyan-400";
  if (title.includes("Annihilator")) return "text-red-500";
  if (title.includes("Destroyer")) return "text-red-400";
  if (title.includes("Legendary")) return "text-yellow-400";
  if (title.includes("Conqueror")) return "text-orange-500";
  if (title.includes("Warrior")) return "text-blue-500";
  if (title.includes("Guardian")) return "text-green-500";
  if (title.includes("Fighter")) return "text-indigo-400";
  if (title.includes("Overpowered")) return "text-orange-400";
  if (title.includes("Battle Tested")) return "text-blue-400";
  return "text-gray-400";
};

export const canCreateCustomPower = (oc: OC): boolean => {
  const wins = oc.wins || 0;
  return wins >= 20; // Must be "The Legendary" or higher
};