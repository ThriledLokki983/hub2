import './styles/base.scss';
import { allProjectsPage } from './components/projects';
import { PROJECTS_DATA } from './data/projects';
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

  // Render navigation
  const navSection = document.getElementById('nav');
  if (navSection) {
    navSection.innerHTML = navigation(true); // Pass true to indicate this is the projects page
  }

  // Render all projects
  const projectsSection = document.getElementById('projects');
  if (projectsSection) {
    projectsSection.innerHTML = allProjectsPage(PROJECTS_DATA);
  }

  // Remove loading state
  const loading = document.getElementById('loading-projects');
  if (loading) {
    loading.remove();
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

// Initialize the projects page
document.addEventListener('DOMContentLoaded', () => {
  renderCriticalContent();
});

// Handle theme toggle and other interactions
const initializeInteractions = () => {
  // Initialize theme toggle
  initializeThemeToggle();
  
  // Set projects navigation as active since we're on the projects page
  const projectsNavLink = document.querySelector('a[href="/#projects"]');
  if (projectsNavLink) {
    // Remove active state from all nav links
    const allNavLinks = document.querySelectorAll('.nav__link');
    allNavLinks.forEach(link => {
      link.setAttribute('aria-selected', 'false');
      link.removeAttribute('aria-current');
    });
    
    // Set projects link as active
    projectsNavLink.setAttribute('aria-selected', 'true');
    projectsNavLink.setAttribute('aria-current', 'page');
  }
  
  console.log('Projects page loaded successfully');
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
