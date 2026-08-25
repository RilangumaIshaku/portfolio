"use client";

import { useState, useEffect } from "react";

interface ContentData {
  services: any[];
  faq: any[];
  projects: any[];
  testimonials: any[];
  pricing: any[];
  process: any[];
  advantages: any[];
}

// Import JSON data directly at build time
import servicesData from "@/data/services.json";
import faqData from "@/data/faq.json";
import projectsData from "@/data/projects.json";
import testimonialsData from "@/data/testimonials.json";
import pricingData from "@/data/pricing.json";
import processData from "@/data/process.json";
import advantagesData from "@/data/advantages.json";

const staticData: ContentData = {
  services: servicesData,
  faq: faqData,
  projects: projectsData,
  testimonials: testimonialsData,
  pricing: pricingData,
  process: processData,
  advantages: advantagesData,
};

export function useContentData() {
  return { data: staticData, loading: false };
}
