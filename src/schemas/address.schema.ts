import { z } from 'zod';

const mobileRegex = /^[6-9]\d{9}$/;
const pinCodeRegex = /^\d{6}$/;

export const addressFormSchema = z.object({
  customerName: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z.string()
        .min(1, { message: 'Customer name is required.' })
        .min(2, { message: 'Customer name must be at least 2 characters.' })
        .max(100, { message: 'Customer name cannot exceed 100 characters.' })
    ),
  mobileNumber: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z.string()
        .min(1, { message: 'Mobile number is required.' })
        .regex(mobileRegex, { message: 'Please enter a valid 10-digit mobile number.' })
    ),
  alternateMobile: z
    .string()
    .transform((val) => val.trim())
    .optional()
    .refine((val) => !val || mobileRegex.test(val), {
      message: 'Please enter a valid 10-digit alternate mobile number.',
    }),
  email: z
    .string()
    .transform((val) => val.trim())
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: 'Please enter a valid email address.',
    }),
  houseName: z
    .string()
    .transform((val) => val.trim())
    .optional()
    .pipe(z.string().max(100, { message: 'Cannot exceed 100 characters.' })),
  houseNumber: z
    .string()
    .transform((val) => val.trim())
    .optional()
    .pipe(z.string().max(50, { message: 'Cannot exceed 50 characters.' })),
  street: z
    .string()
    .transform((val) => val.trim())
    .optional()
    .pipe(z.string().max(100, { message: 'Cannot exceed 100 characters.' })),
  locality: z
    .string()
    .transform((val) => val.trim())
    .optional()
    .pipe(z.string().max(100, { message: 'Cannot exceed 100 characters.' })),
  landmark: z
    .string()
    .transform((val) => val.trim())
    .optional()
    .pipe(z.string().max(100, { message: 'Cannot exceed 100 characters.' })),
  city: z
    .string()
    .transform((val) => val.trim())
    .optional()
    .pipe(z.string().max(100, { message: 'Cannot exceed 100 characters.' })),
  district: z
    .string()
    .transform((val) => val.trim())
    .optional()
    .pipe(z.string().max(100, { message: 'Cannot exceed 100 characters.' })),
  state: z
    .string()
    .transform((val) => val.trim())
    .optional()
    .pipe(z.string().max(100, { message: 'Cannot exceed 100 characters.' })),
  pinCode: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z.string()
        .min(1, { message: 'PIN code is required.' })
        .regex(pinCodeRegex, { message: 'Please enter a valid 6-digit PIN code.' })
    ),
  country: z
    .string()
    .transform((val) => val.trim() || 'India')
    .pipe(z.string().max(100, { message: 'Cannot exceed 100 characters.' })),
  remarks: z
    .string()
    .transform((val) => val.trim())
    .optional()
    .pipe(z.string().max(500, { message: 'Remarks cannot exceed 500 characters.' })),
});

export type AddressSchemaType = z.infer<typeof addressFormSchema>;
