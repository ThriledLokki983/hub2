
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Rooms & Suites', path: '/rooms' },
    { name: 'Amenities', path: '/amenities' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container-max">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-14 h-14 bg-gradient-to-bl from-desert-600 to-aqua-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-xl tracking-wider logo-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="22" fill="none">
                  <path fill="#FFF" d="M.292 18c-.056 0-.084-.056-.084-.168 0-.112.028-.168.084-.168.69 0 1.195-.047 1.512-.14.317-.093.532-.27.644-.532.13-.28.196-.7.196-1.26V2.768c0-.56-.056-.97-.168-1.232-.112-.261-.327-.439-.644-.532C1.533.892 1.048.836.376.836.32.836.292.78.292.668.292.556.32.5.376.5H11.8c.186 0 .28.084.28.252l.056 3.528c0 .056-.056.093-.168.112-.094 0-.15-.028-.168-.084-.13-1.027-.495-1.81-1.092-2.352-.598-.541-1.381-.812-2.352-.812H6.928c-.803 0-1.353.121-1.652.364-.28.224-.42.653-.42 1.288V15.62c0 .597.075 1.036.224 1.316.168.261.476.448.924.56.448.112 1.157.168 2.128.168.037 0 .056.056.056.168 0 .112-.019.168-.056.168-.765 0-1.363-.01-1.792-.028l-2.632-.028-1.96.028c-.355.019-.84.028-1.456.028ZM10.4 11.896c0-.803-.243-1.39-.728-1.764-.485-.392-1.26-.588-2.324-.588H3.792V8.9h3.64c1.008 0 1.745-.168 2.212-.504.485-.336.728-.84.728-1.512 0-.037.056-.056.168-.056.112 0 .168.019.168.056l-.028 2.352c0 .56.01.98.028 1.26l.028 1.4c0 .037-.056.056-.168.056-.112 0-.168-.019-.168-.056Zm18.863-9.072c0-.56-.056-.97-.168-1.232-.112-.28-.336-.476-.672-.588-.336-.112-.858-.168-1.568-.168-.056 0-.084-.056-.084-.168 0-.112.028-.168.084-.168l1.316.028c.859.037 1.596.056 2.212.056.523 0 1.195-.019 2.016-.056L33.827.5c.056 0 .084.056.084.168 0 .112-.028.168-.084.168-.69 0-1.204.056-1.54.168-.317.093-.532.27-.644.532-.112.261-.168.672-.168 1.232v12.964c0 .56.056.98.168 1.26.112.261.327.439.644.532.336.093.85.14 1.54.14.056 0 .084.056.084.168 0 .112-.028.168-.084.168-.597 0-1.073-.01-1.428-.028l-2.016-.028-2.212.028a23.75 23.75 0 0 1-1.316.028c-.056 0-.084-.056-.084-.168 0-.112.028-.168.084-.168.728 0 1.251-.047 1.568-.14.336-.093.56-.27.672-.532.112-.261.168-.681.168-1.26V2.824Zm-11.396 5.74h12.376v.644H17.867v-.644Zm-1.036-5.796c0-.56-.056-.97-.168-1.232-.112-.261-.326-.439-.644-.532-.317-.112-.821-.168-1.512-.168-.056 0-.084-.056-.084-.168 0-.112.028-.168.084-.168l1.428.028c.784.037 1.438.056 1.96.056.579 0 1.298-.019 2.156-.056L21.48.5c.038 0 .056.056.056.168 0 .112-.018.168-.056.168-.709 0-1.232.056-1.568.168-.336.112-.569.308-.7.588-.112.261-.168.672-.168 1.232v12.908c0 .56.056.98.168 1.26.131.261.355.439.672.532.336.093.868.14 1.596.14.038 0 .056.056.056.168 0 .112-.018.168-.056.168-.616 0-1.092-.01-1.428-.028l-2.156-.028-1.988.028c-.354.019-.84.028-1.456.028-.037 0-.056-.056-.056-.168 0-.112.019-.168.056-.168.691 0 1.195-.047 1.512-.14.336-.093.56-.27.672-.532.131-.28.196-.7.196-1.26V2.768Z"/>
                </svg>
                {/* FH */}
              </span>
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl text-desert-800 tracking-wide leading-tight">Feel-Home Hurghada</h1>
              <p className="text-md text-desert-600 font-serif">Resort & Care</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium text-sm transition-colors duration-200 hover:text-desert-600 ${
                  isActivePath(item.path)
                    ? 'text-desert-600 border-b-2 border-desert-600 pb-1'
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button className="btn-primary">Book Now</Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className={`h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-medium text-base transition-colors duration-200 hover:text-desert-600 px-4 py-2 ${
                    isActivePath(item.path) ? 'text-desert-600 bg-desert-50 rounded-lg' : 'text-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 pt-4">
                <Button className="btn-primary w-full">Book Now</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
