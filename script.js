/* ==========================================================================
   Mad Over Buildings (MOB) - Interactive Scripting
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initCursorGlow();
  initMobileMenu();
  initScrollReveal();
  initStatsCounters();
  initDragAndDrop();
  initCatalogGate();
  initScrollProgress();
  initTypewriter();
  initHeroCanvas();
  initActiveNavOnScroll();
  initAuroraCanvas();
});

/* ── Custom Mouse Glow Coordinator ── */
function initCursorGlow() {
  const glow = document.getElementById("cursorGlow");
  if (!glow) return;

  document.addEventListener("mousemove", (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

/* ── Mobile Navigation Menu Toggles ── */
function initMobileMenu() {
  const toggle = document.getElementById("mobileToggle");
  const menu = document.getElementById("navMenu");
  const links = document.querySelectorAll(".nav-link");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    menu.classList.toggle("open");
  });

  links.forEach(link => {
    link.addEventListener("click", () => {
      toggle.classList.remove("open");
      menu.classList.remove("open");
      
      // Update active state
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

/* ── Smooth Scroll helper ── */
function scrollToElement(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  
  const headerOffset = 80;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
  });
}

/* ── Intersection Scroll Reveal ── */
function initScrollReveal() {
  const reveals = document.querySelectorAll(".scroll-reveal");
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  reveals.forEach(el => revealObserver.observe(el));
}

/* ── Statistics Count-Up Animation ── */
function initStatsCounters() {
  const stats = document.querySelectorAll(".stat-num");
  if (stats.length === 0) return;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const val = parseInt(target.getAttribute("data-val"), 10);
        animateCounter(target, val);
        countObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(s => countObserver.observe(s));
}

function animateCounter(element, targetVal) {
  let current = 0;
  const duration = 1500; // ms
  const stepTime = Math.abs(Math.floor(duration / targetVal));
  const stepIncrement = Math.ceil(targetVal / 100);

  const timer = setInterval(() => {
    current += stepIncrement;
    if (current >= targetVal) {
      element.textContent = targetVal;
      clearInterval(timer);
    } else {
      element.textContent = current;
    }
  }, Math.max(stepTime, 15));
}

/* ── Drag & Drop File Listeners (BOQ cards) ── */
let heroUploadedFile = null;
let formUploadedFile = null;

function initDragAndDrop() {
  const heroZone = document.getElementById("heroDragDropZone");
  const heroInput = document.getElementById("heroFileInput");
  const formZone = document.getElementById("formDragDropZone");
  const formInput = document.getElementById("formFileInput");

  // Hero Drop Zone Events
  if (heroZone && heroInput) {
    heroZone.addEventListener("click", () => heroInput.click());
    
    heroInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        handleHeroFileSelect(e.target.files[0]);
      }
    });

    configureDragEvents(heroZone, handleHeroFileSelect);
  }

  // RFQ Form Drop Zone Events
  if (formZone && formInput) {
    formZone.addEventListener("click", () => formInput.click());
    
    formInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        handleFormFileSelect(e.target.files[0]);
      }
    });

    configureDragEvents(formZone, handleFormFileSelect);
  }
}

function configureDragEvents(zone, fileHandler) {
  ["dragenter", "dragover"].forEach(eventName => {
    zone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      zone.classList.add("drag-over");
    }, false);
  });

  ["dragleave", "drop"].forEach(eventName => {
    zone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      zone.classList.remove("drag-over");
    }, false);
  });

  zone.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      fileHandler(files[0]);
    }
  }, false);
}

function handleHeroFileSelect(file) {
  heroUploadedFile = file;
  const indicator = document.getElementById("heroFileIndicator");
  const fileNameSpan = document.getElementById("heroFileName");
  const zone = document.getElementById("heroDragDropZone");

  if (indicator && fileNameSpan && zone) {
    fileNameSpan.textContent = file.name;
    zone.style.display = "none";
    indicator.style.display = "flex";
  }
}

