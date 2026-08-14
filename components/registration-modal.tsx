"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  participantSchema,
  type ParticipantFormValues,
} from "@/features/participants/participant-schema";

const defaultValues: ParticipantFormValues = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  birthDate: "",
};

function RegistrationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
    getValues,
  } = useForm<ParticipantFormValues>({
    resolver: zodResolver(participantSchema),
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    const handleOpenTrigger = (event: MouseEvent) => {
      const trigger = (event.target as HTMLElement | null)?.closest(
        "[data-registration-trigger='true']",
      );

      if (!trigger) {
        return;
      }

      if (!isOpen) {
        setSubmitError(null);
        clearErrors();
      }

      setIsSuccess(false);
      setIsOpen(true);
    };

    document.addEventListener("click", handleOpenTrigger);

    return () => document.removeEventListener("click", handleOpenTrigger);
  }, [clearErrors, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const fieldLabels = useMemo(
    () => ({
      fullName: "Nombre y apellido",
      email: "Correo electrónico",
      phone: "Celular",
      address: "Dirección",
      birthDate: "Fecha de nacimiento",
    }),
    [],
  );

  async function onSubmit(values: ParticipantFormValues) {
    setSubmitError(null);
    clearErrors();

    try {
      const response = await fetch("/api/participants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        const errorMessage =
          payload?.message || "No pudimos registrar tu inscripción. Intenta nuevamente.";
        setSubmitError(errorMessage);

        if (errorMessage.includes("correo electrónico")) {
          setError("email", {
            type: "server",
            message: errorMessage,
          });
        }

        return;
      }

      reset(values);
      setIsSuccess(true);
    } catch {
      setSubmitError("No pudimos registrar tu inscripción. Intenta nuevamente.");
    }
  }

  function closeModal() {
    setIsOpen(false);
    setSubmitError(null);
    setIsSuccess(false);
    clearErrors();
    reset(defaultValues);
  }

  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071522]/80 p-4 backdrop-blur-sm">
          <div
            aria-modal="true"
            aria-labelledby="registration-modal-title"
            className="border-border bg-background relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border p-5 shadow-2xl shadow-[#071522]/70 sm:p-7"
            role="dialog"
          >
            <button
              aria-label="Cerrar formulario de inscripción"
              className="text-muted-foreground hover:text-foreground absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent transition-colors hover:border-border hover:bg-card"
              onClick={closeModal}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>

            {!isSuccess ? (
              <>
                <div className="pr-10">
                  <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
                    Inscripción
                  </p>
                  <h2
                    id="registration-modal-title"
                    className="text-foreground mt-3 text-3xl font-semibold tracking-tight"
                  >
                    Reservá tu lugar
                  </h2>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  {Object.entries(fieldLabels).map(([key, label]) => {
                    const fieldKey = key as keyof ParticipantFormValues;
                    const error = errors[fieldKey]?.message?.toString();
                    const isDateField = fieldKey === "birthDate";

                    return (
                      <div key={key} className="space-y-2">
                        <label className="text-foreground block text-sm font-medium" htmlFor={key}>
                          {label}
                        </label>
                        <input
                          {...register(fieldKey)}
                          aria-invalid={Boolean(error)}
                          autoComplete={
                            fieldKey === "email"
                              ? "email"
                              : fieldKey === "fullName"
                                ? "name"
                                : fieldKey === "phone"
                                  ? "tel"
                                  : fieldKey === "address"
                                    ? "street-address"
                                    : "bday"
                          }
                          className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary w-full rounded-2xl border px-4 py-3 text-base outline-none transition focus:ring-2 focus:ring-[#39d5c7]/20"
                          defaultValue={getValues(fieldKey)}
                          id={key}
                          placeholder={
                            isDateField ? "dd/mm/aaaa" : "Escribe aquí..."
                          }
                          type={isDateField ? "date" : key === "email" ? "email" : "text"}
                        />
                        {error ? (
                          <p className="text-sm text-red-400">{error}</p>
                        ) : null}
                      </div>
                    );
                  })}

                  {submitError ? (
                    <div className="border-red-500/30 bg-red-500/5 text-red-200 rounded-2xl border px-4 py-3 text-sm">
                      {submitError}
                    </div>
                  ) : null}

                  <div className="pt-2">
                    <Button
                      className="w-full"
                      disabled={isSubmitting}
                      type="submit"
                    >
                      {isSubmitting ? "Enviando..." : "Inscribirme"}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="py-5 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-3xl">
                  ✓
                </div>
                <h2 className="text-foreground text-3xl font-semibold tracking-tight">
                  ¡Listo! Recibimos tus datos.
                </h2>
                <p className="text-muted-foreground mt-4 text-base leading-7">
                  Tu inscripción fue registrada correctamente. Nos pondremos en
                  contacto para confirmar tu lugar.
                </p>
                <div className="mt-8">
                  <Button onClick={closeModal} type="button">
                    Cerrar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

export { RegistrationModal };
