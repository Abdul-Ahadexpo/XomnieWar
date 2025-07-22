export interface Power {
  name: string;
  attack: number;
  defense: number;
  magic: number;
  description: string;
}

export const POWER_OPTIONS: Power[] = [
  {
    name: 'Telekinesis',
    attack: 25,
    defense: 15,
    magic: 35,
    description: 'Move objects with your mind, creating powerful telekinetic attacks and barriers.'
  },
  {
    name: 'Fire Manipulation',
    attack: 40,
    defense: 10,
    magic: 25,
    description: 'Control flames to burn enemies and create protective fire walls.'
  },
  {
    name: 'Ice Control',
    attack: 30,
    defense: 25,
    magic: 20,
    description: 'Freeze enemies and create ice shields for protection.'
  },
  {
    name: 'Lightning Strike',
    attack: 45,
    defense: 5,
    magic: 30,
    description: 'Channel electricity for devastating attacks with minimal defense.'
  },
  {
    name: 'Time Manipulation',
    attack: 20,
    defense: 20,
    magic: 50,
    description: 'Slow time, accelerate yourself, or glimpse future attacks.'
  },
  {
    name: 'Shadow Control',
    attack: 35,
    defense: 20,
    magic: 30,
    description: 'Manipulate darkness to hide and strike from shadows.'
  },
  {
    name: 'Healing',
    attack: 5,
    defense: 40,
    magic: 40,
    description: 'Restore health and create protective auras around yourself.'
  },
  {
    name: 'Mind Reading',
    attack: 15,
    defense: 30,
    magic: 40,
    description: 'Read thoughts to predict attacks and confuse enemies.'
  },
  {
    name: 'Teleportation',
    attack: 20,
    defense: 35,
    magic: 30,
    description: 'Instantly move to avoid attacks and surprise enemies.'
  },
  {
    name: 'Super Strength',
    attack: 50,
    defense: 20,
    magic: 5,
    description: 'Overwhelming physical power for devastating melee attacks.'
  },
  {
    name: 'Invisibility',
    attack: 25,
    defense: 30,
    magic: 25,
    description: 'Become unseen to avoid attacks and strike unexpectedly.'
  },
  {
    name: 'Energy Blast',
    attack: 40,
    defense: 15,
    magic: 30,
    description: 'Fire concentrated energy beams at enemies.'
  },
  {
    name: 'Force Field',
    attack: 10,
    defense: 50,
    magic: 25,
    description: 'Create powerful barriers to block incoming attacks.'
  },
  {
    name: 'Shape Shifting',
    attack: 30,
    defense: 25,
    magic: 30,
    description: 'Transform your body to adapt to any combat situation.'
  },
  {
    name: 'Portal Creation',
    attack: 25,
    defense: 25,
    magic: 35,
    description: 'Open dimensional rifts for travel and redirecting attacks.'
  },
  {
    name: 'Elemental Control',
    attack: 35,
    defense: 20,
    magic: 35,
    description: 'Command all elements - earth, air, fire, and water.'
  },
  {
    name: 'Flight',
    attack: 20,
    defense: 30,
    magic: 25,
    description: 'Soar through the air to gain tactical advantages.'
  },
  {
    name: 'Speed Force',
    attack: 35,
    defense: 25,
    magic: 25,
    description: 'Move at superhuman speeds to outmaneuver enemies.'
  }
];

export const calculatePowerStats = (powers: Power[]) => {
  return powers.reduce(
    (total, power) => ({
      attack: total.attack + power.attack,
      defense: total.defense + power.defense,
      magic: total.magic + power.magic
    }),
    { attack: 0, defense: 0, magic: 0 }
  );
};