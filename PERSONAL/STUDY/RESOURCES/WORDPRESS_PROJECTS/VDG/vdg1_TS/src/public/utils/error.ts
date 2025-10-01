// select notification-box from the document
let notificationBox,
  // success,
  notificationBoxMessage,
  // successNotificationBoxMessage,
  goHome
if (typeof window !== 'undefined') {
  notificationBox = document.querySelector('.notification-box') as HTMLDivElement

  // select success__message 'div' from the document
  // success = document.querySelector('.notification-box-success') as HTMLDivElement

  // select notification-box-content from the document
  notificationBoxMessage = document.querySelector(
    '.notification-box__content .message'
  ) as HTMLDivElement

  // successNotificationBoxMessage = document.querySelector(
  //   '.notification-box__content-success .success-message'
  // ) as HTMLDivElement

  goHome = document.querySelector('[data-goto-homepage]') as HTMLButtonElement

  goHome &&
    goHome.addEventListener('click', () => {
      window.location.href = '/'
    })
}

// function to handle displaying the error message
export function displayErrorOrSuccessMessage(
  message: string = '',
  display: boolean = true,
  messageType: string = 'error'
) {
  if (!display) {
    // notificationBox ? (notificationBox.style.display = 'none') : ''
    // success.style.display = 'none'
  } else {
    if (messageType === 'success') {
      // success.style.display = 'block'
    } else {
      notificationBox.style.display = 'block'
      if (message.includes('Request failed with status code 401')) {
        notificationBoxMessage
          ? (notificationBoxMessage.innerHTML = 'Please Get a new Access Token!')
          : ''
      } else if (message.includes('500')) {
        notificationBoxMessage
          ? (notificationBoxMessage.innerHTML =
              'Internal server error - Please try again later')
          : ''
      } else {
        notificationBoxMessage ? (notificationBoxMessage.innerHTML = message) : ''
      }
    }
  }
}
