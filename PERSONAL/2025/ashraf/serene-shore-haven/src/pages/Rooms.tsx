
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import OptimizedImage from '@/components/OptimizedImage';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Room {
  id: string;
  name: string;
  image: string;
  price: string;
  features: string[];
  description: string;
}

const Rooms = () => {
  const navigate = useNavigate();

  const holidayRooms = [
    {
      id: 'ocean-view-suite',
      name: "Ocean View Suite",
      image: "/images/optimized/room-1.jpg",
      price: "$280/night",
      features: ["Private balcony", "Ocean view", "King bed", "Mini bar", "WiFi"],
      description: "Luxurious suite with panoramic ocean views and premium amenities."
    },
    {
      id: 'beachfront-villa',
      name: "Beachfront Villa",
      image:  "/images/optimized/room-3.jpg",
      price: "$450/night",
      features: ["Direct beach access", "Private pool", "2 bedrooms", "Kitchen", "Butler service"],
      description: "Exclusive villa with direct beach access and private pool."
    },
    {
      id: 'beachfront-villa',
      name: "Beachfront Villa",
      image:  "/images/optimized/room-3.jpg",
      price: "$450/night",
      features: ["Direct beach access", "Private pool", "2 bedrooms", "Kitchen", "Butler service"],
      description: "Exclusive villa with direct beach access and private pool."
    }
  ];

  const careRooms = [
    {
      id: 'accessible-mountain-view',
      name: "Accessible Mountain View",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
      price: "$350/night",
      features: ["Wheelchair accessible", "Mountain view", "Medical equipment ready", "24/7 call system", "Nearby nursing station"],
      description: "Specially designed room with accessibility features and mountain views."
    },
    {
      id: 'care-plus-suite',
      name: "Care Plus Suite",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
      price: "$520/night",
      features: ["Living area", "Caregiver space", "Medical monitoring", "Therapy room access", "Garden view"],
      description: "Premium care accommodation with dedicated caregiver facilities."
    }
  ];

  const RoomCard = ({ room, category }: { room: Room; category: string }) => (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={() => navigate(`/rooms/${room.id}`)}
    >
      <div className="relative h-64 overflow-hidden">
        <OptimizedImage
          src={room.image}
          alt={`${room.name} - ${category === 'holiday' ? 'Holiday accommodation' : 'Care accommodation'} at Feel-Home Hurghada`}
          className="w-full h-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex items-end">
          <div className="p-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              category === 'holiday' ? 'bg-aqua-500 text-white' : 'bg-sage-500 text-white'
            }`}>
              {category === 'holiday' ? 'Holiday Stay' : 'Care Stay'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-serif text-2xl font-semibold text-desert-800">{room.name}</h3>
          <p className="text-2xl font-bold text-desert-600">{room.price}</p>
        </div>

        <p className="text-gray-600 mb-4">{room.description}</p>

        <div className="mb-6">
          <h4 className="font-semibold text-desert-800 mb-2">Features:</h4>
          <div className="flex flex-wrap gap-2">
            {room.features.map((feature: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-desert-100 text-desert-700 rounded-full text-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        <Button className="btn-primary w-full">View Details & Book</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <OptimizedImage
          src="/images/optimized/desert-view-1.jpg"
          alt="Peaceful desert and mountain view - Accommodations at Feel-Home Hurghada"
          className="absolute inset-0 w-full h-full"
          priority={true}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-desert-900/40"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-white mb-6">
              Your Home Away From Home
            </h1>
            <p className="text-xl text-white/90">
              Choose from our carefully designed accommodations that welcome you with comfort and care
            </p>
          </div>
        </div>
      </section>

      {/* Holiday Rooms Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-desert-800 mb-4">
              Holiday Accommodations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Luxurious rooms and suites where every detail is designed to make you feel welcomed and at home by the sea
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {holidayRooms.map((room, index) => (
              <RoomCard key={index} room={room} category="holiday" />
            ))}
          </div>
        </div>
      </section>

      {/* Care Rooms Section */}
      <section className="section-padding bg-sage-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-desert-800 mb-4">
              Care-Friendly Accommodations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thoughtfully designed rooms where comfort meets care, creating a true sense of home and belonging
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {careRooms.map((room, index) => (
              <RoomCard key={index} room={room} category="care" />
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="section-padding bg-gradient-to-r from-desert-600 to-sage-600 text-white">
        <div className="container-max text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-6">
            Ready to Feel at Home?
          </h2>
          <p className="text-xl mb-8">
            Contact our welcoming team to find the perfect accommodation that will make you feel truly at home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-desert-700 hover:bg-gray-100 px-8 py-3">
              Call Now: +20 123 456 7890
            </Button>
            <Button className="border-2 border-white text-white hover:bg-white hover:text-desert-700 px-8 py-3">
              Email Reservations
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Rooms;
