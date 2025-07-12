import { OC } from '../types';

export const getTitleForOC = (oc: OC): string => {
  const wins = oc.wins || 0;
  const powers = oc.powers.length;
  
  // Special titles based on achievements
  if (wins >= 10) return "🌟 The Legendary";
  if (wins >= 5) return "👑 The Destroyer";
  if (wins >= 3) return "💀 The Void";
  if (powers >= 4) return "⚡ Overpowered";
  if (wins >= 1) return "🔥 Battle Tested";
  
  return "🌱 Rookie";
};

export const getTitleColor = (title: string): string => {
  if (title.includes("Legendary")) return "text-yellow-400";
  if (title.includes("Destroyer")) return "text-red-400";
  if (title.includes("Void")) return "text-purple-400";
  if (title.includes("Overpowered")) return "text-orange-400";
  if (title.includes("Battle Tested")) return "text-blue-400";
  return "text-gray-400";
};