'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable, PhaseBadge } from '@/components/common/DataTable';
import { StatCard } from '@/components/common/StatCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { AlertMessage } from '@/components/common/AlertMessage';
import { useNavigationStore } from '@/store/navigation';
import { getEntries, Entry } from '@/lib/api';
import {
  Flame,
  Package,
  Layers,
  RefreshCw,
  Search,
  Calendar,
  Filter,
} from 'lucide-react';

export function DashboardPage() {
  const { setCurrentPage } = useNavigationStore();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEntries();
      setEntries(data);
    } catch (err) {
      setError('Tietojen hakeminen epäonnistui. Yritä uudelleen.');
      console.error('Error fetching entries:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Phase filter
      if (phaseFilter !== 'all' && entry.phase !== phaseFilter) {
        return false;
      }

      // Date filter
      if (dateFilter && entry.entry_date !== dateFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          entry.batch_code?.toLowerCase().includes(search) ||
          entry.line_name?.toLowerCase().includes(search) ||
          entry.notes?.toLowerCase().includes(search)
        );
      }

      return true;
    });
  }, [entries, phaseFilter, dateFilter, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const boilingCount = entries.filter((e) => e.phase === 'boiling').length;
    const packagingCount = entries.filter((e) => e.phase === 'packaging').length;
    const separationCount = entries.filter((e) => e.phase === 'separation').length;

    return {
      total: entries.length,
      boiling: boilingCount,
      packaging: packagingCount,
      separation: separationCount,
    };
  }, [entries]);

  const columns = [
    {
      key: 'id',
      header: 'ID',
      className: 'w-20',
    },
    {
      key: 'phase',
      header: 'Vaihe',
      render: (item: Entry) => <PhaseBadge phase={item.phase || ''} />,
    },
    {
      key: 'entry_date',
      header: 'Päivämäärä',
      render: (item: Entry) => new Date(item.entry_date).toLocaleDateString('fi-FI'),
    },
    {
      key: 'shift_name',
      header: 'Vuoro',
    },
    {
      key: 'batch_code',
      header: 'Erä',
    },
    {
      key: 'line_name',
      header: 'Linja',
    },
    {
      key: 'created_at',
      header: 'Luotu',
      render: (item: Entry) =>
        item.created_at
          ? new Date(item.created_at).toLocaleString('fi-FI', {
              dateStyle: 'short',
              timeStyle: 'short',
            })
          : '-',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Ladataan tietoja..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Etusivu"
        description="Tuotantoraportointijärjestelmän yhteenveto"
        icon={<Flame className="h-6 w-6 text-orange-500" />}
      />

      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* Quick action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button
          size="lg"
          className="h-16 text-lg bg-orange-500 hover:bg-orange-600"
          onClick={() => setCurrentPage('boiling')}
        >
          <Flame className="h-6 w-6 mr-3" />
          Uusi keitto
        </Button>
        <Button
          size="lg"
          className="h-16 text-lg bg-blue-500 hover:bg-blue-600"
          onClick={() => setCurrentPage('packaging')}
        >
          <Package className="h-6 w-6 mr-3" />
          Uusi pakkaus
        </Button>
        <Button
          size="lg"
          className="h-16 text-lg bg-green-500 hover:bg-green-600"
          onClick={() => setCurrentPage('separation')}
        >
          <Layers className="h-6 w-6 mr-3" />
          Uusi erotus
        </Button>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Kaikki merkinnät"
          value={stats.total}
          icon={<RefreshCw className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="Keitto"
          value={stats.boiling}
          icon={<Flame className="h-6 w-6 text-orange-500" />}
        />
        <StatCard
          title="Pakkaus"
          value={stats.packaging}
          icon={<Package className="h-6 w-6 text-blue-500" />}
        />
        <StatCard
          title="Erotus"
          value={stats.separation}
          icon={<Layers className="h-6 w-6 text-green-500" />}
        />
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Suodata merkintöjä
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-base">Haku</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Hae erällä tai linjalla..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Vaihe</Label>
              <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Kaikki vaiheet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Kaikki vaiheet</SelectItem>
                  <SelectItem value="boiling">Keitto</SelectItem>
                  <SelectItem value="packaging">Pakkaus</SelectItem>
                  <SelectItem value="separation">Erotus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Päivämäärä
              </Label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="h-12 w-full text-base"
                onClick={() => {
                  setPhaseFilter('all');
                  setDateFilter('');
                  setSearchTerm('');
                }}
              >
                Tyhjennä suodattimet
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entries table */}
      <DataTable
        data={filteredEntries}
        columns={columns}
        title="Viimeisimmät merkinnät"
        emptyMessage="Ei merkintöjä näytettäväksi"
      />

      {/* Refresh button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={fetchEntries} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Päivitä tiedot
        </Button>
      </div>
    </div>
  );
}