function clearHeroFile() {
  heroUploadedFile = null;
  const indicator = document.getElementById("heroFileIndicator");
  const zone = document.getElementById("heroDragDropZone");
  const input = document.getElementById("heroFileInput");

  if (indicator && zone) {
    zone.style.display = "block";
    indicator.style.display = "none";
  }
  if (input) input.value = "";
}

function handleFormFileSelect(file) {
  formUploadedFile = file;
  const indicator = document.getElementById("formFileIndicator");
  const fileNameSpan = document.getElementById("formFileName");
  const zone = document.getElementById("formDragDropZone");

  if (indicator && fileNameSpan && zone) {
    fileNameSpan.textContent = file.name;
    zone.style.display = "none";
    indicator.style.display = "flex";
  }
}

function clearFormFile() {
  formUploadedFile = null;
  const indicator = document.getElementById("formFileIndicator");
  const zone = document.getElementById("formDragDropZone");
  const input = document.getElementById("formFileInput");

  if (indicator && zone) {
    zone.style.display = "flex";
    indicator.style.display = "none";
  }
  if (input) input.value = "";
}

/* ── Hero BOQ Submission ── */
function submitHeroBOQ() {
  const phoneInput = document.getElementById("heroMobileNo");
  if (!phoneInput) return;

  const phone = phoneInput.value.trim();
  const phonePattern = /^[6-9]\d{9}$/;

  if (!phonePattern.test(phone)) {
    showToast("Please enter a valid 10-digit mobile number.", true);
    return;
  }

  const fileName = heroUploadedFile ? heroUploadedFile.name : "None (Text Inquiry)";
  
  // WhatsApp Prefilled Compiler
  const message = `Hi MOB Team,

I've uploaded my BOQ for project sourcing.
Mobile Number: ${phone}
File Attached: ${fileName}

Please contact me with a quote.`;

  const encodedMsg = encodeURIComponent(message);
  const waUrl = `https://wa.me/918660423608?text=${encodedMsg}`;
  
  showToast("BOQ submitted! Redirecting to WhatsApp...");
  setTimeout(() => {
    window.open(waUrl, "_blank");
  }, 1000);
}

/* ── Detailed RFQ Form Submission ── */
function submitDetailedRfq(event) {
  event.preventDefault();

  const materials = document.getElementById("rfqMaterials").value.trim();
  const quantity = document.getElementById("rfqQuantity").value.trim();
  const location = document.getElementById("rfqLocation").value.trim();
  const mobile = document.getElementById("rfqMobile").value.trim();
  const file = formUploadedFile ? formUploadedFile.name : "No file attached";

  const phonePattern = /^[6-9]\d{9}$/;
  if (!phonePattern.test(mobile)) {
    showToast("Please enter a valid 10-digit mobile number.", true);
    return;
  }

  const message = `Hi MOB Team,

I need a quotation for construction materials.

Project Location: ${location}
Required Products: ${materials}
Approximate Quantity: ${quantity}
Mobile Number: ${mobile}
BOQ Attachment: ${file}

Please contact me.`;

  const encodedMsg = encodeURIComponent(message);
  const waUrl = `https://wa.me/918660423608?text=${encodedMsg}`;

  showToast("Quotation request compiled! Opening WhatsApp...");
  
  // Reset Form
  document.getElementById("detailedRfqForm").reset();
  clearFormFile();

  setTimeout(() => {
    window.open(waUrl, "_blank");
  }, 1000);
}

/* ── Trigger RFQ preset inputs ── */
function triggerRFQ(presetText) {
  scrollToElement("#rfq-section");
  const textarea = document.getElementById("rfqMaterials");
  if (textarea) {
    textarea.value = `Quotation request for: ${presetText}. Include wholesale brand options.`;
    textarea.focus();
  }
}

