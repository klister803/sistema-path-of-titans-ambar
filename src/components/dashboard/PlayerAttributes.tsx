import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { ChevronDown, ChevronUp, Sword } from 'lucide-react';

const attributeTranslations: Record<string, string> = {
  MaxHealth: 'Saúde Máxima',
  HealthRecoveryRate: 'Taxa de Recuperação de Saúde',
  Stamina: 'Vigor',
  MaxStamina: 'Vigor Máximo',
  StaminaRecoveryRate: 'Taxa de Recuperação de Vigor',
  CombatWeight: 'Peso de Combate',
  Armor: 'Armadura',
  MovementSpeedMultiplier: 'Multiplicador de Velocidade de Movimento',
  TurnRadiusMultiplier: 'Multiplicador de Raio de Giro',
  SprintingSpeedMultiplier: 'Multiplicador de Velocidade de Corrida',
  TrottingSpeedMultiplier: 'Multiplicador de Velocidade de Trote',
  JumpForceMultiplier: 'Multiplicador de Força de Salto',
  AirControlMultiplier: 'Multiplicador de Controle Aéreo',
  BodyFoodAmount: 'Quantidade de Comida no Corpo',
  CurrentBodyFoodAmount: 'Quantidade Atual de Comida no Corpo',
  BodyFoodAmountCorpseThreshold: 'Limite de Comida no Corpo para Cadáver',
  Hunger: 'Fome',
  MaxHunger: 'Fome Máxima',
  HungerDepletionRate: 'Taxa de Perda de Fome',
  FoodConsumptionRate: 'Taxa de Consumo de Comida',
  Thirst: 'Sede',
  MaxThirst: 'Sede Máxima',
  BleedingRate: 'Taxa de Sangramento',
  PoisonRate: 'Taxa de Envenenamento',
  VenomRate: 'Taxa de Envenenamento por Veneno',
  HungerDamage: 'Dano por Fome',
  ThirstDamage: 'Dano por Sede',
  ThirstDepletionRate: 'Taxa de Perda de Sede',
  OxygenDamage: 'Dano por Falta de Oxigênio',
  BleedingHealRate: 'Taxa de Cura de Sangramento',
  PoisonHealRate: 'Taxa de Cura de Envenenamento',
  VenomHealRate: 'Taxa de Cura de Envenenamento por Veneno',
  GrowthPerSecond: 'Crescimento por Segundo',
  GrowthPerSecondMultiplier: 'Multiplicador de Crescimento por Segundo',
  Growth: 'Crescimento',
  AttackDamage: 'Dano de Ataque',
  BoneBreakChance: 'Chance de Quebra de Osso',
  BoneBreakAmount: 'Quantidade de Quebra de Osso',
  BleedAmount: 'Quantidade de Sangramento',
  PoisonAmount: 'Quantidade de Veneno',
  VenomAmount: 'Quantidade de Veneno por Veneno',
  IncomingDamage: 'Dano Recebido',
  IncomingSurvivalDamage: 'Dano de Sobrevivência Recebido',
  IncomingBoneBreakAmount: 'Quantidade de Quebra de Osso Recebida',
  IncomingBleedingRate: 'Taxa de Sangramento Recebida',
  IncomingPoisonRate: 'Taxa de Envenenamento Recebida',
  IncomingVenomRate: 'Taxa de Envenenamento por Veneno Recebida',
  WaterConsumptionRate: 'Taxa de Consumo de Água',
  Oxygen: 'Oxigênio',
  MaxOxygen: 'Oxigênio Máximo',
  OxygenDepletionRate: 'Taxa de Perda de Oxigênio',
  OxygenRecoveryRate: 'Taxa de Recuperação de Oxigênio',
  FallDeathSpeed: 'Velocidade de Morte por Queda',
  FallingLegDamage: 'Dano de Perna por Queda',
  LegDamage: 'Dano de Perna',
  LegHealRate: 'Taxa de Cura de Perna',
  LimpHealthThreshold: 'Limite de Saúde para Manco',
};

const initialAttributes = [
  'MaxHealth',
  'Stamina',
  'Armor',
  'AttackDamage',
  'MovementSpeedMultiplier',
  'Growth',
];

export const PlayerAttributes: React.FC = () => {
  const { user } = useAuthStore();
  const { playerAttributes, fetchPlayerAttributes } = useDashboardStore();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (user?.username) {
      fetchPlayerAttributes(user.username);
    }
  }, [user?.username, fetchPlayerAttributes]);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[rgba(var(--color-obsidian),0.8)] border border-[rgba(var(--color-gold),0.2)] rounded-lg p-6"
    >
      <motion.button
        onClick={toggleShowAll}
        className="w-full flex items-center justify-between p-3 rounded-lg text-left text-[rgb(var(--color-gold))]
                   hover:bg-[rgba(var(--color-gold),0.1)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="relative"
            animate={{ rotate: showAll ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sword size={20} />
          </motion.div>
          <h2 className="text-xl font-bold">
            Atributos do Personagem
          </h2>
        </div>
        {showAll ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </motion.button>
      
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: showAll ? 'auto' : 0, opacity: showAll ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {Object.entries(playerAttributes).map(([key, value]) => (
            <div key={key} className="flex justify-between text-[rgba(var(--color-gold),0.8)]">
              <span>{attributeTranslations[key] || key}</span>
              <span>{value || 'N/A'}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};