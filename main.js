import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 1. Horizontal Scroll Timeline (Pins wrapper, scrubs canvas left)
const canvas = document.querySelector(".canvas");

// Calculate max scroll dynamically based on canvas and viewport width
let scrollMax = canvas.scrollWidth - window.innerWidth + 200;

const horizontalTween = gsap.to(canvas, {
  x: -scrollMax,
  ease: "none",
  scrollTrigger: {
    trigger: ".scroll-wrapper",
    pin: true,
    scrub: 1, // Smooth scrubbing
    end: () => "+=" + scrollMax // Maps 1px of horizontal movement to 1px of vertical scroll
  }
});

// 2. Hide scroll instruction when user begins scrolling
gsap.to(".scroll-instruction", {
  opacity: 0,
  y: 20,
  scrollTrigger: {
    trigger: "body",
    start: "top -50",
    end: "top -100",
    scrub: true
  }
});

// 3. Draw SVG Lines Interactively
const paths = document.querySelectorAll(".line-path");
paths.forEach((path) => {
  const length = path.getTotalLength();
  // Setup dash array to hide lines initially
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

  // Animate lines drawing in as they enter the screen horizontally
  gsap.to(path, {
    strokeDashoffset: 0,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: path,
      containerAnimation: horizontalTween,
      start: "left right-=200",
      end: "right center",
      scrub: true
    }
  });
});

// 4. Pop-in animations for Cards, Dots, and Buttons
const revealElements = document.querySelectorAll(".gs-reveal");
revealElements.forEach((el) => {
  gsap.from(el, {
    scale: 0,
    opacity: 0,
    rotation: el.classList.contains("plus-btn") ? -90 : 0,
    duration: 0.8,
    ease: "back.out(1.4)",
    scrollTrigger: {
      trigger: el,
      containerAnimation: horizontalTween,
      start: "left right-=150",
      toggleActions: "play none none reverse"
    }
  });
});

/* Modal interaction logic */
const modal = document.getElementById("infoModal");
const modalTitle = document.getElementById("modal-title");
const modalDetail = document.getElementById("modal-detail");
const closeBtn = document.querySelector(".close-btn");

document.querySelectorAll(".item").forEach(item => {
    item.addEventListener("click", () => {
        const titleEl = item.querySelector(".item-title");
        if (titleEl) {
            modalTitle.textContent = titleEl.textContent;
            modalDetail.innerHTML = item.getAttribute("data-detail");
            modal.classList.add("show");
        }
    });
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("show");
    }
});
