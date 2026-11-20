"use strict";

/**
 * 1. PORTFOLIO DATA
 * Add Harshil's real projects here. Leave empty [] to show the clean empty state.
 * Example entry:
 * {
 *   title: "Project Title",
 *   category: "Video", // "Video" | "Photo" | "Reels" | "Creative"
 *   image: "assets/images/project-01.webp",
 *   video: "assets/videos/project-01.mp4", // Optional; omit for photo-only items
 *   description: "Short project description.",
 *   tools: ["Adobe Premiere Pro", "DaVinci Resolve"]
 * }
 */
const projects = [];

/**
 * 2. BEFORE / AFTER DATA
 * Add paired photo-editing examples here. When empty [], the section stays hidden.
 * Example entry:
 * {
 *   title: "Color & Retouching Study",
 *   before: "assets/images/before-01.webp",
 *   after: "assets/images/after-01.webp",
 *   altBefore: "Original unedited photograph",
 *   altAfter: "Color graded and retouched photograph"
 * }
 */
const beforeAfterItems = [];

/**
 * 3. SOFTWARE & TOOLS DATA
 * Update or remove tools to match Harshil's exact active software workflow.
 */
const tools = [
  {
    code: "Pr",
    name: "Adobe Premiere Pro",
    description: "Video editing and timeline-based production.",
  },
  {
    code: "Ps",
    name: "Adobe Photoshop",
    description: "Photo retouching, compositing, and creative manipulation.",
  },
  {
    code: "Ae",
    name: "Adobe After Effects",
    description: "Motion graphics, transitions, and visual effects.",
  },
  {
    code: "Lr",
    name: "Adobe Lightroom",
    description: "Color correction, tonal balance, and photo grading.",
  },
  {
    code: "DR",
    name: "DaVinci Resolve",
    description: "Color grading, finishing, and video post-production.",
  },
  {
    code: "CC",
    name: "CapCut",
    description: "Fast-paced short-form edits and social media reels.",
  },
];

/**
 * 4. SOCIAL LINKS
 * Replace null with actual profile URLs when ready.
 */
const socialLinks = [
  {
    label: "Instagram",
    url: "https://www.instagram.com/harshil_amreliya_12?gwpx=MWVrMG1xaWNnMGlweQ==",
    icon: "instagram",
  },
  {
    label: "YouTube",
    url: "https://youtube.com/@movieinfo32?si=_sRtm6z7NfhBN4g6",
    icon: "youtube",
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/harshilamreliya12",
    icon: "linkedin",
  },
];

/* Accepts a local MP4 path or a YouTube link (youtu.be, watch?v=, embed, shorts). */
const SHOWREEL_SRC = "Public/BHRAMKAAL.mp4";

/* ==========================================================================
   DOM References & State
   ========================================================================== */
const header = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
const navLinks = document.querySelectorAll(".nav-link");

const toolsGrid = document.getElementById("tools-grid");
const portfolioGrid = document.getElementById("portfolio-grid");
const filterBtns = document.querySelectorAll(".filter-btn");
const beforeAfterSection = document.getElementById("before-after-section");
const baContainer = document.getElementById("ba-container");

const videoModal = document.getElementById("video-modal");
const videoPlayer = document.getElementById("modal-video-player");
const youtubePlayer = document.getElementById("modal-youtube-player");
const videoFallback = document.getElementById("video-fallback");
const videoFallbackMsg = document.getElementById("video-fallback-msg");
const videoModalTitle = document.getElementById("video-modal-title");
const videoModalCategory = document.getElementById("video-modal-category");
const videoModalDesc = document.getElementById("video-modal-desc");
const videoModalTools = document.getElementById("video-modal-tools");
const videoModalClose = document.getElementById("video-modal-close");

const imageLightbox = document.getElementById("image-lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxFallback = document.getElementById("lightbox-fallback");
const lightboxCategory = document.getElementById("lightbox-category");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxDesc = document.getElementById("lightbox-desc");
const lightboxTools = document.getElementById("lightbox-tools");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
const lightboxClose = document.getElementById("lightbox-close");

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const toastEl = document.getElementById("toast");

let activeFilter = "All";
let photoGalleryItems = [];
let currentLightboxIndex = 0;
let lastFocusedEl = null;
let toastTimer = null;

/* ==========================================================================
   Utilities
   ========================================================================== */
function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.hidden = true;
  }, 3200);
}

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (typeof text === "string") el.textContent = text;
  return el;
}

