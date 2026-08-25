export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
  isPlaceholder: boolean;
}

/**
 * Replace these placeholders with real testimonials.
 * Just swap the values — the marquee component reads from this array.
 */
export const testimonials: Testimonial[] = [
  {
    quote: "Your testimonial will appear here.",
    name: "Client Name",
    role: "Role / Company",
    image: "/images/placeholder-avatar.jpg",
    isPlaceholder: true,
  },
  {
    quote: "Your testimonial will appear here.",
    name: "Client Name",
    role: "Role / Company",
    image: "/images/placeholder-avatar.jpg",
    isPlaceholder: true,
  },
  {
    quote: "Your testimonial will appear here.",
    name: "Client Name",
    role: "Role / Company",
    image: "/images/placeholder-avatar.jpg",
    isPlaceholder: true,
  },
  {
    quote: "Your testimonial will appear here.",
    name: "Client Name",
    role: "Role / Company",
    image: "/images/placeholder-avatar.jpg",
    isPlaceholder: true,
  },
  {
    quote: "Your testimonial will appear here.",
    name: "Client Name",
    role: "Role / Company",
    image: "/images/placeholder-avatar.jpg",
    isPlaceholder: true,
  },
];
