import { useState, useEffect } from 'react';
import { ref, onValue, off, push, set } from 'firebase/database';
import { database } from '../firebase/config';
import { OCComment } from '../types';

export const useComments = (ocOwnerUid: string | undefined) => {
  const [comments, setComments] = useState<OCComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ocOwnerUid) {
      setLoading(false);
      return;
    }

    const commentsRef = ref(database, `ocComments/${ocOwnerUid}`);
    
    const handleData = (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const commentsList = Object.values(data) as OCComment[];
        commentsList.sort((a, b) => b.timestamp - a.timestamp);
        setComments(commentsList);
      } else {
        setComments([]);
      }
      setLoading(false);
    };

    onValue(commentsRef, handleData);

    return () => off(commentsRef, 'value', handleData);
  }, [ocOwnerUid]);

  const addComment = async (comment: string, userUid: string, username: string) => {
    if (!ocOwnerUid) throw new Error('OC owner not specified');
    
    const commentsRef = ref(database, `ocComments/${ocOwnerUid}`);
    const newCommentRef = push(commentsRef);
    
    await set(newCommentRef, {
      uid: userUid,
      username,
      comment: comment.trim(),
      timestamp: Date.now()
    });
  };

  return { comments, loading, addComment };
};