export type Project = {
  slug: string; name: string; city: string; homeType: string; bhk: string; style: string; area: string;
  cover: string; gallery: string[]; description: string; rooms: string[]; materials: string[]; story: string;
};

export const projects: Project[] = [
  {
    slug: "alipore-house-of-light", name: "Alipore House of Light", city: "Kolkata", homeType: "Penthouse", bhk: "4 BHK", style: "Modern Indian", area: "3,850 sq ft",
    cover: "/images/hero-living.png", gallery: ["/images/hero-living.png", "/images/bedroom.png", "/images/kitchen.png"],
    description: "A generous family home where filtered city light meets Bengal craft and quiet contemporary forms.",
    rooms: ["Living", "Dining", "Primary suite", "Library", "Kitchen"], materials: ["Walnut", "Travertine", "Hand-finished plaster", "Aged brass"],
    story: "The family wanted warmth without ornament. We built the home around long sightlines and a carved timber cabinet that anchors the living room, then repeated its deep grain in smaller details throughout the house.",
  },
  {
    slug: "courtyard-villa", name: "Courtyard Villa", city: "Bengaluru", homeType: "Villa", bhk: "4 BHK", style: "Organic Modern", area: "4,200 sq ft",
    cover: "/images/kitchen.png", gallery: ["/images/kitchen.png", "/images/hero-living.png", "/images/bedroom.png"],
    description: "A tactile, garden-facing home resolved in limestone, ribbed walnut and muted bronze.",
    rooms: ["Kitchen", "Dining", "Living", "Bedrooms", "Study"], materials: ["Limestone", "Fluted walnut", "Bronze", "Linen"],
    story: "Courtyard views set the plan. Joinery stays dark and grounded, while pale stone carries morning light deep into the centre of the home. The kitchen is both a working room and its social heart.",
  },
  {
    slug: "sea-line-residence", name: "Sea Line Residence", city: "Mumbai", homeType: "Apartment", bhk: "3 BHK", style: "Warm Contemporary", area: "2,450 sq ft",
    cover: "/images/bedroom.png", gallery: ["/images/bedroom.png", "/images/hero-living.png", "/images/kitchen.png"],
    description: "A restorative sea-facing apartment layered with hand-finished walls, oxblood accents and dark timber.",
    rooms: ["Primary suite", "Living", "Dining", "Guest bedroom"], materials: ["Lime plaster", "Dark oak", "Leather", "Patinated metal"],
    story: "We softened the apartment's hard perimeter with screens, niches and textile layers. The primary bedroom frames the horizon without competing with it; each built-in disappears into the wall when closed.",
  },
];

export function getProject(slug: string) { return projects.find((project) => project.slug === slug); }