/* ── Brand Filter (Wholesaler Wall) ── */
function filterBrands(category) {
  const cards = document.querySelectorAll(".brand-card-item");
  const buttons = document.querySelectorAll(".brand-filter-btn");

  buttons.forEach(btn => {
    if (btn.textContent.toLowerCase().includes(category) || (category === "all" && btn.textContent.toLowerCase() === "all brands")) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  cards.forEach(card => {
    const cat = card.getAttribute("data-cat");
    if (category === "all" || cat === category) {
      card.style.display = "flex";
      card.style.animation = "fadeIn 0.4s ease forwards";
    } else {
      card.style.display = "none";
    }
  });
}

/* ── Searchable Brand Directory Section ── */
function searchBrandDirectory() {
  const query = document.getElementById("brandDirectoryInput").value.toLowerCase().trim();
  const dirCards = document.querySelectorAll(".directory-category-card");

  dirCards.forEach(card => {
    const listItems = card.querySelectorAll(".dir-item");
    let hasMatch = false;

    listItems.forEach(item => {
      const brandName = item.querySelector("span").textContent.toLowerCase();
      if (brandName.includes(query)) {
        item.style.display = "flex";
        hasMatch = true;
      } else {
        item.style.display = "none";
      }
    });

    if (hasMatch || query === "") {
      card.style.display = "flex";
      card.style.animation = "fadeIn 0.3s ease forwards";
    } else {
      card.style.display = "none";
    }
  });
}

/* ── Instant Product Categories Search ── */
function searchCategories() {
  const query = document.getElementById("categorySearchInput").value.toLowerCase().trim();
  const cards = document.querySelectorAll(".category-card");

  cards.forEach(card => {
    const keywords = card.getAttribute("data-keywords").toLowerCase();
    const title = card.querySelector("h3").textContent.toLowerCase();
    const desc = card.querySelector("p").textContent.toLowerCase();

    if (keywords.includes(query) || title.includes(query) || desc.includes(query)) {
      card.style.display = "flex";
      card.style.animation = "fadeIn 0.3s ease forwards";
    } else {
      card.style.display = "none";
    }
  });
}

/* ── Project Showcase Filter ── */
function filterShowcase(type) {
  const cards = document.querySelectorAll(".showcase-card");
  const buttons = document.querySelectorAll(".showcase-filter-btn");

  buttons.forEach(btn => {
    if (btn.textContent.toLowerCase().includes(type) || (type === "all" && btn.textContent.toLowerCase() === "all projects")) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  cards.forEach(card => {
    const cardType = card.getAttribute("data-type");
    if (type === "all" || cardType === type) {
      card.style.display = "flex";
      card.style.animation = "fadeIn 0.4s ease forwards";
    } else {
      card.style.display = "none";
    }
  });
}

/* ── SEO Sourcing Page Switcher ── */
function switchSeoPage(pageId) {
  const tabs = document.querySelectorAll(".seo-tab-btn");
  const panels = document.querySelectorAll(".seo-panel-content");

  tabs.forEach(btn => {
    if (btn.getAttribute("onclick").includes(pageId)) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  panels.forEach(panel => {
    if (panel.id === `seo-${pageId}`) {
      panel.classList.add("active");
    } else {
      panel.classList.remove("active");
    }
  });
}

/* ── Catalog Download Lead-Gate Modal ── */
function openCatalogModal() {
  const modal = document.getElementById("catalogModal");
  if (modal) modal.classList.add("active");
}

function closeCatalogModal() {
  const modal = document.getElementById("catalogModal");
  if (modal) modal.classList.remove("active");
}

function initCatalogGate() {
  const form = document.getElementById("catalogGateForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const phoneInput = document.getElementById("catalogMobile");
    if (!phoneInput) return;

    const phone = phoneInput.value.trim();
    const phonePattern = /^[6-9]\d{9}$/;

    if (!phonePattern.test(phone)) {
      showToast("Please enter a valid 10-digit mobile number.", true);
      return;
    }

    // Capture Lead in LocalStorage
    const leads = JSON.parse(localStorage.getItem("mob_leads") || "[]");
    leads.push({ phone: phone, timestamp: new Date().toISOString(), type: "Catalog Download" });
    localStorage.setItem("mob_leads", JSON.stringify(leads));

    showToast("Catalog Unlocked! Starting Download...");
    closeCatalogModal();
    form.reset();

    // Trigger Simulated Download
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "#"; // Simulated PDF catalog URL
      link.setAttribute("download", "Mad_Over_Buildings_Wholesale_Catalog.pdf");
      document.body.appendChild(link);
      // Simulating download notification
      showToast("Download Complete: MOB_Wholesale_Catalog.pdf");
      link.remove();
    }, 1500);
  });
}

/* ── Toast Notification Display ── */
function showToast(message, isError = false) {
  const toast = document.getElementById("toastNotification");
  const msg = document.getElementById("toastMessage");
  const icon = toast.querySelector(".toast-icon");

  if (!toast || !msg) return;

  msg.textContent = message;
  
  if (isError) {
    toast.style.borderColor = "#ef4444";
    icon.className = "fa-solid fa-circle-exclamation toast-icon";
    icon.style.color = "#ef4444";
  } else {
    toast.style.borderColor = "var(--primary-blue)";
    icon.className = "fa-solid fa-circle-check toast-icon";
    icon.style.color = "var(--gold-accent)";
  }

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

/* ── Scroll Progress Bar ── */
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  }, { passive: true });
}

/* ── Typewriter Tagline Effect ── */
function initTypewriter() {
  const el = document.getElementById("typewriterText");
  if (!el) return;

  const phrases = [
    "B2B Sourcing Partner",
    "Same-Day Delivery",
    "100+ Premium Brands",
    "Architect Focused",
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 55 : 90;

    if (!isDeleting && charIndex === current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 800);
}

/* ── Hero Particle Canvas ── */
function initHeroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const PARTICLE_COUNT = 55;
  let particles = [];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.45 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(148, 163, 184, ${this.opacity})`;
      ctx.fill();
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(148, 163, 184, ${0.06 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  animate();
}

/* ── Active Nav Link Highlight on Scroll ── */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 110;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }, { passive: true });
}

/* ── Aurora Canvas Background Animation ── */
function initAuroraCanvas() {
  const canvas = document.getElementById("auroraCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let t = 0;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Each blob: { base x%, base y%, radius%, r,g,b, speed, phase }
  const blobs = [
    { bx: 0.12, by: 0.18, r: 0.42, rgb: [37,  99, 235], speed: 0.00025, phase: 0.0  },
    { bx: 0.85, by: 0.10, r: 0.40, rgb: [99,  55, 220], speed: 0.00018, phase: 1.2  },
    { bx: 0.45, by: 0.55, r: 0.38, rgb: [245,158,  11], speed: 0.00022, phase: 2.5  },
    { bx: 0.10, by: 0.72, r: 0.35, rgb: [6,  182, 212], speed: 0.00030, phase: 0.8  },
    { bx: 0.80, by: 0.75, r: 0.38, rgb: [236, 72, 153], speed: 0.00015, phase: 3.7  },
    { bx: 0.55, by: 0.25, r: 0.30, rgb: [16, 185, 129], speed: 0.00028, phase: 5.1  },
  ];

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    blobs.forEach(blob => {
      // Oscillate x and y around base position
      const ox = Math.sin(t * blob.speed * 2 * Math.PI * 60 + blob.phase) * 0.12;
      const oy = Math.cos(t * blob.speed * 2 * Math.PI * 45 + blob.phase * 0.7) * 0.10;

      const cx = (blob.bx + ox) * canvas.width;
      const cy = (blob.by + oy) * canvas.height;
      const rad = blob.r * Math.min(canvas.width, canvas.height);

      // Pulsing opacity
      const alpha = 0.06 + 0.025 * Math.sin(t * blob.speed * 2 * Math.PI * 30 + blob.phase);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      grad.addColorStop(0, `rgba(${blob.rgb[0]},${blob.rgb[1]},${blob.rgb[2]},${(alpha * 3).toFixed(3)})`);
      grad.addColorStop(0.4, `rgba(${blob.rgb[0]},${blob.rgb[1]},${blob.rgb[2]},${(alpha).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${blob.rgb[0]},${blob.rgb[1]},${blob.rgb[2]},0)`);

      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    t++;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  draw();
}
