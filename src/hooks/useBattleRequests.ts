import { useState, useEffect } from 'react';
import { ref, onValue, off, set, remove, push } from 'firebase/database';
import { database } from '../firebase/config';
import { BattleRequest } from '../types';

export const useBattleRequests = (uid: string | undefined) => {
  const [incomingRequests, setIncomingRequests] = useState<Record<string, BattleRequest>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const requestsRef = ref(database, `battleRequests/${uid}`);
    
    const handleData = (snapshot: any) => {
      const data = snapshot.val();
      setIncomingRequests(data || {});
      setLoading(false);
    };

    onValue(requestsRef, handleData);

    return () => off(requestsRef, 'value', handleData);
  }, [uid]);

  const sendBattleRequest = async (targetUid: string, fromOC: any) => {
    if (!uid) throw new Error('User not authenticated');
    
    const requestRef = ref(database, `battleRequests/${targetUid}/${uid}`);
    await set(requestRef, {
      fromUid: uid,
      fromOCName: fromOC.name,
      fromOCAvatar: fromOC.avatar,
      fromOCPower: fromOC.stats.strength + fromOC.stats.speed + fromOC.stats.intelligence,
      fromOCData: fromOC, // Store full OC data for battle
      status: 'pending',
      timestamp: Date.now()
    });
  };

  const acceptBattleRequest = async (fromUid: string) => {
    if (!uid) throw new Error('User not authenticated');
    
    const requestRef = ref(database, `battleRequests/${uid}/${fromUid}`);
    await set(requestRef, {
      ...incomingRequests[fromUid],
      status: 'accepted'
    });
  };

  const rejectBattleRequest = async (fromUid: string) => {
    if (!uid) throw new Error('User not authenticated');
    
    const requestRef = ref(database, `battleRequests/${uid}/${fromUid}`);
    await remove(requestRef);
  };

  const removeRequest = async (fromUid: string) => {
    if (!uid) throw new Error('User not authenticated');
    
    const requestRef = ref(database, `battleRequests/${uid}/${fromUid}`);
    await remove(requestRef);
  };

  return {
    incomingRequests,
    loading,
    sendBattleRequest,
    acceptBattleRequest,
    rejectBattleRequest,
    removeRequest
  };
};