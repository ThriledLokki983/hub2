# 🏨 Feel-Home Hurghada - Serene Shore Haven

> A luxury resort and care facility website combining Egyptian hospitality with innovative eldercare services

![Feel-Home Hurghada](https://img.shields.io/badge/Status-Active%20Development-green)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

## 🌟 Project Overview

Feel-Home Hurghada is a unique dual-purpose resort that offers both luxury vacation experiences and compassionate eldercare services. This website showcases our beautiful accommodations, world-class amenities, and caring services in the stunning Red Sea destination of Hurghada, Egypt.

### ✨ Key Features

- **🏖️ Holiday Accommodations**: Luxury beachfront suites and villas with ocean views
- **🏥 Care Services**: Specialized eldercare facilities with 24/7 medical support
- **🌊 Premium Experiences**: Red Sea snorkeling, desert safaris, cultural tours
- **🍽️ Fine Dining**: Egyptian and international cuisine
- **💆‍♀️ Wellness Spa**: Therapeutic treatments and relaxation services
- **📱 Responsive Design**: Optimized for all devices and screen sizes
- **⚡ Performance Optimized**: Advanced image optimization with 95%+ file size reduction

## 🚀 Live Demo

**Project URL**: [https://lovable.dev/projects/03169388-b499-46ed-9755-32d50fce8a98](https://lovable.dev/projects/03169388-b499-46ed-9755-32d50fce8a98)

## 🛠️ Technology Stack

### Frontend Framework
- **React 18** - Modern component-based UI library
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Cormorant Garamond** - Elegant serif typography
- **Nunito** - Clean sans-serif font

### Routing & Navigation
- **React Router** - Client-side routing
- **Responsive Navigation** - Mobile-first design

### Performance & Optimization
- **Custom Image Optimization** - 95%+ file size reduction
- **Lazy Loading** - Smart image loading strategy
- **Progressive Enhancement** - Graceful degradation
- **Performance Monitoring** - Development-time tracking

### Development Tools
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing
- **Custom Build Scripts** - Image optimization automation

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navigation.tsx  # Main navigation component
│   ├── Footer.tsx      # Site footer
│   └── OptimizedImage.tsx # Performance-optimized image component
├── pages/              # Route components
│   ├── Index.tsx       # Home page with split hero design
│   ├── Rooms.tsx       # Accommodations showcase
│   ├── RoomDetail.tsx  # Individual room details with gallery
│   ├── Experiences.tsx # Activities and services
│   ├── Amenities.tsx   # Facility features
│   ├── About.tsx       # Company information
│   └── Contact.tsx     # Contact information
├── data/               # Static data and content
│   └── rooms.ts        # Room and suite information
├── hooks/              # Custom React hooks
│   └── useImagePerformance.ts # Performance monitoring
├── lib/                # Utility functions
└── assets/             # Static assets (images, etc.)

public/
├── images/
│   ├── optimized/      # Compressed images (290-608KB)
│   ├── thumbnails/     # Small preview images (23-30KB)
│   └── webp/           # Modern image format support
└── scripts/
    ├── optimize-images.sh # Batch image compression
    └── create-webp.sh     # WebP format generation
```

## 🎨 Design System

### Color Palette
- **Desert**: Warm earth tones (#b8855d to #553931)
- **Aqua**: Refreshing ocean blues (#2dd4bf to #0f766e)
- **Sage**: Calming care greens (#84cc16 to #365314)

### Typography
- **Headers**: Cormorant Garamond (elegant serif)
- **Body**: Nunito (clean sans-serif)
- **Spacing**: Consistent tracking and line-height

### Components
- **Responsive Cards**: Hover effects and smooth transitions
- **Image Galleries**: Full-screen viewing with thumbnails
- **Loading States**: Elegant placeholders and animations
- **Mobile Navigation**: Collapsible menu with smooth animations

## 📱 Pages & Features

### 🏠 Home Page
- **Split Hero Design**: Holiday vs Care sections
- **Responsive Layout**: Stacks on mobile, splits on desktop
- **Feature Highlights**: Key amenities and services
- **Call-to-Action**: Prominent booking buttons

### 🏨 Rooms & Suites
- **Category Filtering**: Holiday vs Care accommodations
- **Interactive Cards**: Hover effects and quick details
- **Optimized Images**: Fast loading with lazy loading
- **Booking Integration**: Direct room reservation

### 🖼️ Room Details
- **Image Galleries**: Full-screen viewing with navigation
- **Detailed Information**: Features, amenities, pricing
- **Responsive Design**: Mobile-friendly galleries
- **Performance Optimized**: Smart image loading

### 🎯 Experiences
- **Activity Categories**: Tourist and Care experiences
- **Rich Descriptions**: Detailed activity information
- **Visual Showcase**: High-quality imagery
- **Duration & Pricing**: Clear service details

### 🏊‍♀️ Amenities
- **Facility Overview**: Comprehensive amenity listing
- **Visual Presentation**: Beautiful facility photography
- **Service Categories**: Organized by type and availability

## ⚡ Performance Features

### Image Optimization
- **95%+ Size Reduction**: From 8-18MB to 290-608KB
- **Multiple Formats**: JPEG optimization with WebP support
- **Responsive Sizing**: Different images for different screen sizes
- **Smart Loading**: Priority loading for critical images

### User Experience
- **Loading States**: Smooth placeholders and transitions
- **Error Handling**: Graceful fallbacks for failed loads
- **Accessibility**: Proper alt text and ARIA labels
- **Performance Monitoring**: Development-time tracking

### Build Optimization
- **Automated Processing**: Build-time image optimization
- **Modern Formats**: WebP and AVIF support ready
- **CDN Ready**: Optimized for content delivery networks

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd serene-shore-haven
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:8080`

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production (includes image optimization)
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Image Optimization
npm run optimize:images  # Compress all images
npm run optimize:webp    # Create WebP versions
```

## 🏗️ Development

### Adding New Pages
1. Create component in `src/pages/`
2. Add route to navigation in `src/components/Navigation.tsx`
3. Update routing configuration

### Image Optimization
1. Add images to `src/assets/`
2. Run `npm run optimize:images`
3. Use `OptimizedImage` component for best performance

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow the established color palette
- Maintain responsive design principles
- Use the design system typography

## 📊 Performance Metrics

### Before Optimization
- **Image Sizes**: 8-18MB per image
- **Load Times**: 2-5 seconds on slow connections
- **Total Page Weight**: Very heavy

### After Optimization
- **Image Sizes**: 290-608KB (95% reduction)
- **Load Times**: 50-100ms for images
- **Total Page Weight**: Significantly reduced
- **Core Web Vitals**: Improved LCP scores

## 🚢 Deployment

### Using Lovable Platform
1. Open [Lovable Project](https://lovable.dev/projects/03169388-b499-46ed-9755-32d50fce8a98)
2. Click **Share → Publish**
3. Your site will be deployed automatically

### Custom Domain Setup
1. Navigate to **Project > Settings > Domains**
2. Click **Connect Domain**
3. Follow the configuration steps

### Manual Deployment
```bash
npm run build        # Creates optimized production build
npm run preview      # Test the production build locally
```

## 🔧 Configuration

### Environment Variables
Create `.env.local` for environment-specific settings:
```env
VITE_API_URL=your_api_url
VITE_ANALYTICS_ID=your_analytics_id
```

### Image Optimization Settings
Modify `scripts/optimize-images.sh` for custom compression settings:
- **Max Width**: 1920px
- **Quality**: 80%
- **Format**: JPEG with WebP fallback

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain responsive design
- Optimize images before committing
- Test across different devices
- Follow the established design system

## 📝 License

This project is private and proprietary.

## 🆘 Support

For technical support or questions:
- **Lovable Platform**: [Documentation](https://docs.lovable.dev/)
- **Issues**: Create GitHub issue
- **Custom Domain**: [Setup Guide](https://docs.lovable.dev/tips-tricks/custom-domain)

---

**Built with ❤️ for Feel-Home Hurghada - Where comfort meets care**
