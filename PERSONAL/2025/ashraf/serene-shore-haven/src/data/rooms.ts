interface RoomData {
  name: string;
  category: 'holiday' | 'care';
  price: string;
  size: string;
  occupancy: string;
  bedType: string;
  location: string;
  description: string;
  features: string[];
  amenities: string[];
  images: string[];
}

  export const ROOM_DATA: Record<string, RoomData> = {
    'ocean-view-suite': {
      name: "Ocean View Suite - Your Seaside Sanctuary",
      category: "holiday",
      price: "$280",
      size: "650 sq ft",
      occupancy: "2 guests",
      bedType: "King bed",
      location: "Ocean-facing wing",
      description: "Welcome to your private oceanfront retreat where the sound of waves and gentle sea breeze create the perfect atmosphere for relaxation. This isn't just a room - it's your home by the sea, designed with every comfort to make you feel welcomed and cherished.",
      features: [
        "Private furnished balcony with panoramic ocean views",
        "Luxurious king-size bed with premium linens",
        "Marble bathroom with soaking tub and rain shower",
        "Mini bar stocked with local and international favorites",
        "High-speed WiFi and entertainment system",
        "24/7 room service and concierge",
        "Egyptian cotton robes and slippers",
        "Daily fresh fruit and flower arrangements"
      ],
      amenities: [
        "Ocean view balcony",
        "Mini bar & coffee station",
        "Free WiFi",
        "Room service",
        "Safe",
        "Air conditioning",
        "Daily housekeeping",
        "Concierge service"
      ],
      images: [
        "/images/optimized/room-1.jpg",
        "/images/optimized/view-10.jpg",
        "/images/optimized/view-11.jpg",
        "/images/optimized/view-12.jpg",
        "/images/optimized/DSC_7578.jpg",
        "/images/optimized/DSC_7580.jpg",
        "/images/optimized/DSC_7581.jpg",
        "/images/optimized/DSC_7587.jpg",
        "/images/optimized/DSC_7590.jpg",
        "/images/optimized/DSC_7593.jpg",
        "/images/optimized/DSC_7595.jpg",
        "/images/optimized/DSC_7596.jpg",
        "/images/optimized/DSC_7597.jpg",
        "/images/optimized/DSC_7598.jpg",
        "/images/optimized/DSC_7600.jpg",
        "/images/optimized/DSC_7601.jpg"
      ]
    },
    'beachfront-villa': {
      name: "Beachfront Villa - Your Private Paradise",
      category: "holiday",
      price: "$450",
      size: "1200 sq ft",
      occupancy: "4 guests",
      bedType: "2 bedrooms with king beds",
      location: "Direct beachfront",
      description: "Step into your own slice of paradise with direct beach access and a private pool. This villa is designed as your home away from home, where Egyptian hospitality meets luxury living in perfect harmony.",
      features: [
        "Direct private beach access with dedicated loungers",
        "Private swimming pool with mountain backdrop",
        "Two spacious bedrooms with king beds and ocean views",
        "Fully equipped kitchen for home-cooked meals",
        "Dedicated butler service for personalized attention",
        "Large terrace with outdoor dining area",
        "Premium entertainment system throughout",
        "Private parking and golf cart service"
      ],
      amenities: [
        "Private beach access",
        "Private pool",
        "Full kitchen",
        "Butler service",
        "Two bedrooms",
        "Outdoor dining",
        "Golf cart service",
        "Private parking"
      ],
      images: [
        "/images/optimized/room-3.jpg",
        "/images/optimized/view-10.jpg",
        "/images/optimized/view-11.jpg",
        "/images/optimized/view-12.jpg",
        "/images/optimized/DSC_7556.jpg",
        "/images/optimized/DSC_7536.jpg",
        "/images/optimized/DSC_7522.jpg",
        "/images/optimized/DSC_7538.jpg",
        "/images/optimized/DSC_7539.jpg",
        "/images/optimized/DSC_7532.jpg",
        "/images/optimized/DSC_7541.jpg",
        "/images/optimized/DSC_7559.jpg",
        "/images/optimized/DSC_7544.jpg",
        "/images/optimized/DSC_7545.jpg",
        "/images/optimized/DSC_7550.jpg",
        "/images/optimized/DSC_7552.jpg"
      ]
    },
    'accessible-mountain-view': {
      name: "Accessible Mountain View - Comfort & Care Combined",
        category: "care",
        price: "$350",
        size: "700 sq ft",
        occupancy: "2 guests + caregiver space",
        bedType: "Adjustable hospital-grade bed",
        location: "Mountain-facing care wing",
        description: "Experience the perfect blend of accessibility and beauty in this specially designed room that overlooks peaceful mountains. Every detail has been thoughtfully planned to ensure comfort, safety, and the feeling of being truly cared for and at home.",
        features: [
          "Fully wheelchair accessible with wide doorways",
          "Breathtaking mountain views from every window",
          "Medical equipment ready with oxygen and monitoring",
          "24/7 emergency call system within easy reach",
          "Nearby nursing station for immediate assistance",
          "Roll-in shower with safety features and seating",
          "Adjustable lighting for comfort and medical needs",
          "Family seating area for visitors and loved ones"
        ],
        amenities: [
          "Wheelchair accessible",
          "Mountain views",
          "Medical equipment ready",
          "24/7 call system",
          "Roll-in shower",
          "Adjustable bed",
          "Nursing station nearby",
          "Family visiting area"
        ],
        images: [
          "/images/optimized/room-4.jpg",
          "/images/optimized/DSC_7560.jpg",
          "/images/optimized/DSC_7561.jpg",
          "/images/optimized/DSC_7562.jpg",
          "/images/optimized/DSC_7563.jpg",
          "/images/optimized/DSC_7564.jpg",
          "/images/optimized/DSC_7565.jpg",
          "/images/optimized/DSC_7566.jpg",
          "/images/optimized/DSC_7570.jpg",
          "/images/optimized/DSC_7571.jpg",
          "/images/optimized/DSC_7572.jpg",
          "/images/optimized/DSC_7573.jpg",
          "/images/optimized/DSC_7574.jpg",
          "/images/optimized/DSC_7575.jpg",
          "/images/optimized/DSC_7576.jpg",
          "/images/optimized/DSC_7577.jpg"
        ],
    },
    'accessible-mountain-view-1': {
      name: "Accessible Mountain View - Comfort & Care Combined",
      category: "care",
      price: "$350",
      size: "700 sq ft",
      occupancy: "2 guests + caregiver space",
      bedType: "Adjustable hospital-grade bed",
      location: "Mountain-facing care wing",
      description: "Experience the perfect blend of accessibility and beauty in this specially designed room that overlooks peaceful mountains. Every detail has been thoughtfully planned to ensure comfort, safety, and the feeling of being truly cared for and at home.",
      features: [
        "Fully wheelchair accessible with wide doorways",
        "Breathtaking mountain views from every window",
        "Medical equipment ready with oxygen and monitoring",
        "24/7 emergency call system within easy reach",
        "Nearby nursing station for immediate assistance",
        "Roll-in shower with safety features and seating",
        "Adjustable lighting for comfort and medical needs",
        "Family seating area for visitors and loved ones"
      ],
      amenities: [
        "Wheelchair accessible",
        "Mountain views",
        "Medical equipment ready",
        "24/7 call system",
        "Roll-in shower",
        "Adjustable bed",
        "Nursing station nearby",
        "Family visiting area"
      ],
      images: [
        "/images/optimized/room-1.jpg",
        "/images/optimized/view-10.jpg",
        "/images/optimized/view-11.jpg",
        "/images/optimized/view-12.jpg",
        "/images/optimized/DSC_7578.jpg",
        "/images/optimized/DSC_7580.jpg",
        "/images/optimized/DSC_7581.jpg",
        "/images/optimized/DSC_7587.jpg",
        "/images/optimized/DSC_7590.jpg",
        "/images/optimized/DSC_7593.jpg",
        "/images/optimized/DSC_7595.jpg",
        "/images/optimized/DSC_7596.jpg",
        "/images/optimized/DSC_7597.jpg",
        "/images/optimized/DSC_7598.jpg",
        "/images/optimized/DSC_7600.jpg",
        "/images/optimized/DSC_7601.jpg"
      ]
    },
    'care-plus-suite': {
      name: "Care Plus Suite - Premium Care in Comfort",
      category: "care",
      price: "$520",
      size: "900 sq ft",
      occupancy: "2 guests + dedicated caregiver",
      bedType: "Premium adjustable bed",
      location: "Tranquil garden wing",
      description: "Welcome to our most comprehensive care accommodation, where premium comfort meets exceptional care services. This suite is designed as a true home where you and your family can feel at peace, knowing that every need is anticipated and cared for with love.",
      features: [
        "Spacious living area for family gatherings and activities",
        "Dedicated caregiver space with comfortable accommodations",
        "Advanced medical monitoring systems for peace of mind",
        "Direct access to physical and occupational therapy rooms",
        "Serene garden views from multiple windows",
        "Kitchenette for familiar home-cooked meals",
        "Private family consultation room",
        "Premium comfort amenities and personalized care plans"
      ],
      amenities: [
        "Living area",
        "Caregiver space",
        "Medical monitoring",
        "Therapy room access",
        "Garden views",
        "Kitchenette",
        "Family consultation room",
        "Personalized care"
      ],
      images: [
        "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540518614846-7eded47ee3a0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1520637836862-4d197d17c92a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80"
      ]
    }
  };