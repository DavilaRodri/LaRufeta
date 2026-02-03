"use server";

import { z } from "zod";
import { Resend } from "resend";

// Rate limiting storage (in-memory for simple implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Validation schema
const reservationSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z.string().min(9, "Introduce un número de teléfono válido"),
  email: z.string().email("Introduce un email válido").optional().or(z.literal("")),
  date: z.string().min(1, "La fecha es obligatoria"),
  time: z.string().min(1, "La hora es obligatoria"),
  partySize: z.number().min(1, "Mínimo 1 persona").max(20, "Máximo 20 personas"),
  notes: z.string().optional(),
  // Honeypot field
  website: z.string().max(0, ""),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

interface ActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

export async function submitReservation(formData: ReservationFormData): Promise<ActionResult> {
  try {
    // Validate data
    const validatedData = reservationSchema.safeParse(formData);
    
    if (!validatedData.success) {
      return {
        success: false,
        message: "Por favor, corrige los errores del formulario",
        errors: validatedData.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const data = validatedData.data;

    // Check honeypot
    if (data.website && data.website.length > 0) {
      // Silently reject spam
      return {
        success: true,
        message: "Solicitud recibida",
      };
    }

    // Rate limiting by phone number
    const isAllowed = checkRateLimit(data.phone);
    if (!isAllowed) {
      return {
        success: false,
        message: "Has enviado demasiadas solicitudes. Por favor, inténtalo más tarde.",
      };
    }

    // Prepare email content
    const businessEmail = process.env.RESTAURANT_BOOKINGS_EMAIL;
    const resendApiKey = process.env.RESEND_API_KEY;

    const emailContent = {
      subject: `Nueva solicitud de reserva - ${data.name}`,
      toRestaurant: `
NUEVA SOLICITUD DE RESERVA
===========================

Nombre: ${data.name}
Teléfono: ${data.phone}
Email: ${data.email || "No proporcionado"}

Fecha: ${data.date}
Hora: ${data.time}
Personas: ${data.partySize}

Notas: ${data.notes || "Ninguna"}

---
Recibido: ${new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}
      `,
      toCustomer: data.email ? `
Hola ${data.name},

Hemos recibido tu solicitud de reserva en La Rufeta:

📅 Fecha: ${data.date}
🕐 Hora: ${data.time}
👥 Personas: ${data.partySize}

Te contactaremos pronto para confirmar tu reserva.

Si tienes alguna pregunta, llámanos al +34 676 93 93 54 o escríbenos por WhatsApp.

¡Hasta pronto!
El equipo de La Rufeta

---
Av. del Camino de Santiago, 21
28050 Madrid (Las Tablas)
      ` : null,
    };

    // Send emails
    if (resendApiKey && businessEmail) {
      // Production mode
      const resend = new Resend(resendApiKey);
      
      // Send to restaurant
      await resend.emails.send({
        from: "La Rufeta Web <noreply@resend.dev>",
        to: businessEmail,
        subject: emailContent.subject,
        text: emailContent.toRestaurant,
      });

      // Send confirmation to customer if email provided
      if (data.email && emailContent.toCustomer) {
        await resend.emails.send({
          from: "La Rufeta <noreply@resend.dev>",
          to: data.email,
          subject: "Solicitud de reserva recibida - La Rufeta",
          text: emailContent.toCustomer,
        });
      }
    } else {
      // Dev mode - log to console
      console.log("=== DEV MODE: Email would be sent ===");
      console.log("To:", businessEmail || "RESTAURANT_BOOKINGS_EMAIL not set");
      console.log("Subject:", emailContent.subject);
      console.log("Content:", emailContent.toRestaurant);
      if (emailContent.toCustomer) {
        console.log("\n--- Customer confirmation ---");
        console.log("To:", data.email);
        console.log("Content:", emailContent.toCustomer);
      }
      console.log("===============================");
    }

    return {
      success: true,
      message: "¡Solicitud enviada! Te contactaremos pronto para confirmar tu reserva.",
    };
  } catch (error) {
    console.error("Error processing reservation:", error);
    return {
      success: false,
      message: "Ha ocurrido un error. Por favor, inténtalo de nuevo o contacta con nosotros directamente.",
    };
  }
}
