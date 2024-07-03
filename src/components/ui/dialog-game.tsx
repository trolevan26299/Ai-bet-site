"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { HTMLMotionProps, motion } from "framer-motion";
import * as React from "react";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

const DialogGame = DialogPrimitive.Root;

const DialogTriggerGame = DialogPrimitive.Trigger;

const DialogPortalGame = DialogPrimitive.Portal;

const DialogCloseGame = DialogPrimitive.Close;

const DialogOverlayGame = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  // <DialogClose>
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
  // </DialogClose>
));
DialogOverlayGame.displayName = DialogPrimitive.Overlay.displayName;
const DialogContentGame = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, children, ...props }, ref) => (
    <DialogPortalGame>
      <DialogOverlayGame />
      <motion.div
        ref={ref}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100vh" }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed bottom-0 left-0 z-50 grid w-full max-w-lg translate-x-[-0%] gap-4 bg-background p-6 px-2 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        {...props}
      >
        {children as ReactNode}
      </motion.div>
    </DialogPortalGame>
  )
);
DialogContentGame.displayName = DialogPrimitive.Content.displayName;

const DialogHeaderGame = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeaderGame.displayName = "DialogHeader";

const DialogFooterGame = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooterGame.displayName = "DialogFooter";

const DialogTitleGame = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(" pl-3 text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitleGame.displayName = DialogPrimitive.Title.displayName;

const DialogDescriptionGame = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescriptionGame.displayName = DialogPrimitive.Description.displayName;

export {
  DialogGame,
  DialogCloseGame,
  DialogContentGame,
  DialogDescriptionGame,
  DialogFooterGame,
  DialogHeaderGame,
  DialogOverlayGame,
  DialogPortalGame,
  DialogTitleGame,
  DialogTriggerGame,
};
