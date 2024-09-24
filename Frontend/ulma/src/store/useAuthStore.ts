import create from 'zustand';

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

interface AuthStore {
  signupData: SignupData;
  setSignupData: (data: Partial<SignupData>) => void;
  isPhoneVerified: boolean;
  setPhoneVerified: (verified: boolean) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  signupData: {
    name: '',
    loginId: '',
    password: '',
    passwordConfirm: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    genderDigit: '',
  },
  setSignupData: (data) => set((state) => ({ signupData: { ...state.signupData, ...data } })),
  isPhoneVerified: false,
  setPhoneVerified: (verified) => set({ isPhoneVerified: verified }),
}));

export default useAuthStore;