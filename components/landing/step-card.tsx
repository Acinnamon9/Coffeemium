"use client";

import React, { useEffect, useRef, useState } from "react";
import { HowItWorksStep } from "@/lib/how-it-works-data";
import { cn } from "@/lib/utils";

interface StepCardProps {
  step: HowItWorksStep;
  className?: string;
}

export const StepCard = ({ step, className }: StepCardProps) => {
  const titleId = `howitworks-title-${step.id}`;
  const descId = `howitworks-desc-${step.id}`;

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }

    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Move focus into modal when opening, restore to trigger when closing
  useEffect(() => {
    if (open) {
      // small timeout to ensure rendering
      setTimeout(() => modalRef.current?.focus(), 0);
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  // Focus trap: keep Tab navigation within the modal while open
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const modal = modalRef.current;
      if (!modal) return;

      const focusable = modal.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input[type], select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // reverse tab
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // forward tab
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal();
    }
  };

  return (
    <>
      <article
        ref={(el) => {
          triggerRef.current = el;
        }}
        role="button"
        aria-haspopup="dialog"
        aria-controls={`howitworks-dialog-${step.id}`}
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={0}
        onClick={openModal}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "bg-white rounded-xl overflow-hidden group hover:shadow-lg transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 cursor-pointer",
          className
        )}
      >
        <div className="w-full aspect-4/3 relative bg-neutral-50 overflow-hidden">
          <img
            src={step.image}
            alt={step.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="py-6 px-5 text-center">
          <h3 id={titleId} className="text-2xl font-medium text-gray-900 mb-2">
            {step.id}. {step.title}
          </h3>
          <p
            id={descId}
            className="text-gray-700 text-sm leading-relaxed max-w-prose mx-auto"
          >
            {step.description}
          </p>
        </div>
      </article>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop: click to close; also applies a backdrop blur to the entire page */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
            aria-hidden
          />

          <div
            id={`howitworks-dialog-${step.id}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            ref={(el) => {
              modalRef.current = el;
            }}
            tabIndex={-1}
            className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-auto bg-white rounded-xl shadow-xl ring-1 ring-black/10"
          >
            {/* Close button: absolute overlay in top-right */}
            <button
              onClick={closeModal}
              aria-label="Close dialog"
              className="absolute top-4 right-4 z-20 rounded-full p-2 bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="p-6 md:p-8 lg:p-10">
              <header className="text-center mb-6">
                <h3
                  id={titleId}
                  className="text-2xl md:text-3xl font-semibold text-gray-900"
                >
                  {step.id}. {step.title}
                </h3>
                <p
                  id={descId}
                  className="text-gray-700 mt-2 max-w-prose mx-auto"
                >
                  {step.description}
                </p>
              </header>

              <div className="w-full bg-neutral-50 rounded-lg overflow-hidden">
                <img
                  src={step.image}
                  alt={step.title}
                  className="object-cover w-full h-64 sm:h-80 md:h-[420px] rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
