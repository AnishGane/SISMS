export type ImageValue = string | File | null;

export interface Staff {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  avatar: string;
}

export interface StaffForm {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatar: ImageValue;
}

export const emptyForm: StaffForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  avatar: null,
};
