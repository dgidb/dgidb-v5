declare module 'react-copy-to-clipboard' {
  import { ComponentType, ReactNode } from 'react';

  interface CopyToClipboardProps {
    children: ReactNode;
    onCopy?: (text: string, result: boolean) => void;
    options?: Record<string, unknown>;
    text: string;
  }

  const CopyToClipboard: ComponentType<CopyToClipboardProps>;
  export default CopyToClipboard;
}
