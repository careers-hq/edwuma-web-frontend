'use client';

import { Toaster } from 'react-hot-toast';

const ToastProvider = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      className: 'text-sm md:text-base',
      duration: 4000,
    }}
  />
);

export default ToastProvider;

