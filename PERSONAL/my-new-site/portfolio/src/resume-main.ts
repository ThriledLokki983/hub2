import './styles/base.scss';
import { resumePage } from './components/resume';
import { RESUME_DATA } from './data/resume';
import { headerContent } from './components/header';
import { navigation } from './components/navigation';

// Theme functionality - needs to be loaded early
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

// Render critical content immediately
const renderCriticalContent = () => {
  // Render header
  const headerSection = document.getElementById('header');
  if (headerSection) {
    headerSection.innerHTML = headerContent;
  }

  // Render navigation with isProjectsPage parameter
  const navSection = document.getElementById('nav');
  if (navSection) {
    navSection.innerHTML = navigation(true); // true indicates this is a separate page
  }

  // Render resume
  const resumeSection = document.getElementById('resume');
  if (resumeSection) {
    resumeSection.innerHTML = resumePage(RESUME_DATA);
  }

  // Remove loading state
  const loading = document.getElementById('loading-resume');
  if (loading) {
    loading.remove();
  }
};

// Handle PDF download functionality
const initializePDFDownload = () => {
  const downloadBtn = document.getElementById('download-pdf');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      // Use browser's print functionality with print styles optimized for PDF
      window.print();
    });
  }
};

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

// Initialize the resume page
document.addEventListener('DOMContentLoaded', () => {
  renderCriticalContent();
});

// Handle interactions
const initializeInteractions = () => {
  // Initialize theme toggle
  initializeThemeToggle();
  
  // Initialize PDF download
  initializePDFDownload();
  
  // Add print event listener for better PDF generation
  window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
  });
  
  window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
  });
  
  console.log('Resume page loaded successfully');
};

// Initialize after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeInteractions);
} else {
  initializeInteractions();
}

// Sync with system changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (getColorPreference() === 'auto') {
    reflectPreference();
  }
});
