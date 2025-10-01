
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Clock, Users, MapPin, Heart } from 'lucide-react';

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const experienceData: Record<string, any> = {
    'red-sea-snorkeling': {
      title: "Red Sea Snorkeling Adventure",
      category: "tourist",
      duration: "Half Day (4 hours)",
      groupSize: "2-8 people",
      location: "Coral Bay Marine Reserve",
      price: "$85 per person",
      description: "Dive into the crystal-clear waters of the Red Sea and discover a vibrant underwater world that will make you feel like you've found your aquatic home. Our experienced guides ensure you feel comfortable and welcomed from the moment you step into the water.",
      highlights: [
        "Explore pristine coral reefs teeming with colorful marine life",
        "Professional guidance for all skill levels - beginners welcome!",
        "All snorkeling equipment provided and sanitized",
        "Underwater photography service to capture your memories",
        "Fresh local refreshments and towel service included",
        "Small groups ensure personalized attention"
      ],
      whatToExpect: "Your underwater adventure begins with a warm welcome at our beachfront center. After a gentle introduction to snorkeling techniques, you'll be guided to the most beautiful coral gardens where angelfish, parrotfish, and gentle sea turtles call home. Our guides stay close to ensure you feel safe and confident throughout your journey.",
      includes: [
        "Professional snorkeling guide",
        "All equipment (mask, snorkel, fins)",
        "Underwater photography",
        "Fresh fruit and beverages",
        "Towel and changing facilities",
        "Transportation from hotel"
      ],
      images: [
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80"
      ]
    },
    'desert-safari': {
      title: "Desert Safari Cultural Journey",
      category: "tourist", 
      duration: "Full Day (8 hours)",
      groupSize: "4-12 people",
      location: "Eastern Desert & Bedouin Village",
      price: "$120 per person",
      description: "Experience the magic of Egypt's golden desert while feeling the warmth of Bedouin hospitality. This isn't just a tour - it's an invitation into a way of life that will make you feel like part of the desert family.",
      highlights: [
        "Camel riding through stunning desert landscapes",
        "Authentic Bedouin village visit with tea ceremony",
        "Traditional Egyptian lunch prepared by local families",
        "Sunset viewing from ancient desert vantage points",
        "Stargazing session with local astronomy guide",
        "Cultural exchange with Bedouin storytellers"
      ],
      whatToExpected: "Your desert family welcomes you with traditional tea and dates before embarking on a gentle camel journey through rolling sand dunes. Visit a genuine Bedouin settlement where you'll share stories, enjoy home-cooked meals, and learn about desert life from families who've called this land home for generations.",
      includes: [
        "Expert Bedouin guide and translator",
        "Camel riding experience",
        "Traditional lunch with local family",
        "Desert tea ceremony",
        "Cultural activities and storytelling",
        "Comfortable transportation",
        "Sunset photography session"
      ],
      images: [
        "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80"
      ]
    },
    'cooking-class': {
      title: "Egyptian Home Cooking Experience",
      category: "tourist",
      duration: "3 Hours",
      groupSize: "4-10 people", 
      location: "FeelHome Culinary Kitchen",
      price: "$65 per person",
      description: "Step into our family kitchen and learn the secrets of Egyptian home cooking. More than just a class, this is an invitation to join our culinary family and take a piece of Egyptian hospitality home with you.",
      highlights: [
        "Learn authentic family recipes passed down through generations",
        "Hands-on cooking with locally sourced ingredients",
        "Master the art of Egyptian bread making",
        "Prepare traditional mezze and main dishes",
        "Enjoy your creations in a family-style dinner",
        "Take home printed recipes and spice blends"
      ],
      whatToExpect: "Our chef welcomes you like family into our warm kitchen where the aroma of Egyptian spices fills the air. You'll work alongside other food lovers, sharing stories while preparing dishes that have brought Egyptian families together for centuries. End your experience by sharing the meal you've created together.",
      includes: [
        "Professional chef instructor",
        "All ingredients and cooking equipment",
        "Recipe cards to take home", 
        "Egyptian spice blend gift",
        "Family-style dinner of your creations",
        "Non-alcoholic beverages",
        "Apron and cooking utensils"
      ],
      images: [
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80"
      ]
    },
    'gentle-yoga': {
      title: "Gentle Mountain View Yoga",
      category: "elderly",
      duration: "1 Hour",
      groupSize: "3-8 people",
      location: "Peaceful Mountain Terrace",
      price: "Included in Care Package",
      description: "Find your inner peace with gentle yoga sessions designed specifically for comfort and wellbeing. Our certified instructors create a welcoming space where you can move at your own pace while enjoying breathtaking mountain views.",
      highlights: [
        "Chair-friendly yoga suitable for all mobility levels",
        "Certified therapeutic yoga instructors",
        "Breathtaking mountain views during practice",
        "Focus on gentle stretching and breathing",
        "Small groups ensure individual attention",
        "Relaxation and meditation components"
      ],
      whatToExpect: "Join our welcoming yoga family on the serene mountain terrace where gentle breezes and stunning views create the perfect atmosphere for healing movement. Our experienced instructors adapt each pose to your comfort level, ensuring you feel supported and at ease throughout the session.",
      includes: [
        "Certified therapeutic yoga instructor",
        "Comfortable yoga props (chairs, cushions, blankets)",
        "Guided meditation session",
        "Herbal tea after practice",
        "Breathing exercise instruction",
        "Individualized modifications"
      ],
      images: [
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80"
      ]
    },
    'art-therapy': {
      title: "Creative Expression Art Therapy",
      category: "elderly",
      duration: "2 Hours",
      groupSize: "4-8 people",
      location: "Sunlit Art Studio",
      price: "Included in Care Package",
      description: "Discover the joy of creative expression in our warm, welcoming art studio. Our professional art therapists guide you through various mediums, helping you explore creativity while connecting with others in a supportive, family-like environment.",
      highlights: [
        "Professional art therapy guidance",
        "Various mediums: watercolors, pastels, collage",
        "No experience necessary - all skill levels welcome",
        "Therapeutic benefits for emotional wellbeing",
        "Social connection with fellow participants",
        "Take home your beautiful creations"
      ],
      whatToExpect: "Step into our bright, cheerful art studio where creativity flows as freely as conversation. Our art therapists create a nurturing environment where you can express yourself through color and form while building meaningful connections with others who share your journey.",
      includes: [
        "Professional art therapist",
        "All art supplies and materials",
        "Individual easel and workspace",
        "Light refreshments during session",
        "Framing for your finished artwork",
        "Group sharing and reflection time"
      ],
      images: [
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80"
      ]
    },
    'memory-garden': {
      title: "Memory Garden Therapeutic Walks",
      category: "elderly",
      duration: "45 Minutes",
      groupSize: "2-6 people",
      location: "Therapeutic Memory Garden",
      price: "Included in Care Package",
      description: "Stroll through our specially designed memory garden where every path tells a story and every flower holds a memory. These gentle walks combine nature therapy with reminiscence activities in a beautiful, safe environment that feels like home.",
      highlights: [
        "Specially designed therapeutic garden pathways",
        "Memory-stimulating plants and sensory features",
        "Guided reminiscence activities",
        "Comfortable seating areas for rest",
        "Weather-appropriate, accessible routes",
        "Connection with nature and fellow walkers"
      ],
      whatToExpect: "Join our caring guide for a peaceful journey through gardens designed to awaken cherished memories. Touch fragrant herbs, listen to gentle water features, and share stories with companions as you explore pathways created specifically for therapeutic benefit and joy.",
      includes: [
        "Trained therapeutic guide",
        "Comfortable walking assistance if needed",
        "Sensory garden exploration",
        "Memory sharing activities",
        "Rest stops with comfortable seating",
        "Light refreshments after walk"
      ],
      images: [
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80"
      ]
    }
  };

  const experience = experienceData[id || ''];

  if (!experience) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container-max section-padding text-center">
          <h1 className="font-serif text-3xl font-bold text-desert-800 mb-4">Experience Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find the experience you're looking for.</p>
          <Button onClick={() => navigate('/experiences')} className="bg-desert-600 hover:bg-desert-700">
            Back to Experiences
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-96 bg-cover bg-center" style={{
        backgroundImage: `url('${experience.images[0]}')`
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container-max">
            <Button 
              onClick={() => navigate('/experiences')}
              className="mb-6 bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Experiences
            </Button>
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl lg:text-6xl font-bold text-white mb-4">
                {experience.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-white/90">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{experience.duration}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{experience.groupSize}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{experience.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 text-desert-600 mr-2" />
                  <h2 className="font-serif text-2xl font-bold text-desert-800">Welcome to Your Experience</h2>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {experience.description}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="font-serif text-xl font-semibold text-desert-800 mb-4">What Makes This Special</h3>
                <div className="space-y-3">
                  {experience.highlights.map((highlight: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-sage-500 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <p className="text-gray-700">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-serif text-xl font-semibold text-desert-800 mb-4">What to Expect</h3>
                <p className="text-gray-700 leading-relaxed">
                  {experience.whatToExpect}
                </p>
              </div>

              {/* Photo Gallery */}
              <div className="mb-8">
                <h3 className="font-serif text-xl font-semibold text-desert-800 mb-4">Photo Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {experience.images.slice(1).map((image: string, index: number) => (
                    <div key={index} className="h-48 bg-cover bg-center rounded-lg" style={{
                      backgroundImage: `url('${image}')`
                    }}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-desert-800 mb-2">
                      {experience.price}
                    </div>
                    <p className="text-gray-600">
                      {experience.category === 'elderly' ? 'Included in your care package' : 'Per person'}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-desert-800">What's Included:</h4>
                    <div className="space-y-2">
                      {experience.includes.map((item: string, index: number) => (
                        <div key={index} className="flex items-start text-sm">
                          <div className="w-4 h-4 bg-sage-500 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className={`w-full ${
                      experience.category === 'tourist' 
                        ? 'bg-aqua-600 hover:bg-aqua-700' 
                        : 'bg-sage-600 hover:bg-sage-700'
                    } text-white`}>
                      {experience.category === 'elderly' ? 'Schedule Session' : 'Book This Experience'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-desert-300 text-desert-700 hover:bg-desert-50"
                      onClick={() => navigate('/contact')}
                    >
                      Ask Questions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExperienceDetail;
