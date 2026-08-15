import { z } from "zod";

export const participantSchema = z.object({
  fullName: z
    .string({ message: "El nombre y apellido es obligatorio." })
    .trim()
    .min(2, "Escribe tu nombre y apellido completo.")
    .max(120, "Tu nombre y apellido es demasiado largo."),
  email: z
    .string({ message: "El correo electrónico es obligatorio." })
    .trim()
    .email("Ingresa un correo electrónico válido."),
  phone: z
    .string({ message: "El celular es obligatorio." })
    .trim()
    .min(7, "Ingresa un número de celular válido.")
    .max(25, "El celular es demasiado largo.")
    .refine(
      (value) => {
        // Permitimos +54, espacios, guiones, paréntesis, etc.
        const digits = value.replace(/\D/g, "");

        // Un teléfono válido debe tener entre 10 y 15 dígitos.
        return digits.length >= 10 && digits.length <= 15;
      },
      {
        message: "Ingresa un número de celular válido.",
      },
    ),
  address: z
    .string({ message: "La dirección es obligatoria." })
    .trim()
    .min(5, "Ingresa una dirección válida.")
    .max(200, "La dirección es demasiado larga."),
  birthDate: z
    .string({ message: "La fecha de nacimiento es obligatoria." })
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ingresa una fecha de nacimiento válida.")
    .refine((value) => {
      const [year, month, day] = value.split("-").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));

      return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
      );
    }, "Ingresa una fecha de nacimiento válida.")
    .refine((value) => {
      const [year, month, day] = value.split("-").map(Number);
      const birthDate = new Date(Date.UTC(year, month - 1, day));
      const today = new Date();

      let age = today.getUTCFullYear() - birthDate.getUTCFullYear();

      const birthdayNotReached =
        today.getUTCMonth() < birthDate.getUTCMonth() ||
        (today.getUTCMonth() === birthDate.getUTCMonth() &&
          today.getUTCDate() < birthDate.getUTCDate());

      if (birthdayNotReached) {
        age--;
      }

      return age >= 18 && age <= 100;
    }, "Ingresa una fecha de nacimiento válida."),
});

export type ParticipantFormValues = z.infer<typeof participantSchema>;
