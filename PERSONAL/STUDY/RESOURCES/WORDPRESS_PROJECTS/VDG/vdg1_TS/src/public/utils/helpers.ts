export const changeActivePage = (offset: number) => {
  if (typeof window !== 'undefined') {
    const pages = Array.from(document.querySelectorAll('.page')),
      progress = document.querySelector('.progress-bar') as HTMLElement

    let index = 0
    const active = document.querySelector('.pages .page.active')
    index = pages.indexOf(active!)
    pages[index].classList.remove('active', 'animated', 'animated-left', 'animated-right')
    if (offset > 0) {
      index++
      progress.style.width = `${index * 25}%`
      pages[index].classList.add('active', 'animated-right')
    } else if (offset < 0) {
      index--
      progress.style.width = `${index * 25}%`
      pages[index].classList.add('active', 'animated-left')
    }
  }
}
