'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertMessage } from '@/components/common/AlertMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAuthStore } from '@/store/auth';
import { login as apiLogin } from '@/lib/api';
import { Flame } from 'lucide-react';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await apiLogin(username, password);
      login(response.token, response.user);
    } catch (err) {
      if (err instanceof Error) {
        setError('Kirjautuminen epäonnistui. Tarkista käyttäjätunnus ja salasana.');
      } else {
        setError('Virhe kirjautumisessa. Yritä uudelleen.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="flex justify-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <Flame className="h-12 w-12 text-orange-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Tuotantoraportointi
          </CardTitle>
          <CardDescription className="text-base">
            Kirjaudu sisään jatkaaksesi
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {error && (
            <AlertMessage
              type="error"
              message={error}
              className="mb-4"
              onClose={() => setError(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-base font-medium">
                Käyttäjätunnus
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Syötä käyttäjätunnus"
                required
                className="h-12 text-base"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-medium">
                Salasana
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Syötä salasana"
                required
                className="h-12 text-base"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Kirjaudutaan...
                </>
              ) : (
                'Kirjaudu sisään'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
