
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-desert-800 text-white">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-desert-500 to-aqua-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">SS</span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl">Feel-Home Hurghada</h3>
                <p className="text-sm text-desert-200">Resort & Care</p>
              </div>
            </div>
            <p className="text-desert-100 mb-4 max-w-md">
              Where luxury meets compassion. Experience the perfect blend of holiday paradise
              and exceptional care services in the heart of Egypt.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-desert-200 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <div className="w-8 h-8 bg-desert-700 rounded-full flex items-center justify-center hover:bg-desert-600 transition-colors">
                  <span className="text-sm font-bold">f</span>
                </div>
              </a>
              <a href="#" className="text-desert-200 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <div className="w-8 h-8 bg-desert-700 rounded-full flex items-center justify-center hover:bg-desert-600 transition-colors">
                  <span className="text-sm font-bold">ig</span>
                </div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/rooms" className="text-desert-200 hover:text-white transition-colors">Rooms & Suites</Link></li>
              <li><Link to="/amenities" className="text-desert-200 hover:text-white transition-colors">Amenities</Link></li>
              <li><Link to="/experiences" className="text-desert-200 hover:text-white transition-colors">Experiences</Link></li>
              <li><Link to="/about" className="text-desert-200 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-desert-200 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-2 text-desert-200">
              <p>Red Sea Coast, Egypt</p>
              <p>+20 123 456 7890</p>
              <p>info@serenityshores.com</p>
              <p className="text-sm pt-2">24/7 Care Services Available</p>
            </div>
          </div>
        </div>

        <div className="border-t border-desert-700 mt-12 pt-8 text-center text-desert-300">
          <p>&copy; 2024 Feel-Home Hurghada Resort & Care. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
