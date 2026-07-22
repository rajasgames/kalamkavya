import React, { ReactNode, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  children: ReactNode;
}

export const Drawer = ({ isOpen, onClose, width = '420px', children }: DrawerProps) => {
  useEffect(() => {
    const main = document.getElementById('main-content');
    if (main) {
      if (isOpen) {
        main.style.filter = 'blur(2px)';
      } else {
        main.style.filter = '';
      }
    }
  }, [isOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 z-40 data-[state=open]:animate-overlay-fade-in data-[state=closed]:animate-overlay-fade-out" />
        <Dialog.Content
          className="fixed right-0 top-0 bottom-0 z-50 flex flex-col bg-glass backdrop-blur-xl border-l border-subtle shadow-2xl focus:outline-none data-[state=open]:animate-drawer-in data-[state=closed]:animate-drawer-out"
          style={{ width, maxWidth: '100vw' }}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const DrawerHeader = ({ title, children }: { title?: string; children?: ReactNode }) => (
  <div className="flex items-center justify-between p-6 border-b border-subtle">
    {title && (
      <Dialog.Title className="text-xl font-serif font-bold text-primary">{title}</Dialog.Title>
    )}
    <div className="flex-1">{children}</div>
    <Dialog.Close asChild>
      <button
        className="text-ghost hover:text-primary transition-colors focus:outline-none ml-4"
        aria-label="Close"
      >
        <X size={20} />
      </button>
    </Dialog.Close>
  </div>
);

export const DrawerBody = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => <div className={`flex-1 overflow-y-auto p-6 ${className}`}>{children}</div>;

export const DrawerFooter = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => <div className={`p-6 border-t border-subtle ${className}`}>{children}</div>;

Drawer.Header = DrawerHeader;
Drawer.Body = DrawerBody;
Drawer.Footer = DrawerFooter;

// eslint-disable-next-line react-refresh/only-export-components
export function useDrawer() {
  const [isOpen, setIsOpen] = React.useState(false);
  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  return { isOpen, open, close };
}