/* ==========================================================================
   Navbar Scroll & Mobile Menu
   ========================================================================== */
function handleScroll() {
  if (!header) return;
  if (window.scrollY > 36) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

function setMobileMenuOpen(isOpen) {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  mobileMenu.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("modal-open", isOpen);
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMobileMenuOpen(!isOpen);
  });
}

mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => setMobileMenuOpen(false));
});

/* Active Section Highlight */
const sectionElements = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window && sectionElements.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`,
          );
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px" },
  );
  sectionElements.forEach((sec) => navObserver.observe(sec));
}

/* ==========================================================================
   Render Software / Tools
   ========================================================================== */
function renderTools() {
  if (!toolsGrid) return;
  toolsGrid.innerHTML = "";
  tools.forEach((tool) => {
    const card = createEl("article", "tool-card");
    const badge = createEl("div", "tool-badge", tool.code);
    badge.setAttribute("aria-hidden", "true");

    const body = createEl("div");
    body.appendChild(createEl("h4", "tool-name", tool.name));
    body.appendChild(createEl("p", "tool-desc", tool.description));

    card.appendChild(badge);
    card.appendChild(body);
    toolsGrid.appendChild(card);
  });
}

/* ==========================================================================
   Render Portfolio & Filtering
   ========================================================================== */
function renderPortfolio(filterCategory = "All") {
  if (!portfolioGrid) return;
  activeFilter = filterCategory;
  portfolioGrid.innerHTML = "";

  const filtered =
    filterCategory === "All"
      ? projects
      : projects.filter(
          (item) =>
            item.category.toLowerCase() === filterCategory.toLowerCase(),
        );

  if (!filtered.length) {
    const empty = createEl("div", "portfolio-empty");
    const iconWrap = createEl("div", "empty-icon");
    iconWrap.innerHTML =
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>';

    empty.appendChild(iconWrap);
    empty.appendChild(
      createEl("h3", "empty-title", "Portfolio Coming Together"),
    );
    empty.appendChild(
      createEl(
        "p",
        "empty-desc",
        "Selected creative work will be showcased here soon.",
      ),
    );

    const cta = createEl("a", "btn btn-secondary", "Request Work Samples");
    cta.href = "#contact";
    empty.appendChild(cta);

    portfolioGrid.appendChild(empty);
    return;
  }

  photoGalleryItems = filtered.filter((p) => !p.video);

  filtered.forEach((project) => {
    const card = createEl("article", "portfolio-card");
    const media = createEl("div", "card-media");

    const img = createEl("img");
    img.src = project.image;
    img.alt = `${project.title} — ${project.category}`;
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", () => {
      img.style.display = "none";
    });
    media.appendChild(img);

    if (project.video) {
      const playBadge = createEl("span", "card-play-badge");
      playBadge.setAttribute("aria-hidden", "true");
      playBadge.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
      media.appendChild(playBadge);
    }

    const body = createEl("div", "card-body");
    body.appendChild(createEl("span", "card-category", project.category));
    body.appendChild(createEl("h3", "card-title", project.title));
    body.appendChild(createEl("p", "card-desc", project.description));

    if (Array.isArray(project.tools) && project.tools.length) {
      const toolsWrap = createEl("div", "card-tools");
      project.tools.forEach((t) =>
        toolsWrap.appendChild(createEl("span", "", t)),
      );
      body.appendChild(toolsWrap);
    }

    const actionBtn = createEl("button", "card-action");
    actionBtn.type = "button";
    actionBtn.innerHTML =
      '<span>View Project</span><span aria-hidden="true">&rarr;</span>';
    actionBtn.addEventListener("click", () => {
      if (project.video) {
        openVideoModal(project);
      } else {
        const idx = photoGalleryItems.indexOf(project);
        openLightbox(idx >= 0 ? idx : 0);
      }
    });

    body.appendChild(actionBtn);
    card.appendChild(media);
    card.appendChild(body);
    portfolioGrid.appendChild(card);
  });
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    renderPortfolio(btn.dataset.filter || "All");
  });
});

/* ==========================================================================
   Before / After Slider
   ========================================================================== */
function renderBeforeAfter() {
  if (!beforeAfterSection || !baContainer) return;
  if (!beforeAfterItems.length) {
    beforeAfterSection.hidden = true;
    return;
  }

  beforeAfterSection.hidden = false;
  baContainer.innerHTML = "";

  beforeAfterItems.forEach((item) => {
    const slider = createEl("div", "ba-slider");
    slider.tabIndex = 0;
    slider.setAttribute("role", "slider");
    slider.setAttribute(
      "aria-label",
      `${item.title} before and after comparison`,
    );
    slider.setAttribute("aria-valuemin", "0");
    slider.setAttribute("aria-valuemax", "100");
    slider.setAttribute("aria-valuenow", "50");

    const afterImg = createEl("img");
    afterImg.src = item.after;
    afterImg.alt = item.altAfter || `${item.title} edited`;

    const beforeWrap = createEl("div", "ba-before-wrap");
    const beforeImg = createEl("img");
    beforeImg.src = item.before;
    beforeImg.alt = item.altBefore || `${item.title} original`;
    beforeWrap.appendChild(beforeImg);

    const divider = createEl("div", "ba-divider");
    const handle = createEl("div", "ba-handle", "↔");
    divider.appendChild(handle);

    const labelBefore = createEl(
      "span",
      "ba-label ba-label-before",
      "Original",
    );
    const labelAfter = createEl("span", "ba-label ba-label-after", "Edited");

    slider.appendChild(afterImg);
    slider.appendChild(beforeWrap);
    slider.appendChild(divider);
    slider.appendChild(labelBefore);
    slider.appendChild(labelAfter);

    const updateSplit = (pct) => {
      const clamped = Math.max(0, Math.min(100, pct));
      beforeWrap.style.width = `${clamped}%`;
      divider.style.left = `${clamped}%`;
      slider.setAttribute("aria-valuenow", String(Math.round(clamped)));
    };

    let dragging = false;
    const handlePointer = (clientX) => {
      const rect = slider.getBoundingClientRect();
      if (!rect.width) return;
      updateSplit(((clientX - rect.left) / rect.width) * 100);
    };

    slider.addEventListener("pointerdown", (e) => {
      dragging = true;
      slider.setPointerCapture(e.pointerId);
      handlePointer(e.clientX);
    });
    slider.addEventListener("pointermove", (e) => {
      if (dragging) handlePointer(e.clientX);
    });
    slider.addEventListener("pointerup", () => {
      dragging = false;
    });
    slider.addEventListener("keydown", (e) => {
      const current = Number(slider.getAttribute("aria-valuenow") || 50);
      if (e.key === "ArrowLeft") updateSplit(current - 5);
      if (e.key === "ArrowRight") updateSplit(current + 5);
    });

    baContainer.appendChild(slider);
  });
}

/* ==========================================================================
   Video Modal (Showreel + Video Projects)
   ========================================================================== */
function getYouTubeId(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url, window.location.href);
    const host = parsed.hostname.replace(/^(www|m)\./, "");
    if (host === "youtu.be") {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
      const match = parsed.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/);
      return match ? match[1] : null;
    }
  } catch (err) {
    return null;
  }
  return null;
}

function openVideoModal({
  title,
  category,
  description,
  tools: itemTools = [],
  video,
}) {
  if (!videoModal || !videoPlayer) return;
  lastFocusedEl = document.activeElement;

  videoModalCategory.textContent = category || "Video";
  videoModalTitle.textContent = title || "Video Preview";
  videoModalDesc.textContent = description || "";

  videoModalTools.innerHTML = "";
  itemTools.forEach((t) =>
    videoModalTools.appendChild(createEl("span", "", t)),
  );

  videoFallback.hidden = true;

  const youtubeId = getYouTubeId(video);
  if (youtubeId && youtubePlayer) {
    videoPlayer.onerror = null;
    videoPlayer.pause();
    videoPlayer.hidden = true;
    youtubePlayer.title = title || "Video player";
    youtubePlayer.src = `https://www.youtube.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    youtubePlayer.hidden = false;
  } else {
    if (youtubePlayer) {
      youtubePlayer.hidden = true;
      youtubePlayer.removeAttribute("src");
    }
    videoPlayer.hidden = false;
    videoPlayer.muted = true;
    videoPlayer.src = video || "";

    videoPlayer.onerror = () => {
      videoPlayer.hidden = true;
      videoFallback.hidden = false;
      videoFallbackMsg.textContent = `Media file (${video}) is not yet available. Replace the placeholder path with your MP4 file to enable playback.`;
    };
  }

  videoModal.hidden = false;
  document.body.classList.add("modal-open");
  videoModalClose.focus();
}

