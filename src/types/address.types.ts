export interface AddressFormData {
  customerName: string;
  mobileNumber: string;
  alternateMobile?: string;
  email?: string;
  houseName?: string;
  houseNumber?: string;
  street?: string;
  locality?: string;
  landmark?: string;
  city?: string;
  district?: string;
  state?: string;
  pinCode: string;
  country: string;
  remarks?: string;
}

export interface AddressRecord extends AddressFormData {
  id?: number;
  referenceNumber: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface DailyCounter {
  dateKey: string; // YYYYMMDD
  lastSeq: number;
}

export interface FromAddress {
  name: string;
  mobileNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface FormFilterOptions {
  searchQuery?: string;
  sortBy?: 'newest' | 'oldest' | 'customerName';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
