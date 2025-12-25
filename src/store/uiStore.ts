import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
  
  // Navigation
  isDeepDiveOpen: boolean;
  openDeepDive: () => void;
  closeDeepDive: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Theme
  theme: 'system',
  setTheme: (theme) => set({ theme }),
  
  // Toasts
  toasts: [],
  showToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  
  // Navigation
  isDeepDiveOpen: false,
  openDeepDive: () => set({ isDeepDiveOpen: true }),
  closeDeepDive: () => set({ isDeepDiveOpen: false }),
}));
