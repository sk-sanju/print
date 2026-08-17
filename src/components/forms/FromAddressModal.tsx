import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FromAddress } from '../../types/address.types';
import { FromAddressService } from '../../services/fromAddress.service';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { User, Phone, MapPin, Building, Save } from 'lucide-react';

const fromAddressSchema = z.object({
  name: z.string().min(1, 'Sender Name / Company Name is required.').max(100),
  mobileNumber: z
    .string()
    .min(1, 'Mobile Number is required.')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number.'),
  addressLine1: z.string().min(1, 'Address Line 1 is required.').max(150),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required.').max(100),
  state: z.string().min(1, 'State is required.').max(100),
  pinCode: z
    .string()
    .min(1, 'PIN Code is required.')
    .regex(/^\d{6}$/, 'Please enter a valid 6-digit PIN code.'),
});

type FromAddressSchemaType = z.infer<typeof fromAddressSchema>;

interface FromAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (address: FromAddress) => void;
}

export const FromAddressModal: React.FC<FromAddressModalProps> = ({ isOpen, onClose, onSaved }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FromAddressSchemaType>({
    resolver: zodResolver(fromAddressSchema),
  });

  useEffect(() => {
    if (isOpen) {
      const existing = FromAddressService.getFromAddress();
      if (existing) {
        reset(existing);
      } else {
        reset({
          name: '',
          mobileNumber: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          pinCode: '',
        });
      }
    }
  }, [isOpen, reset]);

  const onSubmit = (data: FromAddressSchemaType) => {
    FromAddressService.saveFromAddress(data);
    if (onSaved) onSaved(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sender (From) Address Settings"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            icon={<Save className="w-4 h-4" />}
          >
            Save From Address
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-xs text-slate-500 mb-2">
          This address will be saved as your default <strong>FROM / SENDER ADDRESS</strong> on all printed courier slips.
        </p>

        <Input
          label="Sender / Company Name"
          requiredAsterisk
          placeholder="e.g. Rahul Varma / Acme Traders"
          error={errors.name?.message}
          icon={<User className="w-4 h-4" />}
          {...register('name')}
        />

        <Input
          label="Mobile Number"
          requiredAsterisk
          placeholder="10-digit mobile number"
          maxLength={10}
          error={errors.mobileNumber?.message}
          icon={<Phone className="w-4 h-4" />}
          {...register('mobileNumber')}
        />

        <Input
          label="Address Line 1"
          requiredAsterisk
          placeholder="e.g. Flat No. 304, Sai Residency Apartments"
          error={errors.addressLine1?.message}
          icon={<MapPin className="w-4 h-4" />}
          {...register('addressLine1')}
        />

        <Input
          label="Address Line 2 (Landmark/Area)"
          placeholder="e.g. Near HDFC Bank, Madhapur Main Road"
          error={errors.addressLine2?.message}
          icon={<MapPin className="w-4 h-4" />}
          {...register('addressLine2')}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="City"
            requiredAsterisk
            placeholder="e.g. Hyderabad"
            error={errors.city?.message}
            icon={<Building className="w-4 h-4" />}
            {...register('city')}
          />

          <Input
            label="State"
            requiredAsterisk
            placeholder="e.g. Telangana"
            error={errors.state?.message}
            icon={<Building className="w-4 h-4" />}
            {...register('state')}
          />
        </div>

        <Input
          label="PIN Code"
          requiredAsterisk
          placeholder="6-digit PIN code"
          maxLength={6}
          error={errors.pinCode?.message}
          icon={<MapPin className="w-4 h-4" />}
          {...register('pinCode')}
        />
      </form>
    </Modal>
  );
};
