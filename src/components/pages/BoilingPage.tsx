'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/common/PageHeader';
import { FormField } from '@/components/common/FormField';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { AlertMessage } from '@/components/common/AlertMessage';
import { createBoilingEntry } from '@/lib/api';
import { Flame, Save, RotateCcw } from 'lucide-react';

const shiftOptions = [
  { value: 'Aamu', label: 'Aamu' },
  { value: 'Ilta', label: 'Ilta' },
  { value: 'Yö', label: 'Yö' },
];

const lineOptions = [
  { value: 'Keittolinja 1', label: 'Keittolinja 1' },
  { value: 'Keittolinja 2', label: 'Keittolinja 2' },
  { value: 'Keittolinja 3', label: 'Keittolinja 3' },
];

interface BoilingFormData {
  entry_date: string;
  shift_name: string;
  batch_code: string;
  line_name: string;
  notes: string;
  recipe_name: string;
  target_temp: string;
  actual_temp: string;
  duration_min: string;
  quantity_kg: string;
  waste_kg: string;
  deviation_note: string;
}

const initialFormData: BoilingFormData = {
  entry_date: new Date().toISOString().split('T')[0],
  shift_name: '',
  batch_code: '',
  line_name: '',
  notes: '',
  recipe_name: '',
  target_temp: '',
  actual_temp: '',
  duration_min: '',
  quantity_kg: '',
  waste_kg: '',
  deviation_note: '',
};

export function BoilingPage() {
  const [formData, setFormData] = useState<BoilingFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof BoilingFormData, value: string) => {
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
      await createBoilingEntry({
        entry_date: formData.entry_date,
        shift_name: formData.shift_name,
        batch_code: formData.batch_code,
        line_name: formData.line_name,
        notes: formData.notes,
        payload: {
          recipe_name: formData.recipe_name,
          target_temp: parseFloat(formData.target_temp) || 0,
          actual_temp: parseFloat(formData.actual_temp) || 0,
          duration_min: parseInt(formData.duration_min) || 0,
          quantity_kg: parseFloat(formData.quantity_kg) || 0,
          waste_kg: parseFloat(formData.waste_kg) || 0,
          deviation_note: formData.deviation_note,
        },
      });

      setSuccess('Keittomerkintä tallennettu onnistuneesti!');
      // Reset form but keep date
      setFormData({
        ...initialFormData,
        entry_date: formData.entry_date,
        shift_name: formData.shift_name,
        line_name: formData.line_name,
      });
    } catch (err) {
      setError('Tallennus epäonnistui. Tarkista tiedot ja yritä uudelleen.');
      console.error('Error saving boiling entry:', err);
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
        title="Keitto"
        description="Lisää uusi keittomerkintä"
        icon={<Flame className="h-6 w-6 text-orange-500" />}
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
            <CardTitle className="text-xl">Keittotiedot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              label="Reseptin nimi"
              name="recipe_name"
              type="text"
              value={formData.recipe_name}
              onChange={(v) => updateField('recipe_name', v)}
              placeholder="esim. Perusresepti"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Tavoitelämpötila (°C)"
                name="target_temp"
                type="number"
                value={formData.target_temp}
                onChange={(v) => updateField('target_temp', v)}
                step="0.1"
                min="0"
                max="200"
              />
              <FormField
                label="Toteutunut lämpötila (°C)"
                name="actual_temp"
                type="number"
                value={formData.actual_temp}
                onChange={(v) => updateField('actual_temp', v)}
                step="0.1"
                min="0"
                max="200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Kesto (min)"
                name="duration_min"
                type="number"
                value={formData.duration_min}
                onChange={(v) => updateField('duration_min', v)}
                min="0"
              />
              <FormField
                label="Määrä (kg)"
                name="quantity_kg"
                type="number"
                value={formData.quantity_kg}
                onChange={(v) => updateField('quantity_kg', v)}
                step="0.1"
                min="0"
              />
              <FormField
                label="Hukka (kg)"
                name="waste_kg"
                type="number"
                value={formData.waste_kg}
                onChange={(v) => updateField('waste_kg', v)}
                step="0.1"
                min="0"
              />
            </div>

            <FormField
              label="Poikkeamahuomio"
              name="deviation_note"
              type="textarea"
              value={formData.deviation_note}
              onChange={(v) => updateField('deviation_note', v)}
              placeholder="Kirjaa mahdolliset poikkeamat..."
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
            className="h-14 text-lg flex-1 bg-orange-500 hover:bg-orange-600"
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
