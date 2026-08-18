import React, { useEffect, useState, useCallback } from 'react';
import { FormService } from '../../services/form.service';
import { AddressRecord, PaginatedResult } from '../../types/address.types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../utils/date.utils';
import { Search, Eye, Edit2, Printer, Trash2, ArrowLeft, PlusCircle, AlertTriangle, ChevronLeft, ChevronRight, CheckSquare, Square, Layers, Share2 } from 'lucide-react';
import { ShareModal } from '../../components/share/ShareModal';

interface SavedFormsProps {
  onNavigate: (route: string, params?: Record<string, any>) => void;
}

export const SavedForms: React.FC<SavedFormsProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'customerName'>('newest');
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [result, setResult] = useState<PaginatedResult<AddressRecord>>({
    data: [],
    total: 0,
    page: 1,
    limit,
    totalPages: 1,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Bulk Selection state
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Delete modal state
  const [deletingRecord, setDeletingRecord] = useState<AddressRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Share modal state
  const [sharingRecord, setSharingRecord] = useState<AddressRecord | null>(null);

  const fetchForms = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await FormService.searchForms({
        searchQuery,
        sortBy,
        page,
        limit,
      });
      setResult(res);
    } catch (err) {
      console.error('Error fetching saved forms:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, sortBy, page]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
    setSelectedIds([]);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as any);
    setPage(1);
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === result.data.length && result.data.length > 0) {
      setSelectedIds([]);
    } else {
      const allIds = result.data.map((r) => r.id!).filter(Boolean);
      setSelectedIds(allIds);
    }
  };

  const toggleSelectRecord = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkPrint = () => {
    if (selectedIds.length === 0) return;
    onNavigate('bulk-print', { ids: selectedIds });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRecord || !deletingRecord.id) return;
    try {
      setIsDeleting(true);
      await FormService.deleteForm(deletingRecord.id);
      setDeletingRecord(null);
      setSelectedIds((prev) => prev.filter((id) => id !== deletingRecord.id));
      await fetchForms();
    } catch (err) {
      console.error('Failed to delete record:', err);
      alert('Failed to delete the form. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const isAllSelected = result.data.length > 0 && selectedIds.length === result.data.length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('dashboard')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Dashboard
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Saved Forms</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Search, bulk print, edit, or remove customer address records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="primary"
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={() => onNavigate('new-form')}
            className="w-full sm:w-auto justify-center"
          >
            + New Address
          </Button>
        </div>
      </div>

      {/* Filter, Search, and Bulk Selection Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by ref, name, mobile, city, PIN..."
            value={searchQuery}
            onChange={handleSearchChange}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <label htmlFor="sort-by" className="text-xs font-semibold uppercase text-slate-500 whitespace-nowrap">
            Sort By:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={handleSortChange}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 w-full sm:w-auto"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="customerName">Customer Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Bulk Print Action Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-600 text-white p-3.5 px-5 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in no-print">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Layers className="w-5 h-5 text-indigo-200" />
            <span>{selectedIds.length} Address Label(s) Selected for Bulk Stack Printing</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds([])}
              className="bg-indigo-700 text-indigo-100 border-indigo-500 hover:bg-indigo-800"
            >
              Clear Selection
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleBulkPrint}
              icon={<Printer className="w-4 h-4" />}
              className="bg-white text-indigo-900 hover:bg-slate-100 font-bold shadow-md"
            >
              Bulk Print Stack ({selectedIds.length})
            </Button>
          </div>
        </div>
      )}

      {/* Data Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm">Searching records...</p>
          </div>
        ) : result.data.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-slate-700 font-semibold text-sm sm:text-base">No address records found.</p>
            <p className="text-slate-500 text-xs mt-1">
              {searchQuery ? 'Try clearing your search filters.' : 'Click "+ New Address" to add one.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View (sm & up) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <button
                        onClick={toggleSelectAll}
                        className="text-slate-500 hover:text-slate-800 p-1"
                        title={isAllSelected ? 'Deselect All' : 'Select All'}
                      >
                        {isAllSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3">Reference No</th>
                    <th className="px-4 py-3">Customer Name</th>
                    <th className="px-4 py-3">Mobile Number</th>
                    <th className="px-4 py-3">City & PIN</th>
                    <th className="px-4 py-3">Saved Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {result.data.map((record) => {
                    const isSelected = selectedIds.includes(record.id!);
                    return (
                      <tr
                        key={record.id}
                        className={`transition-colors ${
                          isSelected ? 'bg-indigo-50/60' : 'hover:bg-slate-50/90'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleSelectRecord(record.id!)}
                            className="p-1"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                          <Badge variant="indigo">{record.referenceNumber}</Badge>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900">{record.customerName}</td>
                        <td className="px-4 py-3 font-mono text-slate-600">{record.mobileNumber}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {record.city ? `${record.city} (${record.pinCode})` : record.pinCode}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                          {formatDate(record.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onNavigate('preview', { id: record.id })}
                              icon={<Eye className="w-3.5 h-3.5" />}
                              title="Preview"
                            >
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onNavigate('new-form', { id: record.id })}
                              icon={<Edit2 className="w-3.5 h-3.5" />}
                              title="Edit"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSharingRecord(record)}
                              icon={<Share2 className="w-3.5 h-3.5" />}
                              title="Share"
                            >
                              Share
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => onNavigate('preview', { id: record.id, autoPrint: true })}
                              icon={<Printer className="w-3.5 h-3.5" />}
                            >
                              Print
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingRecord(record)}
                              icon={<Trash2 className="w-3.5 h-3.5" />}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              title="Delete"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Touch Cards View (below sm) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {result.data.map((record) => {
                const isSelected = selectedIds.includes(record.id!);
                return (
                  <div
                    key={record.id}
                    className={`p-4 space-y-3 ${isSelected ? 'bg-indigo-50/40' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSelectRecord(record.id!)}
                          className="p-1"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        <Badge variant="indigo">{record.referenceNumber}</Badge>
                      </div>
                      <span className="text-xs text-slate-400">{formatDate(record.createdAt)}</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{record.customerName}</h4>
                      <p className="text-xs text-slate-600 font-mono mt-0.5">Mobile: {record.mobileNumber}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {record.city ? `${record.city} – ${record.pinCode}` : record.pinCode}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate('preview', { id: record.id })}
                        icon={<Eye className="w-3.5 h-3.5" />}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate('new-form', { id: record.id })}
                        icon={<Edit2 className="w-3.5 h-3.5" />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSharingRecord(record)}
                        icon={<Share2 className="w-3.5 h-3.5" />}
                      >
                        Share
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onNavigate('preview', { id: record.id, autoPrint: true })}
                        icon={<Printer className="w-3.5 h-3.5" />}
                      >
                        Print
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingRecord(record)}
                        icon={<Trash2 className="w-3.5 h-3.5" />}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination Footer */}
        {result.totalPages > 1 && (
          <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between flex-col sm:flex-row gap-3">
            <span className="text-xs text-slate-500 text-center sm:text-left">
              Showing Page <strong>{result.page}</strong> of <strong>{result.totalPages}</strong> ({result.total} items)
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                icon={<ChevronLeft className="w-4 h-4" />}
                className="flex-1 sm:flex-none justify-center"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))}
                disabled={page === result.totalPages}
                icon={<ChevronRight className="w-4 h-4" />}
                className="flex-1 sm:flex-none justify-center"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingRecord}
        onClose={() => setDeletingRecord(null)}
        title="Delete Address Form?"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeletingRecord(null)} className="w-full sm:w-auto justify-center">
              Cancel
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDeleteConfirm} className="w-full sm:w-auto justify-center">
              Delete
            </Button>
          </>
        }
      >
        {deletingRecord && (
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900">This action cannot be undone.</p>
                <p className="text-xs text-red-700 mt-0.5">
                  Are you sure you want to permanently delete this address record from local storage?
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-md border border-slate-200 font-mono text-xs">
              <div className="font-bold text-slate-900">{deletingRecord.referenceNumber}</div>
              <div className="text-slate-700">{deletingRecord.customerName}</div>
              <div className="text-slate-500">{deletingRecord.mobileNumber}</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Share Modal */}
      <ShareModal
        isOpen={Boolean(sharingRecord)}
        onClose={() => setSharingRecord(null)}
        record={sharingRecord}
      />
    </div>
  );
};
