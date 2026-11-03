export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image?: string;
  isPlaceholder?: boolean;
}

export const testimonials: Testimonial[] = [];

/**
 * Draft entries added from the admin panel ship with placeholder copy
 * ("Your testimonial will appear here.", "Client Name", "Role / Company").
 * They must never reach the live site — a testimonial section that shows fake
 * cards is worse than no section at all. Anything failing this check is simply
 * not rendered; the section disappears until a real testimonial is added.
 */
export function isPublishedTestimonial(
  testimonial: Partial<Testimonial> | null | undefined
): boolean {
  if (!testimonial) return false;
  if (testimonial.isPlaceholder === true) return false;

  const quote = (testimonial.quote || "").trim();
  const name = (testimonial.name || "").trim();
  const role = (testimonial.role || "").trim();

  if (!quote || !name) return false;
  if (/your testimonial/i.test(quote)) return false;
  if (/^(client|customer|your)\s*name$/i.test(name)) return false;
  if (/^role(\s*\/\s*company)?$/i.test(role)) return false;

  return true;
}
