
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import OptimizedImage from '@/components/OptimizedImage';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - Responsive Split Design */}
      <section className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Holiday Side */}
        <div className="w-full lg:w-1/2 min-h-screen lg:h-auto relative overflow-hidden">
          <OptimizedImage
            src="/images/optimized/sea-view-2.jpg"
            alt="Serene ocean view with pristine beach - Holiday Paradise at Feel-Home Hurghada"
            className="absolute inset-0 w-full h-full object-cover"
            priority={true}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-300/30"></div>
          <div className="relative z-10 h-full flex items-center justify-center text-center p-4 sm:p-6 lg:p-8">
            <div className="max-w-md animate-slide-in-left">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-wide leading-tight">
                Your Holiday Paradise
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 font-light leading-relaxed">
                Discover luxury by the sea with world-class amenities, pristine beaches, and unforgettable experiences.
              </p>
              <Link to="/experiences">
                <Button className="bg-white text-aqua-700 hover:bg-aqua-50 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Plan Your Holiday
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Care Side */}
        <div className="w-full lg:w-1/2 min-h-screen lg:h-auto relative overflow-hidden">
          <OptimizedImage
            src="/images/optimized/desert-view-1.jpg"
            alt="Peaceful desert mountain view - Compassionate Care at Feel-Home Hurghada"
            className="absolute inset-0 w-full h-full object-cover"
            priority={true}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-sage-900/40 to-sage-600/20"></div>
          <div className="relative z-10 h-full flex items-center justify-center text-center p-4 sm:p-6 lg:p-8">
            <div className="max-w-md animate-slide-in-right">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-wide leading-tight">
                Compassionate Care
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed">
                Experience peace and comfort with our 24/7 care services, surrounded by serene mountain views.
              </p>
              <Link to="/experiences">
                <Button className="bg-white text-sage-700 hover:bg-sage-50 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Explore Our Care
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Center Logo - Only visible on larger screens */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-20 h-20 bg-white rounded-full shadow-2xl flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-desert-500 to-aqua-500 rounded-full flex items-center justify-center">
              <span className="text-white font-serif font-bold text-2xl tracking-wider">FH</span>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="section-padding bg-white">
        <div className="container-max text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-desert-800 mb-6 tracking-wide leading-tight">
              Welcome to Feel-Home Hurghada
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Where Egyptian hospitality meets innovative care. Our unique resort offers the perfect blend
              of luxury vacation experiences and compassionate eldercare services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/rooms">
                <Button className="btn-primary">Explore Rooms</Button>
              </Link>
              <Link to="/about">
                <Button className="btn-secondary">Our Story</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding bg-desert-50">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-aqua-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-10 h-10 bg-aqua-500 rounded-full"></div>
              </div>
              <h3 className="font-serif text-xl font-semibold text-desert-800 mb-2 tracking-wide">Seaside Luxury</h3>
              <p className="text-gray-600">Premium beachfront accommodations with stunning ocean views</p>
            </div>

            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-10 h-10 bg-sage-500 rounded-full"></div>
              </div>
              <h3 className="font-serif text-xl font-semibold text-desert-800 mb-2 tracking-wide">24/7 Care</h3>
              <p className="text-gray-600">Professional medical care and assistance available around the clock</p>
            </div>

            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-desert-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-10 h-10 bg-desert-500 rounded-full"></div>
              </div>
              <h3 className="font-serif text-xl font-semibold text-desert-800 mb-2 tracking-wide">Fine Dining</h3>
              <p className="text-gray-600">Exquisite Egyptian and international cuisine crafted by expert chefs</p>
            </div>

            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-aqua-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-10 h-10 bg-aqua-600 rounded-full"></div>
              </div>
              <h3 className="font-serif text-xl font-semibold text-desert-800 mb-2 tracking-wide">Wellness Spa</h3>
              <p className="text-gray-600">Rejuvenating treatments and therapeutic services for body and mind</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-desert-600 to-aqua-600 text-white">
        <div className="container-max text-center">
          <div className="max-w-2xl mx-auto animate-fade-in">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-6 tracking-wide leading-tight">
              Ready to Experience Serenity?
            </h2>
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Whether you're seeking a perfect holiday or compassionate care for your loved ones,
              we're here to provide an exceptional experience.
            </p>
            <Link to="/contact">
              <Button className="bg-white text-desert-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Book Your Stay Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
