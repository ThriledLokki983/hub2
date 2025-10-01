
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import OptimizedImage from '@/components/OptimizedImage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROOM_DATA } from '@/data/rooms';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Users, Bed, Heart, ChevronLeft, ChevronRight, X } from 'lucide-react';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const room = ROOM_DATA[id || ''];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === room.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? room.images.length - 1 : prevIndex - 1
    );
  };

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGalleryOpen) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentImageIndex((prevIndex) =>
          prevIndex === 0 ? room.images.length - 1 : prevIndex - 1
        );
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentImageIndex((prevIndex) =>
          prevIndex === room.images.length - 1 ? 0 : prevIndex + 1
        );
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsGalleryOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, room.images.length]);

  if (!room) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container-max section-padding text-center">
          <h1 className="font-serif text-3xl font-bold text-desert-800 mb-4">Room Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find the room you're looking for.</p>
          <Button onClick={() => navigate('/rooms')} className="bg-desert-600 hover:bg-desert-700">
            Back to Rooms
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
      <section className="relative h-96 overflow-hidden cursor-pointer group"
        onClick={() => openGallery(0)}
      >
        <OptimizedImage
          src={room.images[0].replace('/src/assets/', '/images/optimized/')}
          alt={`${room.name} - Main view`}
          className="absolute inset-0 w-full h-full"
          priority={true}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 group-hover:from-black/60 group-hover:to-black/30 transition-all duration-300"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container-max">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/rooms');
              }}
              className="mb-6 bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rooms
            </Button>
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl lg:text-6xl font-bold text-white mb-4">
                {room.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-white/90">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{room.occupancy}</span>
                </div>
                <div className="flex items-center">
                  <Bed className="w-5 h-5 mr-2" />
                  <span>{room.bedType}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-5 h-5 mr-2">📏</span>
                  <span>{room.size}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Click to view gallery hint */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          Click to view gallery
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
                  <h2 className="font-serif text-2xl font-bold text-desert-800">Welcome to Your Home Away From Home</h2>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {room.description}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="font-serif text-xl font-semibold text-desert-800 mb-4">What Makes This Room Special</h3>
                <div className="space-y-3">
                  {room.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className={`w-6 h-6 ${room.category === 'holiday' ? 'bg-aqua-500' : 'bg-sage-500'} rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0`}>
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <p className="text-gray-700">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo Gallery */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl font-semibold text-desert-800">Room Gallery</h3>
                  <span className="text-sm text-gray-600">
                    {room.images.length} photos
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {room.images.slice(1, 5).map((image: string, index: number) => (
                    <div
                      key={index}
                      className="relative h-24 md:h-32 rounded-lg shadow-md cursor-pointer overflow-hidden group transition-transform hover:scale-105"
                      onClick={() => openGallery(index + 1)}
                    >
                      <OptimizedImage
                        src={image.replace('/src/assets/', '/images/optimized/')}
                        alt={`${room.name} - Gallery image ${index + 2}`}
                        className="w-full h-full"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200"></div>
                      {index === 3 && room.images.length > 5 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm md:text-base">
                            +{room.images.length - 4} more
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Gallery Modal */}
                <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                  <DialogContent className="max-w-6xl w-full h-[90vh] p-0 border-0">
                    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                      {/* Close Button */}
                      <button
                        onClick={() => setIsGalleryOpen(false)}
                        className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {room.images.length}
                      </div>

                      {/* Main Image */}
                      <div className="w-full h-full flex items-center justify-center">
                        <OptimizedImage
                          src={room.images[currentImageIndex].replace('/src/assets/', '/images/optimized/')}
                          alt={`${room.name} - Gallery image ${currentImageIndex + 1}`}
                          className="max-w-full max-h-full w-auto h-auto object-contain"
                          priority={true}
                          sizes="100vw"
                        />
                      </div>

                      {/* Navigation Buttons */}
                      {room.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </>
                      )}

                      {/* Thumbnail Strip */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 max-w-4xl w-full px-4">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide justify-center">
                          {room.images.map((image: string, index: number) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`flex-shrink-0 w-16 h-12 md:w-20 md:h-16 rounded border-2 transition-all overflow-hidden ${
                                currentImageIndex === index
                                  ? 'border-white scale-110'
                                  : 'border-transparent opacity-70 hover:opacity-100'
                              }`}
                            >
                              <OptimizedImage
                                src={image.replace('/src/assets/', '/images/optimized/')}
                                alt={`${room.name} - Thumbnail ${index + 1}`}
                                className="w-full h-full"
                                sizes="80px"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-desert-800 mb-2">
                      {room.price}/night
                    </div>
                    <p className="text-gray-600">
                      {room.category === 'care' ? 'Care package included' : 'Holiday rate'}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-desert-800">Room Amenities:</h4>
                    <div className="space-y-2">
                      {room.amenities.map((amenity: string, index: number) => (
                        <div key={index} className="flex items-start text-sm">
                          <div className={`w-4 h-4 ${room.category === 'holiday' ? 'bg-aqua-500' : 'bg-sage-500'} rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0`}>
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className={`w-full ${
                      room.category === 'holiday'
                        ? 'bg-aqua-600 hover:bg-aqua-700'
                        : 'bg-sage-600 hover:bg-sage-700'
                    } text-white`}>
                      Book This Room
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-desert-300 text-desert-700 hover:bg-desert-50"
                      onClick={() => navigate('/contact')}
                    >
                      Ask Questions
                    </Button>
                    <div className="text-center pt-2">
                      <p className="text-sm text-gray-600">
                        {room.category === 'care' ? 'Care consultation available' : 'Best rate guarantee'}
                      </p>
                    </div>
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

export default RoomDetail;
