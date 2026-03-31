'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/common/PageHeader';
import { FormField } from '@/components/common/FormField';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { AlertMessage } from '@/components/common/AlertMessage';
import { createPackagingEntry } from '@/lib/api';
import { Package, Save, RotateCcw } from 'lucide-react';

const shiftOptions = [
  { value: 'Aamu', label: 'Aamu' },
  { value: 'Ilta', label: 'Ilta' },
  { value: 'Yö', label: 'Yö' },
];

const lineOptions = [
  { value: 'Pakkauslinja 1', label: 'Pakkauslinja 1' },
  { value: 'Pakkauslinja 2', label: 'Pakkauslinja 2' },
  { value: 'Pakkauslinja 3', label: 'Pakkauslinja 3' },
];

const packageTypeOptions = [
  { value: 'Laatikko', label: 'Laatikko' },
  { value: 'Pussi', label: 'Pussi' },
  { value: 'Säiliö', label: 'Säiliö' },
  { value: 'Muu', label: 'Muu' },
];

interface PackagingFormData {
  entry_date: string;
  shift_name: string;
  batch_code: string;
  line_name: string;
  notes: string;
  package_type: string;
  units_total: string;
  defective_units: string;
  downtime_min: string;
  packaging_note: string;
}

const initialFormData: PackagingFormData = {
  entry_date: new Date().toISOString().split('T')[0],
  shift_name: '',
  batch_code: '',
  line_name: '',
  notes: '',
  package_type: '',
  units_total: '',
  defective_units: '',
  downtime_min: '',
  packaging_note: '',
};

export function PackagingPage() {
  const [formData, setFormData] = useState<PackagingFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof PackagingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSuccess(null);
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.entry_date) {
      setError('Päivämäärä on pakollinen');
      return false;
    }
    if (!formData.shift_name) {
      setError('Vuoro on pakollinen');
      return false;
    }
    if (!formData.batch_code) {
      setError('Eräkoodi on pakollinen');
      return false;
    }
    if (!formData.line_name) {
      setError('Linjan nimi on pakollinen');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createPackagingEntry({
        entry_date: formData.entry_date,
        shift_name: formData.shift_name,
        batch_code: formData.batch_code,
        line_name: formData.line_name,
        notes: formData.notes,
        payload: {
          package_type: formData.package_type,
          units_total: parseInt(formData.units_total) || 0,
          defective_units: parseInt(formData.defective_units) || 0,
          downtime_min: parseInt(formData.downtime_min) || 0,
          packaging_note: formData.packaging_note,
        },
      });

      setSuccess('Pakkausmerkintä tallennettu onnistuneesti!');
      setFormData({
        ...initialFormData,
        entry_date: formData.entry_date,
        shift_name: formData.shift_name,
        line_name: formData.line_name,
      });
    } catch (err) {
      setError('Tallennus epäonnistui. Tarkista tiedot ja yritä uudelleen.');
      console.error('Error saving packaging entry:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ...initialFormData,
      entry_date: new Date().toISOString().split('T')[0],
    });
    setSuccess(null);
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Pakkaus"
        description="Lisää uusi pakkausmerkintä"
        icon={<Package className="h-6 w-6 text-blue-500" />}
      />

      {success && (
        <AlertMessage
          type="success"
          title="Onnistui!"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Perustiedot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Päivämäärä"
                name="entry_date"
                type="date"
                value={formData.entry_date}
                onChange={(v) => updateField('entry_date', v)}
                required
              />
              <FormField
                label="Vuoro"
                name="shift_name"
                type="select"
                value={formData.shift_name}
                onChange={(v) => updateField('shift_name', v)}
                options={shiftOptions}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Eräkoodi"
                name="batch_code"
                type="text"
                value={formData.batch_code}
                onChange={(v) => updateField('batch_code', v)}
                placeholder="esim. BATCH-001"
                required
              />
              <FormField
                label="Linja"
                name="line_name"
                type="select"
                value={formData.line_name}
                onChange={(v) => updateField('line_name', v)}
                options={lineOptions}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm mt-4">
          <CardHeader>
            <CardTitle className="text-xl">Pakkaustiedot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              label="Pakkaustyyppi"
              name="package_type"
              type="select"
              value={formData.package_type}
              onChange={(v) => updateField('package_type', v)}
              options={packageTypeOptions}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Kokonaismäärä (kpl)"
                name="units_total"
                type="number"
                value={formData.units_total}
                onChange={(v) => updateField('units_total', v)}
                min="0"
              />
              <FormField
                label="Vialliset (kpl)"
                name="defective_units"
                type="number"
                value={formData.defective_units}
                onChange={(v) => updateField('defective_units', v)}
                min="0"
              />
              <FormField
                label="Seisonta-aika (min)"
                name="downtime_min"
                type="number"
                value={formData.downtime_min}
                onChange={(v) => updateField('downtime_min', v)}
                min="0"
              />
            </div>

            <FormField
              label="Pakkaushuomio"
              name="packaging_note"
              type="textarea"
              value={formData.packaging_note}
              onChange={(v) => updateField('packaging_note', v)}
              placeholder="Kirjaa mahdolliset huomiot pakkauksesta..."
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm mt-4">
          <CardHeader>
            <CardTitle className="text-xl">Lisätiedot</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              label="Muistiinpanot"
              name="notes"
              type="textarea"
              value={formData.notes}
              onChange={(v) => updateField('notes', v)}
              placeholder="Vapaamuotoiset huomiot..."
            />
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            type="submit"
            size="lg"
            className="h-14 text-lg flex-1 bg-blue-500 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Tallennetaan...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Tallenna merkintä
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-14 text-lg"
            onClick={resetForm}
            disabled={loading}
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Tyhjennä lomake
          </Button>
        </div>
      </form>
    </div>
  );
}
