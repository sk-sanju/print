import React, { useEffect, useState } from 'react';
import { AddressForm } from '../../components/forms/AddressForm';
import { DraftAlert } from '../../components/forms/DraftAlert';
import { FormService } from '../../services/form.service';
import { useDraftForm } from '../../hooks/useDraftForm';
import { AddressFormData, AddressRecord } from '../../types/address.types';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface NewFormProps {
  editId?: number;
  onNavigate: (route: string, params?: Record<string, any>) => void;
}

export const NewForm: React.FC<NewFormProps> = ({ editId, onNavigate }) => {
  const [editingRecord, setEditingRecord] = useState<AddressRecord | null>(null);
  const [initialFormValues, setInitialFormValues] = useState<Partial<AddressFormData>>({});
  const [showDraftAlert, setShowDraftAlert] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { hasDraft, savedDraftData, saveDraft, clearDraft } = useDraftForm();

  useEffect(() => {
    async function loadEditData() {
      if (editId) {
        setIsLoading(true);
        try {
          const record = await FormService.getForm(editId);
          if (record) {
            setEditingRecord(record);
            setInitialFormValues(record);
          }
        } catch (err) {
          console.error('Error loading form for editing:', err);
        } finally {
          setIsLoading(false);
        }
      } else {
        // If creating new form and an unsaved draft exists, prompt user
        if (hasDraft && savedDraftData) {
          setShowDraftAlert(true);
        }
      }
    }
    loadEditData();
  }, [editId, hasDraft, savedDraftData]);

  const handleRestoreDraft = () => {
    if (savedDraftData) {
      setInitialFormValues(savedDraftData);
      setShowDraftAlert(false);
    }
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setShowDraftAlert(false);
  };

  const handleSubmit = async (data: AddressFormData) => {
    try {
      setIsLoading(true);
      if (editingRecord && editingRecord.id) {
        const updated = await FormService.updateForm(editingRecord.id, data);
        onNavigate('preview', { id: updated.id });
      } else {
        const created = await FormService.saveNewForm(data);
        clearDraft(); // clear draft after successful save
        onNavigate('preview', { id: created.id });
      }
    } catch (err) {
      console.error('Failed to save address form:', err);
      alert('Unable to save the form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('dashboard')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {editingRecord ? `Edit Form: ${editingRecord.referenceNumber}` : 'New Address Form'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in customer details to generate printable address slip
            </p>
          </div>
        </div>
      </div>

      {/* Unsaved Draft Alert */}
      {!editId && showDraftAlert && (
        <DraftAlert onRestore={handleRestoreDraft} onDiscard={handleDiscardDraft} />
      )}

      {/* Main Address Form Card */}
      <AddressForm
        key={editingRecord ? `edit-${editingRecord.id}` : 'new-form-instance'}
        initialValues={initialFormValues}
        onSubmit={handleSubmit}
        onFormChange={(data) => {
          if (!editId) {
            saveDraft(data);
          }
        }}
        onClear={() => {
          if (!editId) {
            clearDraft();
          }
        }}
        isEditing={!!editId}
        isLoading={isLoading}
      />
    </div>
  );
};
