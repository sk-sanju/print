import { useState, useEffect, useCallback } from 'react';
import { AddressFormData } from '../types/address.types';

const DRAFT_STORAGE_KEY = 'address_print_form_draft_v1';

export function useDraftForm() {
  const [hasDraft, setHasDraft] = useState<boolean>(false);
  const [savedDraftData, setSavedDraftData] = useState<AddressFormData | null>(null);

  // Check for existing draft on initial mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AddressFormData;
        // Verify draft has at least some meaningful value
        const hasContent = Object.values(parsed).some((val) => typeof val === 'string' && val.trim().length > 0);
        if (hasContent) {
          setSavedDraftData(parsed);
          setHasDraft(true);
        }
      }
    } catch {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }, []);

  const saveDraft = useCallback((data: Partial<AddressFormData>) => {
    try {
      const hasContent = Object.values(data).some((val) => typeof val === 'string' && val.trim().length > 0);
      if (hasContent) {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
      } else {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to auto-save draft:', e);
    }
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasDraft(false);
      setSavedDraftData(null);
    } catch (e) {
      console.error('Failed to clear draft:', e);
    }
  }, []);

  return {
    hasDraft,
    savedDraftData,
    saveDraft,
    clearDraft,
  };
}
