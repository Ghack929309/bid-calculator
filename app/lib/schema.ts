import { z } from "zod";

export const phoneRegex =
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;

export const contactSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(phoneRegex, "Please enter a valid phone number"),
});

export const userRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(phoneRegex, "Please enter a valid phone number"),
  fields: z.record(z.any()),
  sectionId: z.string(),
});
