import { useState, useEffect } from 'react';
import { ref, onValue, set, off, remove, update } from 'firebase/database';
import { database } from '../firebase/config';
import { OC, Power } from '../types';

export const useOC = (uid: string | undefined) => {
  const [oc, setOC] = useState<OC | null>(null);
  const [loading, setLoading] = useState(true);
  const [banned, setBanned] = useState(false);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const userRef = ref(database, `users/${uid}`);
    
    const handleData = (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        setBanned(data.banned || false);
        setOC(data.oc || null);
      } else {
        setBanned(false);
        setOC(null);
      }
      setLoading(false);
    };

    onValue(userRef, handleData);

    return () => off(userRef, 'value', handleData);
  }, [uid]);

  const saveOC = async (ocData: OC) => {
    if (!uid) throw new Error('User not authenticated');
    
    const ocRef = ref(database, `users/${uid}/oc`);
    await set(ocRef, {
      ...ocData,
      createdAt: Date.now(),
      wins: ocData.wins || 0,
      history: ocData.history || [],
      powersAbsorbed: ocData.powersAbsorbed || []
    });
  };

  const executeBattleResult = async (
    winnerUid: string,
    loserUid: string,
    winnerOC: OC,
    loserOC: OC,
    winnerNewStats: { strength: number; speed: number; intelligence: number }
  ) => {
    if (!uid) throw new Error('User not authenticated');

    const updates: any = {};
    const timestamp = Date.now();
    const date = new Date().toISOString().split('T')[0];

    // Update winner's OC
    const newWinnerPowers = [...winnerOC.powers, ...loserOC.powers];
    const newHistory = [
      ...(winnerOC.history || []),
      {
        opponent: loserOC.name,
        result: 'won' as const,
        date,
        powersGained: loserOC.powers,
        statsGained: 10,
        timestamp
      }
    ];
    const newAbsorbedPowers = [
      ...(winnerOC.powersAbsorbed || []),
      ...loserOC.powers.map(power => ({
        power,
        fromOpponent: loserOC.name,
        timestamp
      }))
    ];

    updates[`users/${winnerUid}/oc`] = {
      ...winnerOC,
      powers: newWinnerPowers,
      stats: winnerNewStats,
      wins: (winnerOC.wins || 0) + 1,
      history: newHistory,
      powersAbsorbed: newAbsorbedPowers
    };

    // Ban the loser and remove their OC
    updates[`users/${loserUid}/oc`] = null;
    updates[`users/${loserUid}/banned`] = true;

    // Add to Hall of Destruction
    updates[`hallOfDestruction/${loserUid}`] = {
      name: loserOC.name,
      defeatedBy: winnerOC.name,
      powersStolen: loserOC.powers,
      timestamp,
      date,
      stats: loserOC.stats,
      avatar: loserOC.avatar
    };

    await update(ref(database), updates);
  };

  return { oc, loading, banned, saveOC, executeBattleResult };
};