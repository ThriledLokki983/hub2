// Maintenance page functionality
// Import base styles for consistent theming
import './styles/base.scss';

// Theme functionality - identical to other pages for consistency
const storageKey = 'theme-preference';
const THEME_LIST = ['auto', 'light', 'dark', 'dim', 'grape', 'choco', 'navy'];

const getColorPreference = () => {
  if (localStorage.getItem(storageKey))
    return localStorage.getItem(storageKey)
  else
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const reflectPreference = () => {
  const theme = getColorPreference();
  document.firstElementChild?.setAttribute('color-scheme', theme || '');
  document.firstElementChild?.setAttribute('data-theme', theme || '');
};

// Initialize theme immediately
reflectPreference();

// Handle theme toggle functionality
const initializeThemeToggle = () => {
  const onClick = () => {
    const currentTheme = getColorPreference();
    const currentIndex = THEME_LIST.indexOf(currentTheme || 'auto');
    const nextTheme = THEME_LIST[(currentIndex + 1) % THEME_LIST.length || 0];
    
    localStorage.setItem(storageKey, nextTheme);
    reflectPreference();
    
    const themeToggle = document.querySelector('#theme-toggle');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', `Current theme: ${nextTheme}. Click to cycle to next theme.`);
      themeToggle.setAttribute('title', `Current theme: ${nextTheme}. Click to cycle themes.`);
    }
  }

  document?.querySelector('#theme-toggle')?.addEventListener('click', onClick);
  
  // Update initial aria-label
  const themeToggle = document.querySelector('#theme-toggle');
  const currentTheme = getColorPreference();
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', `Current theme: ${currentTheme}. Click to cycle to next theme.`);
    themeToggle.setAttribute('title', `Current theme: ${currentTheme}. Click to cycle themes.`);
  }
}

// Update return time dynamically
const updateReturnTime = () => {
  const returnTimeElement = document.getElementById('return-time');
  if (!returnTimeElement) return;
  
  // You can customize this logic based on your maintenance schedule
  const now = new Date();
  const returnTime = new Date(now.getTime() + (24 * 5 * 60 * 60 * 1000)); // 5 days from now
//  const returnTime = new Date(now.getTime() + (2 * 60 * 60 * 1000)); // 2 hours from now --- IGNORE ---
  
const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    year: 'numeric'
};
returnTimeElement.textContent = `Expected by ${returnTime.toLocaleDateString('gb-GB', dateOptions)}`;
}

// Add some interactive elements
const addInteractiveElements = () => {
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
      // Press 't' to toggle theme
      const themeToggle = document.querySelector('#theme-toggle') as HTMLButtonElement;
      if (themeToggle) {
        themeToggle.click();
      }
    }
  });
  
  // Add click effect to maintenance icon
  const maintenanceIcon = document.querySelector('.maintenance-icon') as HTMLElement;
  if (maintenanceIcon) {
    maintenanceIcon.addEventListener('click', () => {
      maintenanceIcon.style.transform = 'scale(0.95)';
      setTimeout(() => {
        maintenanceIcon.style.transform = '';
      }, 150);
    });
  }
}

// Initialize everything when DOM is ready
const initializePage = () => {
  initializeThemeToggle();
  updateReturnTime();
  addInteractiveElements();
  
  console.log('Maintenance page loaded successfully');
}

// Initialize after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}

// Sync with system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (getColorPreference() === 'auto') {
    reflectPreference();
  }
});

// Optional: Auto-refresh functionality (useful for when maintenance is complete)
// Uncomment the following if you want the page to check for site availability
/*
const checkSiteAvailability = async () => {
  try {
    const response = await fetch('/', { method: 'HEAD' });
    if (response.ok) {
      // Site is back online, redirect to main page
      window.location.href = '/';
    }
  } catch (error) {
    // Site is still under maintenance
    console.log('Site still under maintenance');
  }
}

// Check every 5 minutes
setInterval(checkSiteAvailability, 5 * 60 * 1000);
*/
