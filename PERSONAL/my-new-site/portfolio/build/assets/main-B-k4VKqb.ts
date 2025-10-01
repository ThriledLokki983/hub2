// Optimized imports - load critical components first
import './styles/base.scss';
import { headerContent } from './components/header.ts';
import { introContent } from './components/home.ts';
import { navigation } from './components/navigation.ts';
import Renderer from './components/utils.ts';

import { PROJECTS_DATA } from './data/projects.ts';

// Initialize renderer
const renderer = new Renderer();

// Critical content rendering - prioritize above-the-fold content
const renderCriticalContent = () => {
  renderer.render('header', headerContent);
  renderer.render('home', introContent);
  renderer.renderWithEvent('nav', navigation(), 'click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      const links = document.querySelectorAll('.nav__link');
      links.forEach(link => link.setAttribute('aria-selected', 'false'));
      target.setAttribute('aria-selected', 'true');
      
      // Get the target section for smooth scrolling
      const href = target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          targetSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    }
  });
};

// Lazy load non-critical components
const loadNonCriticalContent = async () => {
  // Dynamic imports for better code splitting
  const [
    { projectsPage },
    { experiencePage }, 
    { aboutPage },
    { contactPage }
  ] = await Promise.all([
    import('./components/projects.ts'),
    import('./components/experiences.ts'),
    import('./components/about.ts'),
    import('./components/contact.ts')
  ]);

  // Render non-critical content
  renderer.render('projects', projectsPage(PROJECTS_DATA));
  renderer.render('experience', experiencePage());
  renderer.render('about', aboutPage());
  renderer.render('contact', contactPage());
};

// Simple function to update active navigation link
const updateActiveNavigation = (activeId: string) => {
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.setAttribute('aria-selected', 'false');
    link.removeAttribute('aria-current');
  });
  
  const activeLink = document.querySelector(`a[href="#${activeId}"]`);
  if (activeLink) {
    activeLink.setAttribute('aria-selected', 'true');
    activeLink.setAttribute('aria-current', 'page');
  }
};

// Initialize active navigation state and scroll behavior
const initializeNavigation = () => {
  const sections = document.querySelectorAll('.content');
  const navLinks = document.querySelectorAll('.nav__link');

  if (sections.length === 0 || navLinks.length === 0) {
    // Retry if elements aren't ready yet
    setTimeout(initializeNavigation, 100);
    return;
  }

  // Set home as active initially
  updateActiveNavigation('home');

  // Scroll detection function
  const detectActiveSection = () => {
    const scrollY = window.scrollY;
    
    // If we're at the very top, always show home
    if (scrollY < 50) {
      updateActiveNavigation('home');
      return;
    }

    // Find the section that's most visible in the viewport
    let activeSection = 'home';
    let maxVisibleRatio = 0;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Calculate how much of the section is visible
      const visibleTop = Math.max(0, -rect.top);
      const visibleBottom = Math.max(0, rect.bottom - viewportHeight);
      const visibleHeight = sectionHeight - visibleTop - visibleBottom;
      const visibleRatio = visibleHeight / viewportHeight;
      
      if (visibleRatio > maxVisibleRatio && visibleHeight > 0) {
        maxVisibleRatio = visibleRatio;
        activeSection = section.id;
      }
    });
    
    updateActiveNavigation(activeSection);
  };

  // Use intersection observer for better performance
  const observerOptions = {
    threshold: [0.1, 0.3, 0.5, 0.7],
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver(() => {
    // Use the scroll detection as the primary method
    detectActiveSection();
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Also listen to scroll events with throttling
  let scrollTimeout: NodeJS.Timeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(detectActiveSection, 100);
  });

  // Initial detection
  setTimeout(detectActiveSection, 100);

  // Keyboard navigation for nav
  const navElement = document.getElementById('nav');
  if (navElement) {
    navElement.addEventListener('keydown', (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        target.click();
      }
    });
  }
};

// Performance-optimized initialization
const initializeApp = async () => {
  // 1. Render critical content immediately
  renderCriticalContent();
  
  // 2. Set initial state
  updateActiveNavigation('home');
  
  // 3. Initialize navigation system
  initializeNavigation();
  
  // 4. Load theme toggle lazily
  import('./components/toggle.ts');
  
  // 5. Load non-critical content after a short delay for better FCP
  const idleCallback = (window as any).requestIdleCallback || ((cb: Function) => setTimeout(cb, 1));
  idleCallback(() => {
    loadNonCriticalContent();
    
    // 6. Handle hash navigation after content is loaded
    handleHashNavigation();
  }, { timeout: 100 });
  
  // Ensure home section is visible (only if no hash is present)
  if (!window.location.hash) {
    const homeSection = document.querySelector('#home');
    if (homeSection) {
      homeSection.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
    
    // Force update navigation state after a short delay
    setTimeout(() => {
      updateActiveNavigation('home');
    }, 50);
  }
};

// Handle hash navigation (for links from projects page)
const handleHashNavigation = () => {
  const hash = window.location.hash;
  if (hash) {
    const targetId = hash.substring(1); // Remove the # symbol
    const targetSection = document.querySelector(`#${targetId}`);
    
    if (targetSection) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        targetSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        updateActiveNavigation(targetId);
      }, 300);
    }
  }
};

// Listen for hash changes (when user uses browser back/forward)
window.addEventListener('hashchange', handleHashNavigation);

// Start initialization immediately - don't wait for DOM
initializeApp();

// Fallback initialization for older browsers
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

const switcher = document.querySelector('#theme-switcher')
const doc = document.firstElementChild

if (switcher) {
  switcher.addEventListener('input', e =>
    setTheme((e.target as HTMLInputElement).value))
}

const setTheme = (theme: string) => {
  if (doc) {
    doc.setAttribute('color-scheme', theme)
  }
}
