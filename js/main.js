(function () {
  const nav = document.querySelector(".velvi-nav");
  const toTop = document.querySelector(".to-top");
  const collapseEl = document.querySelector("#navMenu");
  const yearNodes = document.querySelectorAll("[data-year]");

  yearNodes.forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  function onScroll() {
    const y = window.scrollY || 0;
    if (nav) nav.classList.toggle("is-scrolled", y > 8);
    if (toTop) toTop.classList.toggle("is-on", y > 500);
    setActiveLink();
  }

  const navLinks = nav
    ? Array.from(nav.querySelectorAll('.nav-link[href*="#"]'))
    : [];

  function setActiveLink() {
    const local = navLinks.filter((link) => link.getAttribute("href").startsWith("#"));
    if (!local.length) return;
    const marker = window.scrollY + 120;
    let current = local[0].getAttribute("href");
    local.forEach((link) => {
      const id = link.getAttribute("href");
      const section = document.querySelector(id);
      if (section && section.offsetTop <= marker) current = id;
    });
    local.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === current);
    });
  }

  function closeMenu() {
    if (!collapseEl || !collapseEl.classList.contains("show") || !window.bootstrap) return;
    window.bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false }).hide();
  }

  if (collapseEl) {
    collapseEl.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );
  onScroll();

  const DEFAULT_MESSAGE = "I would like to enquire about purchasing Stevia Drop (10 ml).";
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-enquire]");
    if (!trigger) return;
    const message = document.querySelector("#message");
    if (message && !message.value.trim()) message.value = DEFAULT_MESSAGE;
  });

  const form = document.querySelector("#enquiry-form");
  if (!form) return;

  const success = document.querySelector("#form-success");
  const status = document.querySelector("#form-status");
  const whatsappNumber = "919451155771";
  const businessEmail = "velvinaturals@gmail.com";

  function fieldOf(input) {
    return input.closest(".field");
  }

  function setError(input, message) {
    const field = fieldOf(input);
    const error = field.querySelector(".field-error");
    field.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    error.textContent = message;
  }

  function clearError(input) {
    const field = fieldOf(input);
    const error = field.querySelector(".field-error");
    field.classList.remove("is-invalid");
    input.removeAttribute("aria-invalid");
    error.textContent = "";
  }

  function validate() {
    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const phone = form.querySelector("#phone");
    const message = form.querySelector("#message");
    let ok = true;

    clearError(name);
    clearError(email);
    clearError(phone);
    clearError(message);

    if (name.value.trim().length < 2) {
      setError(name, "Please enter your name.");
      ok = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setError(email, "Please enter a valid email address.");
      ok = false;
    }

    const digits = phone.value.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      setError(phone, "Please enter a phone number with 10 to 15 digits.");
      ok = false;
    }

    if (message.value.trim().length < 2) {
      setError(message, "Please enter a message (at least 2 characters).");
      ok = false;
    }

    return ok;
  }

  function enquiryText() {
    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const phone = form.querySelector("#phone").value.trim();
    const message = form.querySelector("#message").value.trim();
    return [
      "Hello VELVI NATURALS,",
      "",
      "I would like to enquire about Stevia Drop (10 ml).",
      "",
      "Name: " + name,
      "Email: " + email,
      "Phone: " + phone,
      "",
      message
    ].join("\n");
  }

  function whatsappHref(text) {
    return "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(text);
  }

  function mailHref(text) {
    return (
      "mailto:" +
      businessEmail +
      "?subject=" +
      encodeURIComponent("Enquiry: Stevia Drop 10 ml") +
      "&body=" +
      encodeURIComponent(text)
    );
  }

  // ── Toast Notification Utility ──────────────────────────────────────
  let toastEl = null;
  let toastTimer = null;

  function showToast(msg, type) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "velvi-toast";
      document.body.appendChild(toastEl);
    }
    if (toastTimer) clearTimeout(toastTimer);
    toastEl.className = "velvi-toast" + (type === "success" ? " success" : "");
    toastEl.innerHTML = (type === "success" ? "✓ " : "⚠ ") + msg;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { toastEl.classList.add("show"); });
    });
    toastTimer = setTimeout(() => { toastEl.classList.remove("show"); }, 4000);
  }

  // ── Character Counter on message textarea ────────────────────────────
  const msgField = form.querySelector("#message");
  if (msgField) {
    const counter = document.createElement("p");
    counter.className = "char-counter";
    counter.textContent = "0 characters";
    msgField.parentElement.appendChild(counter);
    msgField.addEventListener("input", () => {
      const len = msgField.value.length;
      counter.textContent = len + " character" + (len === 1 ? "" : "s");
      counter.style.color = len < 2 ? "#c0392b" : "var(--muted)";
    });
  }

  // ── Form submission ──────────────────────────────────────────────────
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.querySelector("#company") && form.querySelector("#company").value) return;

    if (!validate()) {
      const first = form.querySelector(".is-invalid input, .is-invalid textarea");
      if (first) first.focus();
      if (status) status.textContent = "Please correct the highlighted fields.";

      // Count how many fields have errors
      const errors = form.querySelectorAll(".is-invalid");
      const count = errors.length;
      showToast("Please fix " + count + " field" + (count > 1 ? "s" : "") + " — see the red highlights below.", "error");

      // Shake the form
      form.classList.remove("form-shake");
      void form.offsetWidth; // reflow to restart animation
      form.classList.add("form-shake");
      form.addEventListener("animationend", () => form.classList.remove("form-shake"), { once: true });

      return;
    }

    const text = enquiryText();
    const wa = whatsappHref(text);
    const mail = mailHref(text);
    success.querySelector("[data-wa]").href = wa;
    success.querySelector("[data-mail]").href = mail;
    form.hidden = true;
    success.hidden = false;
    if (status) status.textContent = "Your enquiry is ready. WhatsApp should open so you can send it.";
    showToast("Enquiry ready! WhatsApp is opening…", "success");
    window.open(wa, "_blank", "noopener,noreferrer");
  });

  const reset = document.querySelector("#send-another");
  if (reset) {
    reset.addEventListener("click", () => {
      form.reset();
      form.hidden = false;
      success.hidden = true;
      if (status) status.textContent = "";
      form.querySelector("#name").focus();
    });
  }
})();
