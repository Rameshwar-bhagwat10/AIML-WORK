import { useState, useEffect } from 'react';
import { AuthService } from './auth.service';

export function useAuthUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
