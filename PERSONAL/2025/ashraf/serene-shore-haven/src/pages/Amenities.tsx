
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Amenities = () => {
  const holidayAmenities = [
    {
      name: "Infinity Pool",
      description: "Stunning infinity pool overlooking the Red Sea with poolside service",
      icon: "🏊‍♀️"
    },
    {
      name: "Private Beach",
      description: "Exclusive beach access with water sports and beachside dining",
      icon: "🏖️"
    },
    {
      name: "Spa & Wellness",
      description: "Full-service spa with Egyptian-inspired treatments and relaxation areas",
      icon: "💆‍♀️"
    },
    {
      name: "Fine Dining",
      description: "Multiple restaurants serving Egyptian, Mediterranean, and international cuisine",
      icon: "🍽️"
    }
  ];

  const careAmenities = [
    {
      name: "24/7 Medical Care",
      description: "On-site medical professionals and emergency response team",
      icon: "🏥"
    },
    {
      name: "Therapy Gardens",
      description: "Peaceful walking paths and therapeutic gardens with mountain views",
      icon: "🌿"
    },
    {
      name: "Activity Center",
      description: "Specially designed spaces for gentle exercises and social activities",
      icon: "🎨"
    },
    {
      name: "Accessible Transport",
      description: "Wheelchair-accessible shuttles and specialized mobility assistance",
      icon: "♿"
    }
  ];

  const AmenityCard = ({ amenity, color }: { amenity: any; color: string }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center text-2xl mb-4`}>
        {amenity.icon}
      </div>
      <h3 className="font-serif text-xl font-semibold text-desert-800 mb-3">{amenity.name}</h3>
      <p className="text-gray-600">{amenity.description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-96 bg-cover bg-center" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1920&q=80')`
      }}>
        <div className="absolute inset-0 bg-desert-900/60"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-white mb-6">
              Resort Amenities
            </h1>
            <p className="text-xl text-white/90">
              World-class facilities designed for relaxation, recreation, and compassionate care
            </p>
          </div>
        </div>
      </section>

      {/* Holiday Amenities */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-desert-800 mb-4">
              Holiday & Recreation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Indulge in luxury amenities designed to make your vacation unforgettable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {holidayAmenities.map((amenity, index) => (
              <AmenityCard key={index} amenity={amenity} color="bg-aqua-100" />
            ))}
          </div>
        </div>
      </section>

      {/* Care Amenities */}
      <section className="section-padding bg-sage-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-desert-800 mb-4">
              Care & Wellness Facilities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive care facilities ensuring comfort, safety, and peace of mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {careAmenities.map((amenity, index) => (
              <AmenityCard key={index} amenity={amenity} color="bg-sage-100" />
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Amenities */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold text-desert-800 mb-6">
                Exceptional Dining Experiences
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Our culinary team crafts exquisite dishes using fresh, local ingredients. 
                From traditional Egyptian flavors to international cuisine, every meal is a celebration.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Beachfront restaurant with sunset views</li>
                <li>• Dietary accommodations for all care needs</li>
                <li>• 24-hour room service available</li>
                <li>• Private dining for special occasions</li>
              </ul>
            </div>
            <div className="h-80 bg-cover bg-center rounded-xl" style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80')`
            }}></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Amenities;
