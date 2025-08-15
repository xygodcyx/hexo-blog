document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".header-anchor").forEach((anchor) => {
    const href = anchor.getAttribute("href");
    anchor.setAttribute("href", href[0] + href.slice(1).toLowerCase());
  });
});
