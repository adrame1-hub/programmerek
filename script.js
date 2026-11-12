
document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Header transparent au départ, opaque au défilement
  const header = document.querySelector("#header");

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Menu mobile
  const menuToggle = document.querySelector("#menu-toggle");
  const navLinks = document.querySelector("#nav-links");
  const navItems = document.querySelectorAll(".nav-link");

  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
  }

  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Ouvrir le menu" : "Fermer le menu"
    );

    navLinks.classList.toggle("open", !open);
  });

  navItems.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", event => {
    if (
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // Texte animé
  const typedText = document.querySelector("#typed-text");

  const roles = [
    "étudiant en informatique",
    "passionné de programmation",
    "apprenant développeur web",
    "futur ingénieur informatique"
  ];

  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = false;
  let typingTimer;

  function typeWriter() {
    const role = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      typedText.textContent = role.slice(0, charIndex);

      if (charIndex >= role.length) {
        deleting = true;
        typingTimer = setTimeout(typeWriter, 1500);
        return;
      }

      typingTimer = setTimeout(typeWriter, 70);
    } else {
      charIndex--;
      typedText.textContent = role.slice(0, charIndex);

      if (charIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingTimer = setTimeout(typeWriter, 350);
        return;
      }

      typingTimer = setTimeout(typeWriter, 35);
    }
  }

  if (reducedMotion) {
    typedText.textContent = roles[0];
  } else {
    typingTimer = setTimeout(typeWriter, 700);
  }

  // Apparition des éléments au défilement
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    });

    revealElements.forEach(element => revealObserver.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add("visible"));
  }

  // Mettre en évidence la section active dans la navigation
  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const activeId = entry.target.id;

        navItems.forEach(link => {
          const active = link.getAttribute("href") === `#${activeId}`;

          link.classList.toggle("active", active);

          if (active) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, {
      rootMargin: "-25% 0px -60% 0px"
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Année automatique dans le footer
  document.querySelector("#year").textContent =
    new Date().getFullYear();
});
