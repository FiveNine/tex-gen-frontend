
export interface Texture {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string;
  tags: string[];
  resolution: string;
  createdAt: string;
  userId: string;
}

export const mockTextures: Texture[] = [
  {
    id: "1",
    title: "Weathered Brick Wall",
    prompt: "Weathered red brick wall with moss, seamless texture",
    imageUrl: "https://images.unsplash.com/photo-1595514535415-dae8340fc195?q=80&w=500&auto=format&fit=crop",
    tags: ["brick", "wall", "weathered", "urban"],
    resolution: "2K",
    createdAt: "2023-10-01T12:30:00Z",
    userId: "user1"
  },
  {
    id: "2",
    title: "Marble Surface",
    prompt: "Polished white marble with subtle gray veining, seamless texture",
    imageUrl: "https://images.unsplash.com/photo-1597977745054-1586968936b0?q=80&w=500&auto=format&fit=crop",
    tags: ["marble", "stone", "luxury", "smooth"],
    resolution: "4K",
    createdAt: "2023-10-02T10:15:00Z",
    userId: "user2"
  },
  {
    id: "3",
    title: "Wood Planks",
    prompt: "Rustic oak wood planks with knots, seamless texture",
    imageUrl: "https://images.unsplash.com/photo-1610479651638-aeaf77d3d255?q=80&w=500&auto=format&fit=crop",
    tags: ["wood", "planks", "rustic", "natural"],
    resolution: "4K",
    createdAt: "2023-10-03T09:45:00Z",
    userId: "user1"
  },
  {
    id: "4",
    title: "Concrete Surface",
    prompt: "Raw concrete surface with small cracks and imperfections",
    imageUrl: "https://images.unsplash.com/photo-1617391258031-f8d80b22fb76?q=80&w=500&auto=format&fit=crop",
    tags: ["concrete", "gray", "industrial", "urban"],
    resolution: "2K",
    createdAt: "2023-10-04T14:20:00Z",
    userId: "user3"
  },
  {
    id: "5",
    title: "Metal Plate",
    prompt: "Brushed stainless steel plate with circular pattern",
    imageUrl: "https://images.unsplash.com/photo-1617306362032-64152f485880?q=80&w=500&auto=format&fit=crop",
    tags: ["metal", "steel", "industrial", "shiny"],
    resolution: "4K",
    createdAt: "2023-10-05T11:10:00Z",
    userId: "user2"
  },
  {
    id: "6",
    title: "Rock Cliff Face",
    prompt: "Natural rock cliff with jagged edges and crevices",
    imageUrl: "https://images.unsplash.com/photo-1590844209762-3713d378bef4?q=80&w=500&auto=format&fit=crop",
    tags: ["rock", "stone", "cliff", "natural"],
    resolution: "4K",
    createdAt: "2023-10-06T13:40:00Z",
    userId: "user3"
  },
  {
    id: "7",
    title: "Sand Ripples",
    prompt: "Desert sand with wind-created ripples, overhead view",
    imageUrl: "https://images.unsplash.com/photo-1517925035435-7976539b920d?q=80&w=500&auto=format&fit=crop",
    tags: ["sand", "desert", "natural", "beige"],
    resolution: "2K",
    createdAt: "2023-10-07T15:55:00Z",
    userId: "user1"
  },
  {
    id: "8",
    title: "Leather Surface",
    prompt: "Vintage brown leather with subtle grain pattern",
    imageUrl: "https://images.unsplash.com/photo-1475566718667-b6fe2e251c6b?q=80&w=500&auto=format&fit=crop",
    tags: ["leather", "brown", "natural", "vintage"],
    resolution: "2K",
    createdAt: "2023-10-08T16:30:00Z",
    userId: "user2"
  },
  {
    id: "9",
    title: "Gravel Pathway",
    prompt: "Small mixed stones and gravel, dense",
    imageUrl: "https://images.unsplash.com/photo-1557166983-5939644443a0?q=80&w=500&auto=format&fit=crop",
    tags: ["gravel", "stones", "path", "gray"],
    resolution: "4K",
    createdAt: "2023-10-09T08:20:00Z",
    userId: "user3"
  },
  {
    id: "10",
    title: "Terracotta Tiles",
    prompt: "Aged terracotta roof tiles with moss details",
    imageUrl: "https://images.unsplash.com/photo-1598804591499-a4f18b654ef0?q=80&w=500&auto=format&fit=crop",
    tags: ["terracotta", "tiles", "roof", "orange"],
    resolution: "2K",
    createdAt: "2023-10-10T10:40:00Z",
    userId: "user1"
  },
  {
    id: "11",
    title: "Grass Field",
    prompt: "Dense green grass with small wildflowers, top view",
    imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=500&auto=format&fit=crop",
    tags: ["grass", "green", "natural", "field"],
    resolution: "4K",
    createdAt: "2023-10-11T12:15:00Z",
    userId: "user2"
  },
  {
    id: "12",
    title: "Ice Crystal",
    prompt: "Close-up of blue ice crystals with complex patterns",
    imageUrl: "https://images.unsplash.com/photo-1467673211495-7306021b5397?q=80&w=500&auto=format&fit=crop",
    tags: ["ice", "crystal", "blue", "winter"],
    resolution: "4K",
    createdAt: "2023-10-12T14:50:00Z",
    userId: "user3"
  }
];

export const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "month",
    description: "Perfect for occasional texturing needs",
    features: [
      "5 texture generations per month",
      "1K resolution downloads",
      "Basic prompt customization",
      "Community support"
    ],
    buttonText: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "$12",
    period: "month",
    description: "For professional creators and studios",
    features: [
      "Unlimited texture generations",
      "4K resolution downloads",
      "Advanced prompt controls",
      "Reference image upload",
      "Priority generation queue",
      "Email support"
    ],
    buttonText: "Subscribe Now",
    popular: true
  }
];
