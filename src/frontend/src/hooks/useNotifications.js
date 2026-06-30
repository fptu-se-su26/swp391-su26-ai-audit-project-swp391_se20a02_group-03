import { useEffect, useRef, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';

const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5138/api').replace(/\/api\/?$/, '');

export function useNotifications(enabled = true) {
  const [notifications, setNotifications] = useState([]);
  const connectionRef = useRef(null);

  const push = useCallback((n) => {
    setNotifications((prev) => [n, ...prev].slice(0, 20));
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return undefined;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_ROOT}/hubs/notifications`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection.on('ReceiveNotification', (payload) => {
      push(payload);
    });

    connection.start().catch(() => {
      /* hub optional in dev */
    });

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [enabled, push]);

  const clear = useCallback(() => setNotifications([]), []);

  return { notifications, clear, unreadCount: notifications.length };
}
