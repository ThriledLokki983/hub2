
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import OptimizedImage from '@/components/OptimizedImage';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Experience {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: string;
}

const Experiences = () => {
  const navigate = useNavigate();

  const touristExperiences = [
    {
      id: 'red-sea-snorkeling',
      title: "Red Sea Snorkeling",
      description: "Explore vibrant coral reefs and marine life in crystal-clear waters",
      duration: "Half Day",
      image: "/images/optimized/beach-4.jpg"
    },
    {
      id: 'desert-safari',
      title: "Desert Safari Adventure",
      description: "Journey through golden dunes with camel rides and Bedouin culture",
      duration: "Full Day",
      image: "/images/optimized/desert-view-1.jpg"
    },
    {
      id: 'cultural-tour',
      title: "Cultural Heritage Tour",
      description: "Discover ancient history and local traditions with expert guides",
      duration: "Half Day",
      image: "/images/optimized/DSC_7507.jpg"
    },
    {
      id: 'cooking-class',
      title: "Egyptian Cooking Class",
      description: "Learn traditional recipes and cooking techniques from master chefs",
      duration: "3 Hours",
      image: "/images/optimized/DSC_7508.jpg"
    }
  ];

  const elderlyExperiences = [
    {
      id: 'gentle-yoga',
      title: "Gentle Yoga Sessions",
      description: "Chair-friendly yoga with mountain views and certified instructors",
      duration: "1 Hour",
      image: "/images/optimized/DSC_7509.jpg"
    },
    {
      id: 'art-therapy',
      title: "Art Therapy Workshop",
      description: "Creative expression sessions with professional art therapists",
      duration: "2 Hours",
      image: "/images/optimized/DSC_7510.jpg"
    },
    {
      id: 'memory-garden',
      title: "Memory Garden Walks",
      description: "Peaceful strolls through therapeutic gardens with reminiscence activities",
      duration: "45 Minutes",
      image: "/images/optimized/DSC_7511.jpg"
    }
  ];  const ExperienceCard = ({ experience, category }: { experience: Experience; category: string }) => (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={() => navigate(`/experiences/${experience.id}`)}
    >
      <div className="relative h-48 overflow-hidden">
        <OptimizedImage
          src={experience.image}
          alt={`${experience.title} - ${category === 'tourist' ? 'Tourist experience' : 'Care activity'} at Feel-Home Hurghada`}
          className="w-full h-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              category === 'tourist' ? 'bg-aqua-500/90 text-white' : 'bg-sage-500/90 text-white'
            }`}>
              {experience.duration}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold text-desert-800 mb-3">
          {experience.title}
        </h3>
        <p className="text-gray-600 mb-4">{experience.description}</p>
        <Button className={`w-full ${
          category === 'tourist' ? 'bg-aqua-600 hover:bg-aqua-700' : 'bg-sage-600 hover:bg-sage-700'
        } text-white`}>
          Learn More
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-aqua-600 to-sage-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-white mb-6">
              Feel at Home Experiences
            </h1>
            <p className="text-xl text-white/90">
              Discover activities and experiences designed to make you feel welcomed, comfortable, and truly at home
            </p>
          </div>
        </div>
      </section>

      {/* Tourist Experiences */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-desert-800 mb-4">
              Adventures That Welcome You
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Immerse yourself in Egypt's natural beauty and rich culture with experiences that make you feel like family
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {touristExperiences.map((experience, index) => (
              <ExperienceCard key={index} experience={experience} category="tourist" />
            ))}
          </div>
        </div>
      </section>

      {/* Elderly Experiences */}
      <section className="section-padding bg-sage-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-desert-800 mb-4">
              Comfort & Connection Activities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thoughtfully designed activities that create a sense of belonging, well-being, and the warmth of home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {elderlyExperiences.map((experience, index) => (
              <ExperienceCard key={index} experience={experience} category="elderly" />
            ))}
          </div>
        </div>
      </section>

      {/* Care Services Detail */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold text-desert-800 mb-6">
                Care That Feels Like Family
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-sage-500 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-desert-800">24/7 Compassionate Care</h4>
                    <p className="text-gray-600">Dedicated caregivers who treat you like their own family</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-sage-500 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-desert-800">Personalized Home-Like Care</h4>
                    <p className="text-gray-600">Individual attention that honors your preferences and comfort</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-sage-500 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-desert-800">Family Connection</h4>
                    <p className="text-gray-600">Regular updates and involvement that keeps families close</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3">
                  Schedule Your Care Consultation
                </Button>
              </div>
            </div>

            <div className="h-96 bg-cover bg-center rounded-xl" style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80')`
            }}></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Experiences;
