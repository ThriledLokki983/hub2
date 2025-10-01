const storageKey = 'theme-preference';
const THEME_LIST = ['auto', 'light', 'dark', 'dim', 'grape', 'choco', 'navy'];

const onClick = () => {
  theme.value = THEME_LIST[(THEME_LIST.indexOf(theme.value || 'auto') + 1) % THEME_LIST.length || 0];
  setPreference();
}

const getColorPreference = () => {
  if (localStorage.getItem(storageKey))
    return localStorage.getItem(storageKey)
  else
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const setPreference = () => {
  localStorage.setItem(storageKey, theme.value || '');
  reflectPreference();
}

const reflectPreference = () => {
  document.firstElementChild?.setAttribute('color-scheme', theme.value || '');
  const themeToggle = document.querySelector('#theme-toggle');
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', `Current theme: ${theme.value}. Click to cycle to next theme.`);
    themeToggle.setAttribute('title', `Current theme: ${theme.value}. Click to cycle themes.`);
  }
};

const theme = {
  value: getColorPreference(),
}

reflectPreference();

window.onload = () => {
  reflectPreference()
  document?.querySelector('#theme-toggle')?.addEventListener('click', onClick)
}

// sync with system changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({matches:isDark}) => {
  theme.value = isDark ? 'dark' : 'light'
  setPreference()
});