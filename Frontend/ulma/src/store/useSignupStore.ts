import {create} from 'zustand';
import axiosInstance from '@/api/axios';

interface SignupData {
  name: string;
  loginId: string;
  password: string;
  passwordConfirm: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  genderDigit: string;
}

interface SignupStore {
  signupData: SignupData;
  setSignupData: (data: Partial<SignupData>) => void;
  isPhoneVerified: boolean;
  setPhoneVerified: (verified: boolean) => void;
  resetSignupData: () => void;
  submitSignup: () => Promise<void>;
}

const initialSignupData: SignupData = {
  name: '',
  loginId: '',
  password: '',
  passwordConfirm: '',
  email: '',
  phoneNumber: '',
  birthDate: '',
  genderDigit: '',
};

const useSignupStore = create<SignupStore>((set) => ({
  signupData: initialSignupData,
  setSignupData: (data) =>
    set((state) => ({signupData: {...state.signupData, ...data}})),
  isPhoneVerified: false,
  setPhoneVerified: (verified) => set({isPhoneVerified: verified}),
  resetSignupData: () => set({signupData: initialSignupData, isPhoneVerified: false}),
  submitSignup: async () => {
    const {signupData} = useSignupStore.getState();
    console.log(signupData)
    try {
      await axiosInstance.post('/auth/join', signupData);
      useSignupStore.getState().resetSignupData();
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  },
}));

export default useSignupStore;