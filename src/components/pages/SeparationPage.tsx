'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/common/PageHeader';
import { FormField } from '@/components/common/FormField';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { AlertMessage } from '@/components/common/AlertMessage';
import { createSeparationEntry } from '@/lib/api';
import { Layers, Save, RotateCcw } from 'lucide-react';

const shiftOptions = [
  { value: 'Aamu', label: 'Aamu' },
  { value: 'Ilta', label: 'Ilta' },
  { value: 'Yö', label: 'Yö' },
];

const lineOptions = [
  { value: 'Erotuslinja 1', label: 'Erotuslinja 1' },
  { value: 'Erotuslinja 2', label: 'Erotuslinja 2' },
  { value: 'Erotuslinja 3', label: 'Erotuslinja 3' },
];

const machineOptions = [
  { value: 'Erotin 1', label: 'Erotin 1' },
  { value: 'Erotin 2', label: 'Erotin 2' },
  { value: 'Erotin 3', label: 'Erotin 3' },
];

const qualityGradeOptions = [
  { value: 'A', label: 'A (Erinomainen)' },
  { value: 'B', label: 'B (Hyvä)' },
  { value: 'C', label: 'C (Tyydyttävä)' },
  { value: 'D', label: 'D (Välttävä)' },
];

interface SeparationFormData {
  entry_date: string;
  shift_name: string;
  batch_code: string;
  line_name: string;
  notes: string;
  machine_name: string;
  input_kg: string;
  output_kg: string;
  quality_grade: string;
  maintenance_note: string;
}

const initialFormData: SeparationFormData = {
  entry_date: new Date().toISOString().split('T')[0],
  shift_name: '',
  batch_code: '',
  line_name: '',
  notes: '',
  machine_name: '',
  input_kg: '',
  output_kg: '',
  quality_grade: '',
  maintenance_note: '',
};

export function SeparationPage() {
  const [formData, setFormData] = useState<SeparationFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof SeparationFormData, value: string) => {
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
      await createSeparationEntry({
        entry_date: formData.entry_date,
        shift_name: formData.shift_name,
        batch_code: formData.batch_code,
        line_name: formData.line_name,
        notes: formData.notes,
        payload: {
          machine_name: formData.machine_name,
          input_kg: parseFloat(formData.input_kg) || 0,
          output_kg: parseFloat(formData.output_kg) || 0,
          quality_grade: formData.quality_grade,
          maintenance_note: formData.maintenance_note,
        },
      });

      setSuccess('Erotusmerkintä tallennettu onnistuneesti!');
      setFormData({
        ...initialFormData,
        entry_date: formData.entry_date,
        shift_name: formData.shift_name,
        line_name: formData.line_name,
      });
    } catch (err) {
      setError('Tallennus epäonnistui. Tarkista tiedot ja yritä uudelleen.');
      console.error('Error saving separation entry:', err);
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

  // Calculate yield percentage
  const yieldPercentage =
    formData.input_kg && formData.output_kg
      ? ((parseFloat(formData.output_kg) / parseFloat(formData.input_kg)) * 100).toFixed(1)
      : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Erotus"
        description="Lisää uusi erotusmerkintä"
        icon={<Layers className="h-6 w-6 text-green-500" />}
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
            <CardTitle className="text-xl">Erotustiedot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Kone"
                name="machine_name"
                type="select"
                value={formData.machine_name}
                onChange={(v) => updateField('machine_name', v)}
                options={machineOptions}
              />
              <FormField
                label="Laatuluokka"
                name="quality_grade"
                type="select"
                value={formData.quality_grade}
                onChange={(v) => updateField('quality_grade', v)}
                options={qualityGradeOptions}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Syötetty (kg)"
                name="input_kg"
                type="number"
                value={formData.input_kg}
                onChange={(v) => updateField('input_kg', v)}
                step="0.1"
                min="0"
              />
              <FormField
                label="Saatu (kg)"
                name="output_kg"
                type="number"
                value={formData.output_kg}
                onChange={(v) => updateField('output_kg', v)}
                step="0.1"
                min="0"
              />
              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">Saanto (%)</label>
                <div className="h-12 px-4 py-2 bg-slate-100 rounded-md flex items-center text-base font-semibold text-green-600">
                  {yieldPercentage ? `${yieldPercentage} %` : '-'}
                </div>
              </div>
            </div>

            <FormField
              label="Huoltohuomio"
              name="maintenance_note"
              type="textarea"
              value={formData.maintenance_note}
              onChange={(v) => updateField('maintenance_note', v)}
              placeholder="Kirjaa mahdolliset huoltotiedot..."
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
            className="h-14 text-lg flex-1 bg-green-500 hover:bg-green-600"
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
