export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image?: string;
  isPlaceholder?: boolean;
}

export const testimonials: Testimonial[] = [];
