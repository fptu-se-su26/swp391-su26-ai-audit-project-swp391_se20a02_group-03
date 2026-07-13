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
      // Tắt log nội bộ của SignalR: khi unmount giữa lúc negotiation (StrictMode double-mount)
      // nó tự console.error "connection was stopped during negotiation" dù ta đã catch.
      .configureLogging(signalR.LogLevel.None)
      .build();

    connection.on('ReceiveNotification', (payload) => {
      push(payload);
    });

    const startPromise = connection.start().catch(() => {
      /* hub optional in dev */
    });

    connectionRef.current = connection;

    return () => {
      // Chờ start() kết thúc (thành công hoặc thất bại) rồi mới stop — tránh ngắt giữa negotiation.
      startPromise.finally(() => {
        connection.stop().catch(() => {});
      });
    };
  }, [enabled, push]);

  const clear = useCallback(() => setNotifications([]), []);

  return { notifications, clear, unreadCount: notifications.length };
}
