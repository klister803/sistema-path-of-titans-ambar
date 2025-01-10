import { create } from 'zustand';
import { rconApi } from '../lib/api/rcon';

interface DashboardState {
  userLevel: number;
  userExperience: number;
  userGuild: string;
  characterStats: {
    strength: number;
    agility: number;
    intelligence: number;
    health: number;
    mana: number;
  };
  inventoryItems: any[];
  quests: any[];
  socialFeed: any[];
  playerAttributes: Record<string, string>;
  fetchPlayerAttributes: (username: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()((set, get) => ({
  userLevel: 32,
  userExperience: 12345,
  userGuild: 'Planeta Âmbar',
  characterStats: {
    strength: 150,
    agility: 120,
    intelligence: 180,
    health: 2500,
    mana: 1000,
  },
  inventoryItems: [
    {
      id: 'item1',
      name: 'Espada Ancestral',
      icon: '/images/sword.png',
      description: 'Uma espada poderosa forjada por antigos guerreiros.',
    },
    {
      id: 'item2',
      name: 'Poção de Cura',
      icon: '/images/potion.png',
      description: 'Uma poção que restaura sua saúde.',
    },
    {
      id: 'item3',
      name: 'Amuleto da Sorte',
      icon: '/images/amulet.png',
      description: 'Um amuleto que aumenta sua sorte.',
    },
    {
      id: 'item4',
      name: 'Armadura de Escamas',
      icon: '/images/armor.png',
      description: 'Uma armadura feita de escamas de dragão.',
    },
    {
      id: 'item5',
      name: 'Elmo de Ferro',
      icon: '/images/helmet.png',
      description: 'Um elmo resistente feito de ferro.',
    },
    {
      id: 'item6',
      name: 'Botas de Couro',
      icon: '/images/boots.png',
      description: 'Botas confortáveis feitas de couro.',
    },
  ],
  quests: [
    {
      id: 'quest1',
      title: 'A Caçada Inicial',
      description: 'Derrote 5 dinossauros selvagens.',
      reward: '100 XP',
      status: 'active',
    },
    {
      id: 'quest2',
      title: 'A Busca por Fósseis',
      description: 'Encontre 3 fósseis antigos.',
      reward: '200 XP',
      status: 'active',
    },
    {
      id: 'quest3',
      title: 'O Resgate da Aldeia',
      description: 'Resgate os aldeões sequestrados.',
      reward: '300 XP',
      status: 'completed',
    },
  ],
  socialFeed: [
    {
      id: 'feed1',
      user: 'KnustVI',
      activity: 'alcançou o nível 32',
      time: '2 horas atrás',
    },
    {
      id: 'feed2',
      user: 'AmbarWarrior',
      activity: 'concluiu a missão "A Caçada Inicial"',
      time: '5 horas atrás',
    },
    {
      id: 'feed3',
      user: 'DinoMaster',
      activity: 'encontrou um fóssil raro',
      time: '1 dia atrás',
    },
  ],
  playerAttributes: {},
  fetchPlayerAttributes: async (username: string) => {
    const attributes = [
      'MaxHealth',
      'HealthRecoveryRate',
      'Stamina',
      'MaxStamina',
      'StaminaRecoveryRate',
      'CombatWeight',
      'Armor',
      'MovementSpeedMultiplier',
      'TurnRadiusMultiplier',
      'SprintingSpeedMultiplier',
      'TrottingSpeedMultiplier',
      'JumpForceMultiplier',
      'AirControlMultiplier',
      'BodyFoodAmount',
      'CurrentBodyFoodAmount',
      'BodyFoodAmountCorpseThreshold',
      'Hunger',
      'MaxHunger',
      'HungerDepletionRate',
      'FoodConsumptionRate',
      'Thirst',
      'MaxThirst',
      'BleedingRate',
      'PoisonRate',
      'VenomRate',
      'HungerDamage',
      'ThirstDamage',
      'ThirstDepletionRate',
      'OxygenDamage',
      'BleedingHealRate',
      'PoisonHealRate',
      'VenomHealRate',
      'GrowthPerSecond',
      'GrowthPerSecondMultiplier',
      'Growth',
      'AttackDamage',
      'BoneBreakChance',
      'BoneBreakAmount',
      'BleedAmount',
      'PoisonAmount',
      'VenomAmount',
      'IncomingDamage',
      'IncomingSurvivalDamage',
      'IncomingBoneBreakAmount',
      'IncomingBleedingRate',
      'IncomingPoisonRate',
      'IncomingVenomRate',
      'WaterConsumptionRate',
      'Oxygen',
      'MaxOxygen',
      'OxygenDepletionRate',
      'OxygenRecoveryRate',
      'FallDeathSpeed',
      'FallingLegDamage',
      'LegDamage',
      'LegHealRate',
      'LimpHealthThreshold',
    ];

    try {
      const attributePromises = attributes.map(async (attribute) => {
        const response = await rconApi.getPlayerAttribute(username, attribute);
        if (response.success && response.response) {
          return { name: attribute, value: response.response };
        }
        return { name: attribute, value: 'N/A' };
      });

      const attributeResults = await Promise.all(attributePromises);
      const attributesMap = attributeResults.reduce((acc, curr) => {
        acc[curr.name] = curr.value;
        return acc;
      }, {} as Record<string, string>);

      set({ playerAttributes: attributesMap });
    } catch (error) {
      console.error('Failed to fetch player attributes:', error);
    }
  },
}));
