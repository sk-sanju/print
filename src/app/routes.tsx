import React from 'react';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { NewForm } from '../pages/NewForm/NewForm';
import { Preview } from '../pages/Preview/Preview';
import { SavedForms } from '../pages/SavedForms/SavedForms';

interface AppRoutesProps {
  currentRoute: string;
  routeParams: Record<string, any>;
  onNavigate: (route: string, params?: Record<string, any>) => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ currentRoute, routeParams, onNavigate }) => {
  switch (currentRoute) {
    case 'dashboard':
      return <Dashboard onNavigate={onNavigate} />;
    case 'new-form':
      return <NewForm editId={routeParams.id} onNavigate={onNavigate} />;
    case 'preview':
      return <Preview id={routeParams.id} refNo={routeParams.ref} autoPrint={routeParams.autoPrint} onNavigate={onNavigate} />;
    case 'saved-forms':
      return <SavedForms onNavigate={onNavigate} />;
    default:
      return <Dashboard onNavigate={onNavigate} />;
  }
};
