const mobileNavHandler = () => {
  const mobileNavigation = document.querySelector(".menu__icon");
  const menu = document.querySelector(".mobile--menu");
  const checkbox = document.querySelector(".menu__btn");

  //   Set attributes and use this to style the layout
  menu.setAttribute("data-expanded", "false");

  mobileNavigation.addEventListener("click", () => {
    if (menu.getAttribute("data-expanded") === "false") {
      menu.setAttribute("data-expanded", "true");
      checkbox.checked = true;
    } else {
      menu.setAttribute("data-expanded", "false");
      checkbox.checked = false;
    }
  });
};

export default {
  mobileNavHandler,
};
