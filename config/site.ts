export const siteConfig = {
  name: "House of Veya",
  shortName: "Veya",
  description: "Bespoke full-home interiors shaped by architecture, craft and the way you live.",
  email: "studio@houseofveya.in",
  phone: "+91 90070 18400",
  cities: ["Kolkata", "Bengaluru", "Mumbai", "Delhi NCR", "Pune", "Hyderabad"],
  nav: [
    { label: "Projects", href: "/projects" },
    { label: "Services", href: "/services" },
    { label: "Styles", href: "/styles" },
    { label: "Process", href: "/how-it-works" },
    { label: "About", href: "/about" },
  ],
  budgets: ["Under ₹5 lakh", "₹5–10 lakh", "₹10–20 lakh", "₹20–35 lakh", "₹35–50 lakh", "₹50 lakh+", "Not sure"],
  timelines: ["Immediately", "Within 1 month", "1–3 months", "3–6 months", "6+ months", "Just exploring"],
} as const;

export const homeCategories = ["Full Home", "Living", "Kitchens", "Bedrooms", "Wardrobes", "Dining", "Home Office"] as const;
export const roomOptions = ["Full Home", "Living Room", "Kitchen", "Bedrooms", "Wardrobes", "Dining", "Home Office", "Bathrooms", "Balcony"] as const;
export const priorityOptions = ["Storage", "Premium Materials", "Easy Maintenance", "Child Friendly", "Pet Friendly", "Smart Home", "Natural Light", "Luxury Finish", "Vastu", "Sustainability"] as const;
