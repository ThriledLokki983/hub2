
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const About = () => {
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
              Our Story
            </h1>
            <p className="text-xl text-white/90">
              Where Egyptian hospitality meets innovative care in a setting of unparalleled beauty
            </p>
          </div>
        </div>
      </section>

      {/* Main Story */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-desert-800 mb-8 text-center">
              A Vision Born from Love and Care
            </h2>

            <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
              <p className="text-xl leading-relaxed">
                Feel-Home Hurghada was born from a simple yet profound vision: to create a place where the
                joy of vacation and the comfort of compassionate care could coexist in perfect harmony.
                Nestled along Egypt's stunning Red Sea coast, our unique resort embraces both the
                adventurous spirit of travelers and the gentle needs of those seeking specialized care.
              </p>

              <p>
                Our founder, Dr. Amira Hassan, spent decades working in geriatric care while dreaming
                of a place where her elderly patients could experience not just medical attention, but
                also the beauty and wonder that makes life meaningful. When she discovered this
                extraordinary location—where crystal-clear waters meet serene mountains—she knew she
                had found the perfect setting for her vision.
              </p>

              <p>
                The east side of our property faces the magnificent Red Sea, where coral reefs dance
                beneath azure waters and golden beaches stretch into the horizon. Here, holidaymakers
                find adventure, relaxation, and the timeless magic of Egypt's coastal beauty.
              </p>

              <p>
                The west side embraces the tranquil mountain landscape, where therapeutic gardens wind
                through peaceful pathways and the changing light creates an ever-shifting canvas of
                serenity. This side of our resort is specially designed for guests who need additional
                care, offering accessibility, medical support, and the profound peace that comes from
                being surrounded by nature's gentle embrace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-desert-50">
        <div className="container-max">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-desert-800 mb-12 text-center">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-aqua-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-12 h-12 bg-aqua-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">❤️</span>
                </div>
              </div>
              <h3 className="font-serif text-xl font-semibold text-desert-800 mb-4">Compassion</h3>
              <p className="text-gray-600">
                Every interaction is guided by empathy, understanding, and genuine care for each
                guest's unique needs and dignity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-12 h-12 bg-sage-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">⭐</span>
                </div>
              </div>
              <h3 className="font-serif text-xl font-semibold text-desert-800 mb-4">Excellence</h3>
              <p className="text-gray-600">
                We maintain the highest standards in hospitality, medical care, and service,
                ensuring every moment exceeds expectations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-desert-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-12 h-12 bg-desert-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🤝</span>
                </div>
              </div>
              <h3 className="font-serif text-xl font-semibold text-desert-800 mb-4">Inclusivity</h3>
              <p className="text-gray-600">
                Our resort welcomes all guests, creating a community where different needs and
                backgrounds are celebrated and accommodated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-desert-800 mb-4">
              Our Dedicated Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the passionate professionals who make Feel-Home Hurghada a place of healing,
              joy, and unforgettable memories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-desert-300 to-desert-500 rounded-full mx-auto mb-4"></div>
              <h4 className="font-serif font-semibold text-lg text-desert-800">Dr. Amira Hassan</h4>
              <p className="text-sm text-gray-600 mb-2">Founder & Director</p>
              <p className="text-xs text-gray-500">Geriatric Care Specialist</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-aqua-300 to-aqua-500 rounded-full mx-auto mb-4"></div>
              <h4 className="font-serif font-semibold text-lg text-desert-800">Ahmed Farouk</h4>
              <p className="text-sm text-gray-600 mb-2">Resort Manager</p>
              <p className="text-xs text-gray-500">Hospitality Excellence</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-sage-300 to-sage-500 rounded-full mx-auto mb-4"></div>
              <h4 className="font-serif font-semibold text-lg text-desert-800">Sarah Mitchell</h4>
              <p className="text-sm text-gray-600 mb-2">Care Coordinator</p>
              <p className="text-xs text-gray-500">Certified Nurse Manager</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-desert-400 to-aqua-400 rounded-full mx-auto mb-4"></div>
              <h4 className="font-serif font-semibold text-lg text-desert-800">Omar El-Rashid</h4>
              <p className="text-sm text-gray-600 mb-2">Activities Director</p>
              <p className="text-xs text-gray-500">Recreation & Therapy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="section-padding bg-gradient-to-r from-desert-600 to-sage-600 text-white">
        <div className="container-max text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-6">
            Building a Legacy of Care
          </h2>
          <p className="text-xl max-w-3xl mx-auto">
            Every day at Feel-Home Hurghada, we witness the profound impact of combining luxury hospitality
            with compassionate care. Our guests don't just stay with us—they become part of our extended
            family, creating memories that last a lifetime while receiving the care and attention they deserve.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
