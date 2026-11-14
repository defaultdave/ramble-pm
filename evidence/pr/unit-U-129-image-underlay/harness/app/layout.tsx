// U-129 measurement harness. Copied into src/app/(measure)/ by install.sh, never committed.
import type { ReactNode } from 'react';
import '@/styles/base.css';
import '@/styles/tokens.css';
import '@/styles/forced-colors.css';
import { fontVariables } from '@/app/fonts';

export default function MeasureLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
