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
