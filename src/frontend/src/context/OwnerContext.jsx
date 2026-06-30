import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ownerApi } from '../api/ownerApi';
import { useAuth } from './AuthContext';

const OwnerContext = createContext(null);
const STORAGE_KEY = 'owner_selected_complex_id';

export function OwnerProvider({ children }) {
  const { isAuthenticated, isCourtOwner, isAdmin } = useAuth();
  const [context, setContext] = useState(null);
  const [complexId, setComplexIdState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setComplexId = useCallback((id) => {
    setComplexIdState(id);
    if (id) localStorage.setItem(STORAGE_KEY, String(id));
  }, []);

  const reload = useCallback(async () => {
    if (!isAuthenticated || (!isCourtOwner && !isAdmin)) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await ownerApi.getContext();
      if (res.statusCode === 200 && res.data) {
        setContext(res.data);
        const stored = localStorage.getItem(STORAGE_KEY);
        const storedId = stored ? parseInt(stored, 10) : null;
        const managed = res.data.managedComplexes || [];
        const validStored = managed.some(c => c.complexId === storedId);
        const nextId = validStored
          ? storedId
          : (res.data.defaultComplexId ?? managed[0]?.complexId ?? null);
        setComplexIdState(nextId);
      } else {
        setError(res.message || 'Không tải được context chủ sân.');
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Không tải được context chủ sân.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isCourtOwner, isAdmin]);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <OwnerContext.Provider value={{
      context,
      complexId,
      setComplexId,
      loading,
      error,
      reload,
      complexes: context?.managedComplexes ?? [],
    }}>
      {children}
    </OwnerContext.Provider>
  );
}

export function useOwner() {
  const ctx = useContext(OwnerContext);
  if (!ctx) throw new Error('useOwner phải dùng trong OwnerProvider');
  return ctx;
}
