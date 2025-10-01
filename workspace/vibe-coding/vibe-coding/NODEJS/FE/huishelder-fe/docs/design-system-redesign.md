# HuisHelder Redesigned UI

This folder contains the redesigned UI components for the HuisHelder application, following the new design system specifications.

## 🎨 Design System Overview

The redesign follows these key design principles:

- **Minimal yet warm** design aesthetic
- **Luxurious but not flashy** presentation
- **Smart, trustworthy, and incredibly clean** user experience
- **Slightly "cosmic" and futuristic** visual language
- **Highly readable and effortlessly elegant** typography

### Color Palette

- **Deep Olive Green** (#3A4F41): Brand primary color
- **Soft Amber** (#F4C77B): Accent and call-to-action elements
- **Bone White** (#F8F5F0): Light backgrounds
- **Warm Fog** (#EAE6E1): Cards and surfaces
- **Clay Red** (#C25A5A): Alerts and highlights
- **Charcoal Ink** (#2A2A2A): Text and important elements

### Components

The redesign includes updated versions of core components:

- **Button**: Modern, with hover effects and multiple variants
- **ButtonSet**: For organizing groups of buttons
- **Card**: Clean, elevated surfaces for content
- **Home Page**: Completely redesigned home page with improved layout and visual appeal

## 🚀 How to Use

### Enabling the Redesign

There are three ways to toggle between the original and redesigned UI:

1. **Environment Variable**: Set the environment variable `VITE_USE_REDESIGNED=true` to enable the redesigned components throughout the application.

2. **UI Toggle Button**: Use the floating toggle button in the bottom-right corner of the application (visible in development mode only).

3. **Local Storage**: The application will remember your preference through `localStorage`. You can manually set `localStorage.setItem('useRedesignedUI', 'true')` in the browser console.

### Using Individual Components

```tsx
// Import redesigned components
import { ButtonRedesigned, ButtonSetRedesigned } from 'components/redesigned';

// Use in your component
const MyComponent = () => (
  <div>
    <ButtonRedesigned variant="primary">Click me</ButtonRedesigned>
    <ButtonSetRedesigned>
      <ButtonRedesigned variant="primary">Primary</ButtonRedesigned>
      <ButtonRedesigned variant="secondary">Secondary</ButtonRedesigned>
    </ButtonSetRedesigned>
  </div>
);
```

### Design Tokens and Mixins

The design system includes comprehensive tokens and mixins for consistent styling:

```scss
// Import design system mixins
@import '../../styles/utility/huishelder-mixins.scss';

// Use mixins in your component styles
.myComponent {
  @include container;
  @include section;

  .heading {
    @include heading-lg;
  }

  .card {
    @include interactive-card;
  }
}
```

## 📏 Spacing System

The design follows a strict 4pt grid system. All spacing values are multiples of 4:

- `--spacing-xxxs`: 2px (0.5 × 4px)
- `--spacing-xxs`: 4px (1 × 4px)
- `--spacing-xs`: 8px (2 × 4px)
- `--spacing-sm`: 12px (3 × 4px)
- `--spacing-md`: 16px (4 × 4px)
- `--spacing-lg`: 24px (6 × 4px)
- `--spacing-xl`: 32px (8 × 4px)
- `--spacing-xxl`: 48px (12 × 4px)
- `--spacing-xxxl`: 64px (16 × 4px)

## 🔤 Typography

The type system uses a limited set of consistent sizes and weights:

- Font: Satoshi, General Sans, or Inter
- Sizes: From 12px to 48px in defined steps
- Weights: Light (300), Regular (400), Medium (500), Semi-bold (600), Bold (700)

## 🧩 Component Guidelines

Common component patterns include:

- **Cards**: Soft rounded corners (12px radius), subtle shadows
- **Buttons**: Softly rounded (12px radius), hover effects, variants for different purposes
- **Inputs**: Clean outline, visible label, subtle focus state
- **Sections**: Consistent spacing (48px between sections)

## 🔄 Migration

To convert existing components to the new design system:

1. Create a redesigned version with the suffix "Redesigned"
2. Update styles to use the design tokens and mixins
3. Add the component to the `src/components/redesigned.ts` barrel file
4. Replace usage of the old component with the new one

## 🏁 Final Notes

This redesign aims to elevate the HuisHelder user experience with a sophisticated, clear interface that inspires trust and confidence. The design system is built to be flexible, maintainable, and provide a consistent experience across the application.
