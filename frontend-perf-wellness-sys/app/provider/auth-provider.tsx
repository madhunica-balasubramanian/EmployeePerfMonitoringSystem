// app/providers/auth-provider.tsx
"use client";

import React, { ReactNode } from 'react';
import { AuthProvider as OriginalAuthProvider } from '../contexts/AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  return <OriginalAuthProvider>{children}</OriginalAuthProvider>;
}