function closeVideoModal() {
  if (!videoModal || videoModal.hidden) return;
  videoPlayer.pause();
  videoPlayer.removeAttribute("src");
  videoPlayer.load();
  if (youtubePlayer) {
    youtubePlayer.removeAttribute("src");
    youtubePlayer.hidden = true;
  }
  videoModal.hidden = true;
  document.body.classList.remove("modal-open");
  if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
    lastFocusedEl.focus();
  }
}

const showreelTriggers = [
  document.getElementById("play-showreel-btn"),
  document.getElementById("hero-showreel-trigger"),
];

showreelTriggers.forEach((trigger) => {
  if (!trigger) return;
  trigger.addEventListener("click", () => {
    openVideoModal({
      title: "Harshil Amreliya — Showreel",
      category: "Showreel",
      description:
        "Video editing, pacing, transitions, color grading, and visual storytelling.",
      tools: ["Video Editing", "Color Grading", "Visual Storytelling"],
      video: SHOWREEL_SRC,
    });
  });
});

if (videoModalClose) {
  videoModalClose.addEventListener("click", closeVideoModal);
}

/* ==========================================================================
   Image Lightbox (Keyboard + Touch Swipe)
   ========================================================================== */
function renderLightboxSlide(index) {
  if (!photoGalleryItems.length) return;
  currentLightboxIndex =
    (index + photoGalleryItems.length) % photoGalleryItems.length;
  const item = photoGalleryItems[currentLightboxIndex];

  lightboxFallback.hidden = true;
  lightboxImg.hidden = false;
  lightboxImg.src = item.image;
  lightboxImg.alt = item.title;

  lightboxImg.onerror = () => {
    lightboxImg.hidden = true;
    lightboxFallback.hidden = false;
  };

  lightboxCategory.textContent = item.category || "Photo";
  lightboxTitle.textContent = item.title || "";
  lightboxDesc.textContent = item.description || "";

  lightboxTools.innerHTML = "";
  (item.tools || []).forEach((t) =>
    lightboxTools.appendChild(createEl("span", "", t)),
  );

  const showNav = photoGalleryItems.length > 1;
  lightboxPrev.hidden = !showNav;
  lightboxNext.hidden = !showNav;
}

