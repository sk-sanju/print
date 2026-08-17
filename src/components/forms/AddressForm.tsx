import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressFormSchema, AddressSchemaType } from '../../schemas/address.schema';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { AddressFormData } from '../../types/address.types';
import { User, Phone, Mail, Home, MapPin, Building, Globe, FileText, CheckCircle2, RotateCcw } from 'lucide-react';

interface AddressFormProps {
  initialValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  onFormChange?: (data: Partial<AddressFormData>) => void;
  onClear?: () => void;
  isEditing?: boolean;
  isLoading?: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  initialValues,
  onSubmit,
  onFormChange,
  onClear,
  isEditing = false,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<AddressSchemaType>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      customerName: initialValues?.customerName || '',
      mobileNumber: initialValues?.mobileNumber || '',
      alternateMobile: initialValues?.alternateMobile || '',
      email: initialValues?.email || '',
      houseName: initialValues?.houseName || '',
      houseNumber: initialValues?.houseNumber || '',
      street: initialValues?.street || '',
      locality: initialValues?.locality || '',
      landmark: initialValues?.landmark || '',
      city: initialValues?.city || '',
      district: initialValues?.district || '',
      state: initialValues?.state || '',
      pinCode: initialValues?.pinCode || '',
      country: initialValues?.country || 'India',
      remarks: initialValues?.remarks || '',
    },
  });

  // Watch form values for auto-saving drafts
  const formValues = watch();

  useEffect(() => {
    if (onFormChange && isDirty) {
      onFormChange(formValues);
    }
  }, [formValues, isDirty, onFormChange]);

  const handleClear = () => {
    reset({
      customerName: '',
      mobileNumber: '',
      alternateMobile: '',
      email: '',
      houseName: '',
      houseNumber: '',
      street: '',
      locality: '',
      landmark: '',
      city: '',
      district: '',
      state: '',
      pinCode: '',
      country: 'India',
      remarks: '',
    });
    if (onClear) onClear();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      {/* Section 1: Customer Information */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Customer Information</h3>
            <p className="text-xs text-slate-500">Recipient contact and identifying details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Customer Name"
            requiredAsterisk
            placeholder="e.g. John Thomas"
            error={errors.customerName?.message}
            icon={<User className="w-4 h-4" />}
            {...register('customerName')}
          />

          <Input
            label="Mobile Number"
            requiredAsterisk
            placeholder="10-digit mobile number (e.g. 9876543210)"
            maxLength={10}
            error={errors.mobileNumber?.message}
            icon={<Phone className="w-4 h-4" />}
            {...register('mobileNumber')}
          />

          <Input
            label="Alternate Mobile Number"
            placeholder="Optional 10-digit number"
            maxLength={10}
            error={errors.alternateMobile?.message}
            icon={<Phone className="w-4 h-4" />}
            {...register('alternateMobile')}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. customer@example.com"
            error={errors.email?.message}
            icon={<Mail className="w-4 h-4" />}
            {...register('email')}
          />
        </div>
      </div>

      {/* Section 2: Address Information */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Address Information</h3>
            <p className="text-xs text-slate-500">Delivery address details for shipment/printing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="House / Building Name"
            placeholder="e.g. ABC Villa / Sunshine Apartments"
            error={errors.houseName?.message}
            icon={<Home className="w-4 h-4" />}
            {...register('houseName')}
          />

          <Input
            label="House / Building Number"
            placeholder="e.g. Flat 3B / Door 14/2"
            error={errors.houseNumber?.message}
            icon={<Building className="w-4 h-4" />}
            {...register('houseNumber')}
          />

          <Input
            label="Street / Road"
            placeholder="e.g. Main Road / MG Road"
            error={errors.street?.message}
            icon={<MapPin className="w-4 h-4" />}
            {...register('street')}
          />

          <Input
            label="Area / Locality"
            placeholder="e.g. Gandhi Nagar"
            error={errors.locality?.message}
            icon={<MapPin className="w-4 h-4" />}
            {...register('locality')}
          />

          <Input
            label="Landmark"
            placeholder="e.g. Near Main Junction / Opposite City Mall"
            error={errors.landmark?.message}
            icon={<MapPin className="w-4 h-4" />}
            {...register('landmark')}
          />

          <Input
            label="City"
            placeholder="e.g. Thrissur / Kochi / Bengaluru"
            error={errors.city?.message}
            icon={<Building className="w-4 h-4" />}
            {...register('city')}
          />

          <Input
            label="District"
            placeholder="e.g. Thrissur"
            error={errors.district?.message}
            icon={<Building className="w-4 h-4" />}
            {...register('district')}
          />

          <Input
            label="State"
            placeholder="e.g. Kerala / Karnataka"
            error={errors.state?.message}
            icon={<Building className="w-4 h-4" />}
            {...register('state')}
          />

          <Input
            label="PIN Code"
            requiredAsterisk
            placeholder="6-digit PIN code (e.g. 680001)"
            maxLength={6}
            error={errors.pinCode?.message}
            icon={<MapPin className="w-4 h-4" />}
            {...register('pinCode')}
          />

          <Input
            label="Country"
            placeholder="Country"
            error={errors.country?.message}
            icon={<Globe className="w-4 h-4" />}
            {...register('country')}
          />
        </div>
      </div>

      {/* Section 3: Additional Information */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="p-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Additional Information</h3>
            <p className="text-xs text-slate-500">Special dispatch or delivery remarks</p>
          </div>
        </div>

        <Textarea
          label="Notes / Remarks"
          placeholder="e.g. Handle with care, Call before delivery"
          rows={3}
          error={errors.remarks?.message}
          {...register('remarks')}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 no-print">
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          icon={<RotateCcw className="w-4 h-4" />}
          className="justify-center"
        >
          Clear Form
        </Button>

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          isLoading={isLoading}
          icon={<CheckCircle2 className="w-5 h-5" />}
          className="justify-center shadow-md font-bold"
        >
          {isEditing ? 'Update & Preview' : 'Save Address & Preview'}
        </Button>
      </div>
    </form>
  );
};
