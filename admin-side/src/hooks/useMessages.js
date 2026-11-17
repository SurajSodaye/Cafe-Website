import { useState, useEffect, useMemo, useCallback } from 'react';
import { messageService } from '../services/messageService';
import { useToast } from '../context/ToastContext';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = messageService.subscribe(
      (data) => {
        setMessages(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('useMessages subscription error:', err);
        setError(err?.message || 'Could not connect to messages stream.');
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const newCount = useMemo(() => {
    return messages.filter((m) => m.status === 'new').length;
  }, [messages]);

  const updateStatus = useCallback(
    async (id, newStatus, { silent = false } = {}) => {
      try {
        await messageService.updateStatus(id, newStatus);
        // Optimistic in-memory update for instant responsiveness
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
        );
        if (!silent) {
          const capitalized = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
          showToast(`Marked as ${capitalized}`, 'success');
        }
      } catch (err) {
        showToast(err.message || 'Failed to update message status', 'error');
        throw err;
      }
    },
    [showToast]
  );

  const deleteMessage = useCallback(
    async (id) => {
      try {
        await messageService.remove(id);
        setMessages((prev) => prev.filter((m) => m.id !== id));
        showToast('Message deleted permanently', 'success');
      } catch (err) {
        showToast(err.message || 'Failed to delete message', 'error');
        throw err;
      }
    },
    [showToast]
  );

  return {
    messages,
    loading,
    error,
    newCount,
    updateStatus,
    deleteMessage
  };
};
