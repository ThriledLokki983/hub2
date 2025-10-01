import './styles/base.scss';
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = ``

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



setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
