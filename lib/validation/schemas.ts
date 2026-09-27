import { z } from "zod";

const shortText = z.string().trim().max(160);
export const estimateSchema = z.object({
  city: shortText.min(1), propertyType: shortText.min(1), bhk: shortText.min(1), carpetArea: z.coerce.number().min(250).max(20000),
  rooms: z.array(shortText).max(20), kitchen: z.boolean(), wardrobes: z.coerce.number().int().min(0).max(20), furniture: z.boolean(), falseCeiling: z.boolean(), flooring: z.boolean(),
  finishLevel: z.enum(["Essential", "Premium", "Luxury"]),
});

export const projectSchema = z.object({
  propertyType: shortText.min(1), bhk: shortText.min(1), city: shortText.min(1), locality: shortText.min(1), carpetArea: z.coerce.number().min(100).max(30000),
  propertyStatus: shortText.min(1), possessionDate: z.string().trim().max(40), rooms: z.array(shortText).min(1).max(20), styles: z.array(shortText).min(1).max(10),
  priorities: z.array(shortText).max(20), budget: shortText.min(1), timeline: shortText.min(1), name: shortText.min(2), phone: z.string().trim().min(7).max(24).regex(/^[+()\-\s\d]+$/),
  preferredContact: z.enum(["Phone", "WhatsApp", "Email"]), preferredTime: shortText.min(1), notes: z.string().trim().max(2000),
});
