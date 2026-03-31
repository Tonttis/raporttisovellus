'use client';

import { useEffect, useState } from 'react';
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
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { AlertMessage } from '@/components/common/AlertMessage';
import { StatCard } from '@/components/common/StatCard';
import { getDailyReport, getWasteReport, exportCsv, DailyReport, WasteReport } from '@/lib/api';
import { BarChart3, Download, Calendar, TrendingDown, RefreshCw } from 'lucide-react';

export function ReportsPage() {
  const [dailyReport, setDailyReport] = useState<DailyReport[]>([]);
  const [wasteReport, setWasteReport] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Report filters
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Export filters
  const [exportPhase, setExportPhase] = useState<string>('boiling');
  const [exportFrom, setExportFrom] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
  );
  const [exportTo, setExportTo] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const [daily, waste] = await Promise.all([
        getDailyReport(selectedDate),
        getWasteReport(),
      ]);
      setDailyReport(daily);
      setWasteReport(waste);
    } catch (err) {
      setError('Raporttien hakeminen epäonnistui. Yritä uudelleen.');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setLoading(true);
    try {
      const daily = await getDailyReport(date);
      setDailyReport(daily);
    } catch (err) {
      setError('Päivittäisen raportin hakeminen epäonnistui.');
      console.error('Error fetching daily report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportCsv(exportPhase, exportFrom, exportTo);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportPhase}_raportti_${exportFrom}_${exportTo}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('CSV-viennin epäonnistui. Yritä uudelleen.');
      console.error('Error exporting CSV:', err);
    } finally {
      setExporting(false);
    }
  };

  // Calculate totals
  const totalEntries = dailyReport.reduce((sum, r) => sum + r.total_entries, 0);
  const totalWaste = wasteReport.reduce(
    (sum, r) => sum + parseFloat(r.total_waste_kg || '0'),
    0
  );

  // Chart data for entries by phase
  const phaseColors: Record<string, string> = {
    boiling: 'bg-orange-500',
    packaging: 'bg-blue-500',
    separation: 'bg-green-500',
  };

  const phaseLabels: Record<string, string> = {
    boiling: 'Keitto',
    packaging: 'Pakkaus',
    separation: 'Erotus',
  };

  const maxEntries = Math.max(...dailyReport.map((r) => r.total_entries), 1);

  // Waste chart data (last 7 days)
  const recentWaste = wasteReport.slice(-7);
  const maxWaste = Math.max(...recentWaste.map((r) => parseFloat(r.total_waste_kg || '0')), 1);

  if (loading && dailyReport.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Ladataan raportteja..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Raportit"
        description="Tuotantotilastot ja raportit"
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
      />

      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* Date selector */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Valitse päivämäärä
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label className="text-base">Päivämäärä</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <Button
              variant="outline"
              className="h-12"
              onClick={fetchReports}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Päivitä
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Merkinnät yhteensä"
          value={totalEntries}
          subtitle={selectedDate}
        />
        <StatCard
          title="Keitto"
          value={dailyReport.find((r) => r.phase === 'boiling')?.total_entries || 0}
        />
        <StatCard
          title="Pakkaus"
          value={dailyReport.find((r) => r.phase === 'packaging')?.total_entries || 0}
        />
        <StatCard
          title="Erotus"
          value={dailyReport.find((r) => r.phase === 'separation')?.total_entries || 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entries by phase chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Merkinnät vaiheittain</CardTitle>
          </CardHeader>
          <CardContent>
            {dailyReport.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                Ei tietoja valittuna päivänä
              </p>
            ) : (
              <div className="space-y-4">
                {dailyReport.map((item) => (
                  <div key={item.phase} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium">
                        {phaseLabels[item.phase] || item.phase}
                      </span>
                      <span className="text-base font-semibold">
                        {item.total_entries} kpl
                      </span>
                    </div>
                    <div className="h-8 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${phaseColors[item.phase] || 'bg-gray-500'} transition-all duration-500`}
                        style={{
                          width: `${(item.total_entries / maxEntries) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Waste report chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Hukka viime päivinä (kg)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {wasteReport.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                Ei hukkatietoja saatavilla
              </p>
            ) : (
              <div className="space-y-3">
                {recentWaste.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        {new Date(item.entry_date).toLocaleDateString('fi-FI', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <span className="text-base font-semibold text-red-600">
                        {parseFloat(item.total_waste_kg || '0').toFixed(1)} kg
                      </span>
                    </div>
                    <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-400 transition-all duration-500"
                        style={{
                          width: `${(parseFloat(item.total_waste_kg || '0') / maxWaste) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Yhteensä</span>
                    <span className="text-lg font-bold text-red-600">
                      {totalWaste.toFixed(1)} kg
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CSV Export section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Download className="h-5 w-5" />
            Vie CSV-tiedosto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-base">Vaihe</Label>
              <Select value={exportPhase} onValueChange={setExportPhase}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boiling">Keitto</SelectItem>
                  <SelectItem value="packaging">Pakkaus</SelectItem>
                  <SelectItem value="separation">Erotus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-base">Alkaen</Label>
              <Input
                type="date"
                value={exportFrom}
                onChange={(e) => setExportFrom(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base">Asti</Label>
              <Input
                type="date"
                value={exportTo}
                onChange={(e) => setExportTo(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <Button
              className="h-12 text-base"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Viedään...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Vie CSV
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
