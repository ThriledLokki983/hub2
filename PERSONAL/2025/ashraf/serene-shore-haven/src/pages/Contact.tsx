
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    stayType: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-desert-600 to-aqua-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-6">
              Contact & Booking
            </h1>
            <p className="text-xl text-white/90">
              Ready to experience Feel-Home Hurghada? We're here to help plan your perfect stay
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Booking Form */}
            <div>
              <h2 className="font-serif text-3xl font-bold text-desert-800 mb-6">
                Book Your Stay
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and our team will contact you within 24 hours to confirm
                your reservation and discuss any special requirements.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stay Type *
                    </label>
                    <Select onValueChange={(value) => handleInputChange('stayType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stay type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="holiday">Holiday Stay</SelectItem>
                        <SelectItem value="care">Care Stay</SelectItem>
                        <SelectItem value="both">Mixed Stay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => handleInputChange('checkIn', e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => handleInputChange('checkOut', e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Guests *
                    </label>
                    <Select onValueChange={(value) => handleInputChange('guests', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Guests" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                        <SelectItem value="3">3 Guests</SelectItem>
                        <SelectItem value="4">4 Guests</SelectItem>
                        <SelectItem value="5+">5+ Guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements or Questions
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    className="w-full"
                    placeholder="Please let us know about any special care needs, dietary requirements, accessibility requests, or other preferences..."
                  />
                </div>

                <Button type="submit" className="btn-primary w-full">
                  Submit Booking Request
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="font-serif text-3xl font-bold text-desert-800 mb-6">
                Get in Touch
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-desert-800 mb-2">
                    📞 Phone & WhatsApp
                  </h3>
                  <p className="text-gray-600">+20 123 456 7890</p>
                  <p className="text-sm text-gray-500">Available 24/7 for emergencies and care services</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-desert-800 mb-2">
                    ✉️ Email
                  </h3>
                  <p className="text-gray-600">reservations@serenityshores.com</p>
                  <p className="text-gray-600">care@serenityshores.com</p>
                  <p className="text-sm text-gray-500">Response within 24 hours guaranteed</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-desert-800 mb-2">
                    📍 Location
                  </h3>
                  <p className="text-gray-600">
                    Red Sea Coast, Hurghada<br />
                    South Sinai Governorate<br />
                    Egypt
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-desert-800 mb-2">
                    🕒 Reception Hours
                  </h3>
                  <p className="text-gray-600">24/7 Front Desk Service</p>
                  <p className="text-sm text-gray-500">Our care team is available around the clock</p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg text-desert-800 mb-4">Our Location</h3>
                <div className="h-64 bg-desert-100 rounded-lg flex items-center justify-center">
                  <p className="text-desert-600">Interactive Map Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-desert-50">
        <div className="container-max">
          <h2 className="font-serif text-3xl font-bold text-desert-800 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div>
              <h4 className="font-semibold text-desert-800 mb-2">
                What care services are available 24/7?
              </h4>
              <p className="text-gray-600 mb-4">
                We provide round-the-clock nursing care, medical monitoring, assistance with daily
                activities, emergency response, and medication management.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-desert-800 mb-2">
                Can family members visit care guests?
              </h4>
              <p className="text-gray-600 mb-4">
                Absolutely! We encourage family visits and provide comfortable spaces for quality
                time together. We can also arrange video calls for distant family members.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-desert-800 mb-2">
                What activities are suitable for elderly guests?
              </h4>
              <p className="text-gray-600 mb-4">
                We offer gentle yoga, art therapy, garden walks, memory games, music therapy,
                and social activities designed specifically for senior wellness.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-desert-800 mb-2">
                Is the resort wheelchair accessible?
              </h4>
              <p className="text-gray-600 mb-4">
                Yes, our care wing is fully wheelchair accessible with ramps, wide doorways,
                accessible bathrooms, and specialized transportation options.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
