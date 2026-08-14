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
    .max(20, "El celular es demasiado largo."),
  address: z
    .string({ message: "La dirección es obligatoria." })
    .trim()
    .min(5, "Ingresa una dirección válida.")
    .max(200, "La dirección es demasiado larga."),
  birthDate: z
    .string({ message: "La fecha de nacimiento es obligatoria." })
    .trim()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Ingresa una fecha de nacimiento válida.",
    }),
});

export type ParticipantFormValues = z.infer<typeof participantSchema>;
