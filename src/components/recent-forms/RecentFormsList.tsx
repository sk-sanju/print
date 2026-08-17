import React from 'react';
import { AddressRecord } from '../../types/address.types';
import { formatDate } from '../../utils/date.utils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Eye, Printer, Edit2 } from 'lucide-react';

interface RecentFormsListProps {
  forms: AddressRecord[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onPrint: (record: AddressRecord) => void;
  onViewAll?: () => void;
}

export const RecentFormsList: React.FC<RecentFormsListProps> = ({
  forms,
  onView,
  onEdit,
  onPrint,
  onViewAll,
}) => {
  if (forms.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
        <p className="text-sm font-semibold text-slate-700">No address forms saved yet.</p>
        <p className="text-xs text-slate-500 mt-1">Create your first address slip to populate this table.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop View */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-600 border-b border-slate-200 tracking-wider">
            <tr>
              <th className="px-4 py-3.5">Reference No</th>
              <th className="px-4 py-3.5">Customer Name</th>
              <th className="px-4 py-3.5">Mobile</th>
              <th className="px-4 py-3.5">City / PIN</th>
              <th className="px-4 py-3.5">Date</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {forms.map((form) => (
              <tr key={form.id} className="hover:bg-slate-50/90 transition-colors">
                <td className="px-4 py-3.5 font-mono font-semibold">
                  <Badge variant="indigo">{form.referenceNumber}</Badge>
                </td>
                <td className="px-4 py-3.5 font-bold text-slate-900">{form.customerName}</td>
                <td className="px-4 py-3.5 font-mono text-slate-700">{form.mobileNumber}</td>
                <td className="px-4 py-3.5 text-slate-700">
                  {form.city ? `${form.city} (${form.pinCode})` : form.pinCode}
                </td>
                <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                  {formatDate(form.createdAt)}
                </td>
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(form.id!)}
                      icon={<Eye className="w-3.5 h-3.5" />}
                      title="View Preview"
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(form.id!)}
                      icon={<Edit2 className="w-3.5 h-3.5" />}
                      title="Edit Form"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onPrint(form)}
                      icon={<Printer className="w-3.5 h-3.5" />}
                    >
                      Print
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="sm:hidden divide-y divide-slate-100">
        {forms.map((form) => (
          <div key={form.id} className="py-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="indigo">{form.referenceNumber}</Badge>
              <span className="text-xs text-slate-500">{formatDate(form.createdAt)}</span>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-base">{form.customerName}</p>
              <p className="text-xs text-slate-600 font-mono mt-0.5">Mobile: {form.mobileNumber}</p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => onView(form.id!)}>
                View
              </Button>
              <Button variant="primary" size="sm" onClick={() => onPrint(form)}>
                Print
              </Button>
            </div>
          </div>
        ))}
      </div>

      {onViewAll && (
        <div className="text-center pt-2">
          <Button variant="outline" size="sm" onClick={onViewAll}>
            View All Saved Forms
          </Button>
        </div>
      )}
    </div>
  );
};
