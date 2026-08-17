import React, { useEffect, useState } from 'react';
import { FormService } from '../../services/form.service';
import { AddressRecord } from '../../types/address.types';
import { RecentFormsList } from '../../components/recent-forms/RecentFormsList';
import { PWAInstallBanner } from '../../components/pwa/PWAInstallBanner';
import { PWAInstallModal } from '../../components/pwa/PWAInstallModal';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PlusCircle, FileText, Calendar, HardDrive, Wifi, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface DashboardProps {
  onNavigate: (route: string, params?: Record<string, any>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<{
    totalSaved: number;
    todayCount: number;
    recentForms: AddressRecord[];
  }>({
    totalSaved: 0,
    todayCount: 0,
    recentForms: [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState<boolean>(false);
  const { isOnline } = useNetworkStatus();
  const { isInstalled } = usePWAInstall();

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      const data = await FormService.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleQuickPrint = (record: AddressRecord) => {
    onNavigate('preview', { ref: record.referenceNumber, autoPrint: true });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* PWA Install Banner (Hides automatically if already installed) */}
      <PWAInstallBanner />

      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Offline-First Address Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Address & Dispatch Management
            </h1>
            <p className="text-sm text-blue-100 mt-1 max-w-xl">
              Create, print, and search customer shipping slips locally without backend dependencies or data leaks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            {!isInstalled && (
              <Button
                variant="secondary"
                size="lg"
                icon={<Download className="w-5 h-5" />}
                onClick={() => setIsPwaModalOpen(true)}
                className="bg-white text-indigo-900 hover:bg-slate-100 shadow-md font-bold"
              >
                Download App
              </Button>
            )}
            <Button
              variant="gradient"
              size="lg"
              icon={<PlusCircle className="w-5 h-5" />}
              onClick={() => onNavigate('new-form')}
              className="shadow-xl bg-slate-900 hover:bg-slate-800 text-white"
            >
              + New Address
            </Button>
          </div>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Forms */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 absolute top-0 left-0 right-0" />
          <div className="flex items-center justify-between mt-1">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Slips</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 group-hover:text-indigo-600 transition-colors">
                {isLoading ? '...' : metrics.todayCount}
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Total Saved Forms */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-blue-500 absolute top-0 left-0 right-0" />
          <div className="flex items-center justify-between mt-1">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Saved Records</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">
                {isLoading ? '...' : metrics.totalSaved.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Network Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 absolute top-0 left-0 right-0" />
          <div className="flex items-center justify-between mt-1">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Network State</p>
              <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {isOnline ? 'Online Ready' : 'Offline Mode'}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <Wifi className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* PWA App Status & Download */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-purple-300 hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500 absolute top-0 left-0 right-0" />
          <div className="flex items-center justify-between mt-1">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">PWA Status</p>
              <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                {isInstalled ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                    <span>Installed App</span>
                  </>
                ) : (
                  'Web Application'
                )}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
              <HardDrive className="w-6 h-6" />
            </div>
          </div>
          {!isInstalled && (
            <button
              onClick={() => setIsPwaModalOpen(true)}
              className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download App
            </button>
          )}
        </div>
      </div>

      {/* Recent Forms Card */}
      <Card
        title="Recently Saved Slips"
        subtitle="Quick access to latest generated courier addresses"
        headerAction={
          <Button variant="ghost" size="sm" onClick={() => onNavigate('saved-forms')}>
            View All Saved
          </Button>
        }
      >
        <RecentFormsList
          forms={metrics.recentForms}
          onView={(id) => onNavigate('preview', { id })}
          onEdit={(id) => onNavigate('new-form', { id })}
          onPrint={handleQuickPrint}
          onViewAll={() => onNavigate('saved-forms')}
        />
      </Card>

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />
    </div>
  );
};