function openLightbox(index) {
  if (!imageLightbox || !photoGalleryItems.length) return;
  lastFocusedEl = document.activeElement;
  renderLightboxSlide(index);
  imageLightbox.hidden = false;
  document.body.classList.add("modal-open");
  lightboxClose.focus();
}

function closeLightbox() {
  if (!imageLightbox || imageLightbox.hidden) return;
  imageLightbox.hidden = true;
  document.body.classList.remove("modal-open");
  if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
    lastFocusedEl.focus();
  }
}

if (lightboxPrev)
  lightboxPrev.addEventListener("click", () =>
    renderLightboxSlide(currentLightboxIndex - 1),
  );
if (lightboxNext)
  lightboxNext.addEventListener("click", () =>
    renderLightboxSlide(currentLightboxIndex + 1),
  );
if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

let touchStartX = 0;
if (imageLightbox) {
  imageLightbox.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true },
  );

  imageLightbox.addEventListener(
    "touchend",
    (e) => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 45) {
        renderLightboxSlide(currentLightboxIndex + (delta < 0 ? 1 : -1));
      }
    },
    { passive: true },
  );
}

/* Backdrop & Global Keyboard Controls */
document.querySelectorAll("[data-close-modal]").forEach((backdrop) => {
  backdrop.addEventListener("click", () => {
    const target = backdrop.dataset.closeModal;
    if (target === "video-modal") closeVideoModal();
    if (target === "image-lightbox") closeLightbox();
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (mobileMenu && mobileMenu.classList.contains("is-open"))
      setMobileMenuOpen(false);
    closeVideoModal();
    closeLightbox();
  }
  if (imageLightbox && !imageLightbox.hidden) {
    if (e.key === "ArrowLeft") renderLightboxSlide(currentLightboxIndex - 1);
    if (e.key === "ArrowRight") renderLightboxSlide(currentLightboxIndex + 1);
  }
});

/* ==========================================================================
   Social Links
   ========================================================================== */
const SOCIAL_ICONS = {
  instagram:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  youtube:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>',
  linkedin:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
};

function renderSocialLinks(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  socialLinks.forEach((item) => {
    if (item.url) {
      const a = createEl("a", "social-link");
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", `${item.label} profile`);
      a.innerHTML = SOCIAL_ICONS[item.icon] || "";
      container.appendChild(a);
    } else {
      const btn = createEl("button", "social-link");
      btn.type = "button";
      btn.setAttribute("aria-label", `${item.label} (link pending)`);
      btn.innerHTML = SOCIAL_ICONS[item.icon] || "";
      btn.addEventListener("click", () => {
        showToast(
          `${item.label} link pending — add your profile URL in js/script.js.`,
        );
      });
      container.appendChild(btn);
    }
  });
}

/* ==========================================================================
   Contact Form Validation & Formspree Submission
   ========================================================================== */
function setFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
  if (error) error.textContent = message || "";
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const subject = document.getElementById("contact-subject").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    let valid = true;

    if (!name) {
      setFieldError("contact-name", "error-name", "Please enter your name.");
      valid = false;
    } else {
      setFieldError("contact-name", "error-name", "");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setFieldError(
        "contact-email",
        "error-email",
        "Please enter your email address.",
      );
      valid = false;
    } else if (!emailPattern.test(email)) {
      setFieldError(
        "contact-email",
        "error-email",
        "Please enter a valid email address.",
      );
      valid = false;
    } else {
      setFieldError("contact-email", "error-email", "");
    }

    if (!subject) {
      setFieldError(
        "contact-subject",
        "error-subject",
        "Please enter a subject.",
      );
      valid = false;
    } else {
      setFieldError("contact-subject", "error-subject", "");
    }

    if (!message) {
      setFieldError(
        "contact-message",
        "error-message",
        "Please enter your message.",
      );
      valid = false;
    } else {
      setFieldError("contact-message", "error-message", "");
    }

    if (!valid) {
      formStatus.textContent = "Please fix the highlighted fields above.";
      formStatus.className = "form-status is-error";
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.querySelector("span") : null;
    const originalLabel = submitLabel ? submitLabel.textContent : "";

    const setSending = (sending) => {
      if (!submitBtn) return;
      submitBtn.disabled = sending;
      submitBtn.setAttribute("aria-busy", sending ? "true" : "false");
      if (submitLabel) {
        submitLabel.textContent = sending ? "Sending..." : originalLabel;
      }
    };

    const formData = new FormData(contactForm);
    formData.set("_subject", subject);

    setSending(true);
    formStatus.textContent = "Sending your inquiry...";
    formStatus.className = "form-status";

    fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          contactForm.reset();
          formStatus.textContent =
            "Thank you! Your inquiry has been sent. Harshil will get back to you soon.";
          formStatus.className = "form-status is-success";
          showToast("Message sent successfully.");
          return;
        }
        return response
          .json()
          .catch(() => ({}))
          .then((data) => {
            const detail =
              data && Array.isArray(data.errors) && data.errors.length
                ? data.errors.map((err) => err.message).join(", ")
                : "";
            throw new Error(detail || "Form submission failed.");
          });
      })
      .catch(() => {
        formStatus.textContent =
          "Sorry, your message could not be sent. Please try again or email harshilamreliya09@gmail.com directly.";
        formStatus.className = "form-status is-error";
      })
      .finally(() => {
        setSending(false);
      });
  });
}

/* ==========================================================================
   Scroll Reveal (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  revealEls.forEach((el) => revealObserver.observe(el));
}

/* ==========================================================================
   Initialize
   ========================================================================== */
window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();
renderTools();
renderPortfolio("All");
renderBeforeAfter();
renderSocialLinks("contact-social");
renderSocialLinks("footer-social");
initScrollReveal();
