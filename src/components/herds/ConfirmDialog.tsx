import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/@/components/ui/dialog";
import { Button } from "~/@/components/ui/button";
import Image from "next/image";
import { createRoot } from "react-dom/client";

type ConfirmDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: React.ReactNode;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-neutral-700 bg-neutral-900 text-white">
        <DialogHeader>
          <DialogTitle className="pb-4 font-clayno">{title}</DialogTitle>
          <DialogDescription className="text-neutral-300">
            {message}
            <div className="mb-4 mt-4 rounded-md bg-yellow-900/20 p-3 text-yellow-500">
              ⚠️ Warning: Reassigning core species may break your existing herd.
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to show the dialog programmatically
export function showConfirmDialog(
  props: Omit<ConfirmDialogProps, "isOpen" | "onOpenChange">
): Promise<boolean> {
  return new Promise((resolve) => {
    const handleConfirm = () => {
      props.onConfirm();
      resolve(true);
    };

    const handleCancel = () => {
      props.onCancel();
      resolve(false);
    };

    const dialogProps = {
      ...props,
      isOpen: true,
      onOpenChange: (open: boolean) => {
        if (!open) handleCancel();
      },
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    };

    const dialog = document.createElement("div");
    document.body.appendChild(dialog);

    const cleanup = () => {
      document.body.removeChild(dialog);
    };

    const root = createRoot(dialog);
    root.render(<ConfirmDialog {...dialogProps} />);

    // Cleanup when the dialog is closed
    const originalOnCancel = props.onCancel;
    props.onCancel = () => {
      cleanup();
      originalOnCancel?.();
    };

    const originalOnConfirm = props.onConfirm;
    props.onConfirm = () => {
      cleanup();
      originalOnConfirm?.();
    };
  });
}
