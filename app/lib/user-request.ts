import { z } from "zod";
import { contactSchema } from "./schema";

export const FieldValueSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("number"),
    value: z.number(),
    fieldId: z.string(),
    sectionId: z.string(),
  }),
  z.object({
    type: z.literal("text"),
    value: z.string(),
    fieldId: z.string(),
    sectionId: z.string(),
  }),
  z.object({
    type: z.literal("select"),
    value: z.string(),
    fieldId: z.string(),
    sectionId: z.string(),
  }),
  z.object({
    type: z.literal("checkbox"),
    value: z.boolean(),
    fieldId: z.string(),
    sectionId: z.string(),
  }),
]);

export const SectionSchema = z.object({
  sectionId: z.string(),
  fields: z.array(FieldValueSchema),
});

// Complete User Request Schema
export const UserRequestSchema = contactSchema.extend({
  sections: z.array(SectionSchema),
  timestamp: z.date().default(() => new Date()),
});

export type ContactInfo = z.infer<typeof contactSchema>;
export type FieldValue = z.infer<typeof FieldValueSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type UserRequest = z.infer<typeof UserRequestSchema>;

// Helper function to validate user request
export function validateUserRequest(data: unknown): UserRequest {
  return UserRequestSchema.parse(data);
}

// Helper function to process form data into the correct format
export function processFormData(
  contactInfo: ContactInfo,
  formData: Record<string, any>,
  sections: any[]
): UserRequest {
  const processedSections = sections.map((section) => {
    const sectionFields = section.fields
      .filter((field: any) => !field.isHidden && field.enabled)
      .map((field: any) => {
        const value = formData[field.id];
        return {
          type: field.type,
          value: field.type === "number" ? Number(value) : value,
          fieldId: field.id,
          sectionId: section.id,
        };
      });

    return {
      sectionId: section.id,
      fields: sectionFields,
    };
  });

  return {
    ...contactInfo,
    sections: processedSections,
    timestamp: new Date(),
  };
}

// Helper function to extract specific field values
export function getFieldValue(
  request: UserRequest,
  fieldId: string
): FieldValue | undefined {
  return request.sections
    .flatMap((section) => section.fields)
    .find((field) => field.fieldId === fieldId);
}

// Helper function to get all fields for a specific section
export function getSectionFields(
  request: UserRequest,
  sectionId: string
): FieldValue[] {
  const section = request.sections.find((s) => s.sectionId === sectionId);
  return section?.fields || [];
}

// Validation function for specific field types
export function validateFieldValue(field: FieldValue): boolean {
  switch (field.type) {
    case "number":
      return !isNaN(field.value);
    case "text":
    case "select":
      return field.value.trim().length > 0;
    case "checkbox":
      return typeof field.value === "boolean";
    default:
      return false;
  }
}
