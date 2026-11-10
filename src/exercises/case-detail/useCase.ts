import { useCallback, useEffect, useState } from 'react';
import type { Comment, SecurityCase } from './types';

const API = 'http://localhost:3005';

export function useCase() {
  const [theCase, setCase] = useState<SecurityCase | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API}/api/case`)
      .then((res) => res.json())
      .then((data) => {
        setCase(data.case);
        setComments(data.comments);
        setUsers(data.users);
      });
  }, []);

  const patchCase = useCallback((patch: Partial<SecurityCase>) => {
    setCase((prev) => (prev ? { ...prev, ...patch } : prev));
    fetch(`${API}/api/case`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
      .then((res) => res.json())
      .then((data) => setCase(data.case));
  }, []);

  const addComment = useCallback((body: string) => {
    const optimistic: Comment = {
      id: `c-${Date.now()}`,
      author: 'd.levi',
      at: new Date().toISOString(),
      body,
    };
    setComments((prev) => [...prev, optimistic]);
    fetch(`${API}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    })
      .then((res) => res.json())
      .then((data) => setComments((prev) => [...prev, data.comment]));
  }, []);

  const deleteComment = useCallback((id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    fetch(`${API}/api/comments/${id}`, { method: 'DELETE' });
  }, []);

  return { theCase, comments, users, patchCase, addComment, deleteComment };
}
