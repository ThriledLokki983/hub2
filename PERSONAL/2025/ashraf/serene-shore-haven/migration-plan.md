# Migration Plan: React App to Basic HTML, Tailwind CSS, and OOP JavaScript

## Objective
Migrate the current React-based app to a static, client-side web app using only HTML, Tailwind CSS, and JavaScript (OOP). The new app must be fully responsive and match the current functionality and design.

---

## 1. Analyze Current App Structure
- **Pages:** Home, Rooms, Room Detail, About, Amenities, Contact, Experiences, Experience Detail, NotFound
- **Components:** Navigation, Footer, UI elements (Button, Card, Dialog, etc.), Gallery, Toasts, etc.
- **Data:** Room data, experience data, etc. (currently in TypeScript files)
- **Routing:** React Router for navigation
- **State Management:** React hooks (useState, useEffect)
- **Styling:** Tailwind CSS
- **Assets:** Images in `/src/assets/` and `/public/`

---

## 2. New App Structure (HTML/JS)
- `/index.html` (Home)
- `/rooms.html` (Rooms list)
- `/room-detail.html` (Room detail)
- `/about.html` (About)
- `/amenities.html` (Amenities)
- `/contact.html` (Contact)
- `/experiences.html` (Experiences)
- `/experience-detail.html` (Experience detail)
- `/404.html` (Not Found)
- `/assets/` (Images)
- `/js/` (All JS files)
- `/css/` (Tailwind CSS build)

---

## 3. Routing & Navigation
- Use anchor tags (`<a href="rooms.html">`) for navigation.
- Use query parameters for detail pages (e.g., `room-detail.html?id=ocean-view-suite`).
- On detail pages, use JS to parse URL params and load correct data.
- Implement a fallback to `404.html` for invalid routes/data.

---

## 4. Data Management
- Move all room and experience data to JS files as objects/classes.
- Use OOP: Create Room, Experience, and Gallery classes to encapsulate logic.
- Use JS to dynamically render content based on data and URL params.

---

## 5. Components & UI Elements
- Convert React components to HTML partials or JS-rendered templates.
- Navigation and Footer: Create reusable HTML snippets or JS functions to inject them.
- UI Elements (Button, Card, Dialog, etc.):
  - Use Tailwind for styling.
  - Use JS classes/functions for interactivity (e.g., modals, carousels).
- Gallery: Implement modal gallery with navigation using JS and Tailwind.
- Toasts: Use JS to show/hide notification elements.

---

## 6. State & Interactivity
- Replace React state/hooks with JS class properties and event listeners.
- Use OOP patterns for encapsulating state (e.g., Gallery class manages current image index).
- Use `localStorage` if persistent state is needed.

---

## 7. Responsiveness
- Use Tailwind's responsive classes for all layouts.
- Test all pages/components on mobile, tablet, and desktop.
- Ensure modals, navigation, and galleries are touch-friendly.

---

## 8. Asset Management
- Move all images to `/assets/`.
- Update all image paths in HTML/JS.
- Ensure favicon and other public assets are referenced in `index.html`.

---

## 9. Build & Deployment
- Use Tailwind CLI to build CSS into `/css/tailwind.css`.
- No build step for JS/HTML (static files only).
- Test locally and deploy to static hosting (e.g., Netlify, Vercel, GitHub Pages).

---

## 10. Migration Steps
1. **Set up base HTML files for each page.**
2. **Copy Tailwind CDN or build CSS for styling.**
3. **Move all assets to `/assets/`.**
4. **Create JS classes for Room, Experience, Gallery, etc.**
5. **Write JS to render page content dynamically based on data and URL params.**
6. **Convert all React components to HTML/JS equivalents.**
7. **Implement navigation and modals using JS and Tailwind.**
8. **Test responsiveness and interactivity on all devices.**
9. **Add error handling and fallback for invalid routes/data.**
10. **Deploy and verify all functionality matches the original app.**

---

## 11. Detailed Page-by-Page Plan
### Home (`index.html`)
- Static HTML with JS to inject navigation/footer.
- Highlight featured rooms/experiences using JS data.

### Rooms (`rooms.html`)
- List rooms using JS to loop through room data.
- Each room links to `room-detail.html?id=...`.

### Room Detail (`room-detail.html`)
- Parse `id` from URL.
- Use JS to find room data and render details.
- Render gallery with modal navigation (OOP Gallery class).
- Show amenities, features, booking button, etc.

### About, Amenities, Contact, Experiences, Experience Detail
- Similar structure: static HTML + JS to inject data and navigation/footer.
- Use JS classes for experiences and gallery if needed.

### NotFound (`404.html`)
- Simple static page with link back to home.

---

## 12. Utility JS
- Utility functions for parsing URL params, rendering templates, showing modals, etc.
- Use ES6 modules for code organization.

---

## 13. Accessibility & SEO
- Use semantic HTML tags.
- Add alt text to images.
- Use proper meta tags in HTML head.
- Ensure keyboard navigation for modals and galleries.

---

## 14. Testing & QA
- Test all pages and features for:
  - Correct data rendering
  - Responsive design
  - Modal/gallery navigation
  - Navigation between pages
  - Error handling
  - Accessibility

---

## 15. Final Review
- Compare new app with original React app for feature parity.
- Fix any missing features or design issues.
- Document any limitations or differences.

---

## 16. Deliverables
- `/index.html`, `/rooms.html`, `/room-detail.html`, etc.
- `/assets/` (images)
- `/js/` (OOP classes, utility functions)
- `/css/tailwind.css`
- This migration plan (`migration-plan.md`)

---

## 17. Notes
- No React, JSX, or TypeScript in final app.
- All interactivity via vanilla JS (OOP preferred).
- All styling via Tailwind CSS.
- All pages must be fully responsive and match the original app's look and feel.

---

**Following this plan will result in a static, responsive, OOP JS-powered web app that matches the current React app in design and functionality.**
