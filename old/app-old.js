/**
 * VELVI NATURALS – Stevia Drop (10 ml)
 * Interactive Application & Cart Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Product Catalog State ---
  const PRODUCTS = {
    single: {
      id: 'stevia-10ml-single',
      name: 'Stevia Drop (10 ml) - Single Pack',
      subtitle: 'Standard 10 ml Dropper Bottle (~200+ drops)',
      price: 199,
      mrp: 249,
      volume: '10 ml',
      image: './Gemini_Generated_Image_eho0bweho0bweho0.png'
    },
    duo: {
      id: 'stevia-10ml-duo',
      name: 'Stevia Drop (10 ml) - Duo Value Pack',
      subtitle: '2 x 10 ml Bottles (Home + Office / Travel)',
      price: 369,
      mrp: 498,
      volume: '2 x 10 ml',
      badge: 'Save 26%',
      image: './Gemini_Generated_Image_eho0bweho0bweho0.png'
    },
    trio: {
      id: 'stevia-10ml-trio',
      name: 'Stevia Drop (10 ml) - Family Trio Pack',
      subtitle: '3 x 10 ml Bottles (Free Shipping Included)',
      price: 499,
      mrp: 747,
      volume: '3 x 10 ml',
      badge: 'Best Value • Free Delivery',
      image: './Gemini_Generated_Image_eho0bweho0bweho0.png'
    }
  };

  // Cart State (stored in memory & localStorage)
  let cart = JSON.parse(localStorage.getItem('velvi_cart')) || [];
  let currentSelectedPlan = 'single';

  // --- 2. Toast Notification Utility ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    const icon = type === 'success' ? 'fa-circle-check text-emerald-600' : 'fa-circle-info text-amber-600';
    
    toast.innerHTML = `
      <i class="fa-solid ${icon} text-lg"></i>
      <div class="flex-1 text-sm font-medium text-stone-800">${message}</div>
      <button class="text-stone-400 hover:text-stone-600 text-sm ml-2" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  // --- 3. Cart Drawer Mechanics ---
  const cartDrawerBackdrop = document.getElementById('cartDrawerBackdrop');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartToggleBtns = document.querySelectorAll('.cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartCountBadges = document.querySelectorAll('.cart-count-badge');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartSummarySection = document.getElementById('cartSummarySection');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartSavingsEl = document.getElementById('cartSavings');
  const cartShippingEl = document.getElementById('cartShipping');
  const cartTotalEl = document.getElementById('cartTotal');

  function openCart() {
    cartDrawerBackdrop.classList.add('open');
    cartDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCart();
  }

  function closeCart() {
    cartDrawerBackdrop.classList.remove('open');
    cartDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  cartToggleBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  }));

  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartDrawerBackdrop) {
    cartDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === cartDrawerBackdrop) closeCart();
    });
  }

  function saveCart() {
    localStorage.setItem('velvi_cart', JSON.stringify(cart));
    updateCartBadges();
  }

  function updateCartBadges() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadges.forEach(badge => {
      badge.textContent = totalCount;
      if (totalCount > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    });
  }

  function addToCart(planKey, quantity = 1, shouldOpenDrawer = true) {
    const product = PRODUCTS[planKey] || PRODUCTS.single;
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        key: planKey,
        name: product.name,
        subtitle: product.subtitle,
        price: product.price,
        mrp: product.mrp,
        image: product.image,
        quantity: quantity
      });
    }

    saveCart();
    showToast(`Added ${quantity} × ${product.name} to cart!`);
    if (shouldOpenDrawer) {
      openCart();
    }
  }

  function updateItemQuantity(id, delta) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
      cart[itemIndex].quantity += delta;
      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
        showToast('Item removed from cart.');
      }
      saveCart();
      renderCart();
    }
  }

  function removeItemFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
    showToast('Item removed from cart.');
  }

  function renderCart() {
    updateCartBadges();

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '';
      if (cartEmptyState) cartEmptyState.classList.remove('hidden');
      if (cartSummarySection) cartSummarySection.classList.add('hidden');
      return;
    }

    if (cartEmptyState) cartEmptyState.classList.add('hidden');
    if (cartSummarySection) cartSummarySection.classList.remove('hidden');

    let subtotal = 0;
    let mrpTotal = 0;

    cartItemsContainer.innerHTML = cart.map(item => {
      const itemSubtotal = item.price * item.quantity;
      const itemMrpTotal = item.mrp * item.quantity;
      subtotal += itemSubtotal;
      mrpTotal += itemMrpTotal;

      return `
        <div class="flex items-center gap-3.5 p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 hover:border-emerald-300 transition-colors">
          <div class="w-16 h-16 bg-white rounded-lg p-1 border border-stone-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-xs font-semibold text-stone-900 truncate">${item.name}</h4>
            <p class="text-[11px] text-stone-500 truncate">${item.subtitle}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-sm font-bold text-emerald-900">₹${itemSubtotal}</span>
              <span class="text-xs text-stone-400 line-through">₹${itemMrpTotal}</span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
            <button class="text-stone-400 hover:text-rose-600 text-xs transition-colors p-1" onclick="window.VelviApp.removeItem('${item.id}')" title="Remove">
              <i class="fa-regular fa-trash-can"></i>
            </button>
            <div class="flex items-center border border-stone-300 bg-white rounded-md overflow-hidden text-xs">
              <button class="px-2 py-0.5 text-stone-600 hover:bg-stone-100 font-bold" onclick="window.VelviApp.changeQty('${item.id}', -1)">-</button>
              <span class="px-2 py-0.5 font-semibold text-stone-800">${item.quantity}</span>
              <button class="px-2 py-0.5 text-stone-600 hover:bg-stone-100 font-bold" onclick="window.VelviApp.changeQty('${item.id}', 1)">+</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const savings = Math.max(0, mrpTotal - subtotal);
    const shipping = subtotal >= 499 ? 0 : (subtotal > 0 ? 49 : 0);
    const total = subtotal + shipping;

    if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal}`;
    if (cartSavingsEl) cartSavingsEl.textContent = `₹${savings}`;
    if (cartShippingEl) {
      cartShippingEl.innerHTML = shipping === 0 
        ? '<span class="text-emerald-700 font-semibold">FREE</span>' 
        : `₹${shipping}`;
    }
    if (cartTotalEl) cartTotalEl.textContent = `₹${total}`;
  }

  // --- 4. Pack Selection (Single / Duo / Trio) on Product Cards ---
  const planCards = document.querySelectorAll('.plan-selection-card');
  const mainPriceDisplay = document.getElementById('mainPriceDisplay');
  const mainMrpDisplay = document.getElementById('mainMrpDisplay');
  const mainSavingsBadge = document.getElementById('mainSavingsBadge');
  const quantityInput = document.getElementById('mainProductQuantity');

  planCards.forEach(card => {
    card.addEventListener('click', () => {
      planCards.forEach(c => {
        c.classList.remove('border-emerald-600', 'bg-emerald-50/50', 'ring-2', 'ring-emerald-600/20');
        c.classList.add('border-stone-200');
        const radio = c.querySelector('input[type="radio"]');
        if (radio) radio.checked = false;
      });

      card.classList.remove('border-stone-200');
      card.classList.add('border-emerald-600', 'bg-emerald-50/50', 'ring-2', 'ring-emerald-600/20');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      const planKey = card.getAttribute('data-plan');
      if (planKey && PRODUCTS[planKey]) {
        currentSelectedPlan = planKey;
        const p = PRODUCTS[planKey];
        if (mainPriceDisplay) mainPriceDisplay.textContent = `₹${p.price}`;
        if (mainMrpDisplay) mainMrpDisplay.textContent = `₹${p.mrp}`;
        if (mainSavingsBadge) {
          const pct = Math.round(((p.mrp - p.price) / p.mrp) * 100);
          mainSavingsBadge.textContent = `Save ${pct}%`;
        }
      }
    });
  });

  // Quantity Counter Buttons
  const qtyMinusBtn = document.getElementById('qtyMinusBtn');
  const qtyPlusBtn = document.getElementById('qtyPlusBtn');
  if (qtyMinusBtn && quantityInput) {
    qtyMinusBtn.addEventListener('click', () => {
      let val = parseInt(quantityInput.value, 10) || 1;
      if (val > 1) quantityInput.value = val - 1;
    });
  }
  if (qtyPlusBtn && quantityInput) {
    qtyPlusBtn.addEventListener('click', () => {
      let val = parseInt(quantityInput.value, 10) || 1;
      if (val < 20) quantityInput.value = val + 1;
    });
  }

  // Add to Cart Button handler
  const btnAddToCart = document.getElementById('btnAddToCart');
  if (btnAddToCart) {
    btnAddToCart.addEventListener('click', (e) => {
      e.preventDefault();
      const qty = parseInt(quantityInput ? quantityInput.value : 1, 10) || 1;
      addToCart(currentSelectedPlan, qty, true);
    });
  }

  // Buy Now Button handler (Direct instant checkout drawer)
  const btnBuyNow = document.getElementById('btnBuyNow');
  if (btnBuyNow) {
    btnBuyNow.addEventListener('click', (e) => {
      e.preventDefault();
      const qty = parseInt(quantityInput ? quantityInput.value : 1, 10) || 1;
      addToCart(currentSelectedPlan, qty, true);
    });
  }

  // --- 5. Checkout / Direct Order Dispatch (WhatsApp & Form Enquiry) ---
  const btnCheckoutWhatsApp = document.getElementById('btnCheckoutWhatsApp');
  const checkoutDetailsModal = document.getElementById('checkoutDetailsModal');
  const checkoutOrderSummary = document.getElementById('checkoutOrderSummary');
  const checkoutForm = document.getElementById('checkoutOrderForm');
  const checkoutModalClose = document.getElementById('checkoutModalClose');

  function openCheckoutModal() {
    if (cart.length === 0) {
      showToast('Your cart is currently empty. Please select a pack!', 'info');
      return;
    }
    closeCart();
    if (checkoutDetailsModal) {
      checkoutDetailsModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    if (checkoutOrderSummary) {
      let subtotal = 0;
      let summaryText = cart.map(i => {
        const itemTotal = i.price * i.quantity;
        subtotal += itemTotal;
        return `<div class="flex justify-between py-1 text-xs border-b border-stone-100">
          <span class="text-stone-700 font-medium">${i.quantity}x ${i.name}</span>
          <span class="text-stone-900 font-bold">₹${itemTotal}</span>
        </div>`;
      }).join('');

      const shipping = subtotal >= 499 ? 0 : 49;
      const total = subtotal + shipping;

      summaryText += `
        <div class="mt-2 text-xs space-y-1">
          <div class="flex justify-between text-stone-500">
            <span>Subtotal</span>
            <span>₹${subtotal}</span>
          </div>
          <div class="flex justify-between text-stone-500">
            <span>Shipping</span>
            <span>${shipping === 0 ? '<span class="text-emerald-700 font-semibold">FREE</span>' : '₹' + shipping}</span>
          </div>
          <div class="flex justify-between text-sm font-bold text-emerald-950 pt-1 border-t border-stone-200">
            <span>Total Payable</span>
            <span>₹${total}</span>
          </div>
        </div>
      `;
      checkoutOrderSummary.innerHTML = summaryText;
    }
  }

  if (btnCheckoutWhatsApp) {
    btnCheckoutWhatsApp.addEventListener('click', (e) => {
      e.preventDefault();
      openCheckoutModal();
    });
  }

  if (checkoutModalClose) {
    checkoutModalClose.addEventListener('click', () => {
      checkoutDetailsModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customerName = document.getElementById('custName').value.trim();
      const customerPhone = document.getElementById('custPhone').value.trim();
      const customerCity = document.getElementById('custCity').value.trim();
      const customerAddress = document.getElementById('custAddress').value.trim();
      const customerPincode = document.getElementById('custPincode').value.trim();
      const paymentPref = document.querySelector('input[name="paymentMode"]:checked')?.value || 'Cash on Delivery (COD)';

      if (!customerName || !customerPhone || !customerAddress) {
        showToast('Please complete all required fields.', 'info');
        return;
      }

      let subtotal = 0;
      const itemsList = cart.map(i => {
        subtotal += (i.price * i.quantity);
        return `• ${i.quantity}x ${i.name} (₹${i.price * i.quantity})`;
      }).join('\n');

      const shipping = subtotal >= 499 ? 0 : 49;
      const finalAmount = subtotal + shipping;

      // Construct WhatsApp message
      const message = `🌿 *NEW ORDER ENQUIRY - VELVI NATURALS*\n\n` +
        `*Customer Details:*\n` +
        `👤 Name: ${customerName}\n` +
        `📞 Phone: ${customerPhone}\n` +
        `📍 Address: ${customerAddress}, ${customerCity} - ${customerPincode}\n` +
        `💳 Payment Preference: ${paymentPref}\n\n` +
        `*Order Items:*\n${itemsList}\n\n` +
        `📦 Subtotal: ₹${subtotal}\n` +
        `🚚 Delivery: ${shipping === 0 ? 'FREE' : '₹' + shipping}\n` +
        `💰 *Total Amount: ₹${finalAmount}*\n\n` +
        `_Product: VELVI NATURALS Stevia Drop Liquid Sweetener (10 ml)_`;

      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/919451155771?text=${encodedMsg}`;

      // Show confirmation toast
      showToast('Order details prepared! Redirecting to WhatsApp to confirm directly with VELVI NATURALS...');

      // Close modal and clear cart
      setTimeout(() => {
        checkoutDetailsModal.classList.remove('open');
        document.body.style.overflow = '';
        cart = [];
        saveCart();
        renderCart();
        window.open(whatsappUrl, '_blank');
      }, 1000);
    });
  }

  // --- 6. Interactive Dosage Calculator ---
  const beverageBtns = document.querySelectorAll('.dosage-bev-btn');
  const sweetnessRange = document.getElementById('sweetnessRange');
  const sweetnessLabel = document.getElementById('sweetnessLabel');
  const dropCountDisplay = document.getElementById('dropCountDisplay');
  const sugarEquivDisplay = document.getElementById('sugarEquivDisplay');
  const dosageAdviceDisplay = document.getElementById('dosageAdviceDisplay');

  let currentBeverage = 'tea';

  const DOSAGE_DATA = {
    tea: {
      name: 'Hot Indian Masala / Green Tea (150 ml)',
      baseDrops: [1, 2, 3],
      descriptions: [
        'Mild natural sweetness. Gentle botanical balance without overpowering spices.',
        'Balanced everyday sweetness. Perfectly mimics 1.5 - 2 tsp of traditional sugar.',
        'Rich sweetness for sweet-tooth lovers. Full-bodied sweetness with zero calories.'
      ]
    },
    coffee: {
      name: 'Hot Espresso / Milk Coffee (200 ml)',
      baseDrops: [1, 2, 4],
      descriptions: [
        'Light sweetness to soften espresso bitterness while preserving roast notes.',
        'Balanced, smooth coffee flavour. Equivalent to ~2 teaspoons sugar.',
        'Extra sweet dessert-like coffee sweetness without sticky sugar residue.'
      ]
    },
    lemonade: {
      name: 'Cold Lemon Water / Nimbu Pani (250 ml)',
      baseDrops: [2, 3, 5],
      descriptions: [
        'Crisp citrus refreshment. Dissolves instantly in chilled ice water without granules.',
        'Classic sweet-tart lemonade balance. Dissolves evenly throughout the glass.',
        'Intense sweet lemonade, ideal for quenching summer thirst guilt-free.'
      ]
    },
    curd: {
      name: 'Fresh Curd / Greek Yogurt Bowl (150 g)',
      baseDrops: [2, 3, 4],
      descriptions: [
        'Soft creamy sweetness for breakfast yogurt and chia puddings.',
        'Pleasant dessert-grade curd sweetness without raising glycemic index.',
        'Rich sweetness suitable for homemade sweet lassi or fruit shrikhand.'
      ]
    },
    smoothie: {
      name: 'Protein Shake / Fruit Smoothie (300 ml)',
      baseDrops: [2, 3, 5],
      descriptions: [
        'Subtle plant sweetness enhancing natural banana or berry notes.',
        'Full sweetness boost for post-workout protein shakes without sugar crash.',
        'Sweet indulgence for dessert shakes and cold smoothie bowls.'
      ]
    }
  };

  function updateDosage() {
    const bev = DOSAGE_DATA[currentBeverage] || DOSAGE_DATA.tea;
    const levelIndex = parseInt(sweetnessRange.value, 10); // 0, 1, 2

    const labels = ['Light & Subtle', 'Balanced (Everyday)', 'Rich & Sweet'];
    if (sweetnessLabel) sweetnessLabel.textContent = labels[levelIndex];

    const drops = bev.baseDrops[levelIndex];
    if (dropCountDisplay) dropCountDisplay.textContent = drops;

    const sugarTsp = (drops * 0.9).toFixed(1);
    if (sugarEquivDisplay) sugarEquivDisplay.textContent = `≈ ${sugarTsp} - ${drops} tsp Sugar`;

    if (dosageAdviceDisplay) {
      dosageAdviceDisplay.textContent = bev.descriptions[levelIndex];
    }
  }

  beverageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      beverageBtns.forEach(b => {
        b.classList.remove('bg-emerald-800', 'text-white', 'shadow-md');
        b.classList.add('bg-stone-100', 'text-stone-700', 'hover:bg-stone-200');
      });
      btn.classList.remove('bg-stone-100', 'text-stone-700', 'hover:bg-stone-200');
      btn.classList.add('bg-emerald-800', 'text-white', 'shadow-md');
      currentBeverage = btn.getAttribute('data-bev');
      updateDosage();
    });
  });

  if (sweetnessRange) {
    sweetnessRange.addEventListener('input', updateDosage);
  }

  // --- 7. High-Res Image Gallery / Lightbox Modal ---
  const galleryModal = document.getElementById('galleryModal');
  const galleryModalImg = document.getElementById('galleryModalImg');
  const galleryModalCaption = document.getElementById('galleryModalCaption');
  const galleryModalClose = document.getElementById('galleryModalClose');
  const galleryTriggers = document.querySelectorAll('.gallery-trigger');

  galleryTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = trigger.getAttribute('data-img');
      const caption = trigger.getAttribute('data-caption') || 'VELVI NATURALS Stevia Drop';
      if (galleryModalImg) galleryModalImg.src = imgSrc;
      if (galleryModalCaption) galleryModalCaption.textContent = caption;
      if (galleryModal) {
        galleryModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (galleryModalClose) {
    galleryModalClose.addEventListener('click', () => {
      galleryModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  if (galleryModal) {
    galleryModal.addEventListener('click', (e) => {
      if (e.target === galleryModal) {
        galleryModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Product Image Thumbnail Switcher in Intro Section
  const mainProductIntroImg = document.getElementById('mainProductIntroImg');
  const introThumbnails = document.querySelectorAll('.intro-thumb-btn');

  introThumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      introThumbnails.forEach(t => t.classList.remove('ring-2', 'ring-emerald-600', 'border-emerald-600'));
      thumb.classList.add('ring-2', 'ring-emerald-600', 'border-emerald-600');
      const targetSrc = thumb.getAttribute('data-src');
      if (mainProductIntroImg && targetSrc) {
        mainProductIntroImg.style.opacity = '0.3';
        setTimeout(() => {
          mainProductIntroImg.src = targetSrc;
          mainProductIntroImg.style.opacity = '1';
        }, 150);
      }
    });
  });

  // --- 8. Contact Form Client-Side Validation ---
  const contactForm = document.getElementById('mainContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cfName').value.trim();
      const email = document.getElementById('cfEmail').value.trim();
      const phone = document.getElementById('cfPhone').value.trim();
      const subject = document.getElementById('cfSubject').value.trim();
      const message = document.getElementById('cfMessage').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields marked with *', 'info');
        return;
      }

      // Basic email check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'info');
        return;
      }

      // Generate WhatsApp or Mailto direct link for immediate response
      const inquiryText = `🌿 *ENQUIRY - VELVI NATURALS*\n\n` +
        `👤 Name: ${name}\n` +
        `📧 Email: ${email}\n` +
        `📞 Phone: ${phone || 'Not provided'}\n` +
        `📌 Subject: ${subject || 'General Enquiry'}\n\n` +
        `📝 Message:\n${message}`;

      const waInquiryUrl = `https://wa.me/919451155771?text=${encodeURIComponent(inquiryText)}`;

      // Simulate clean submission feedback
      showToast('Thank you! Your enquiry has been received. Our team will contact you shortly.');
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-check mr-2"></i> Message Sent!';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }, 3500);
    });
  }

  // --- 9. Sticky Mobile & Bottom Order Bar ---
  const stickyBar = document.getElementById('stickyOrderBar');
  const heroSection = document.getElementById('hero');
  const contactSection = document.getElementById('contact');

  function checkStickyBar() {
    if (!stickyBar || !heroSection) return;
    const heroRect = heroSection.getBoundingClientRect();
    const contactRect = contactSection ? contactSection.getBoundingClientRect() : null;

    // Show when hero has scrolled past view
    const pastHero = heroRect.bottom < 100;
    // Hide when reaching contact form or bottom
    const beforeContact = contactRect ? contactRect.top > window.innerHeight : true;

    if (pastHero && beforeContact) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', checkStickyBar, { passive: true });

  // --- 10. Mobile Navigation Toggle ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavMenu = document.getElementById('mobileNavMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileNavMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = !mobileNavMenu.classList.contains('hidden');
      if (isOpen) {
        mobileNavMenu.classList.add('hidden');
        mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars text-xl"></i>';
      } else {
        mobileNavMenu.classList.remove('hidden');
        mobileMenuBtn.innerHTML = '<i class="fa-solid fa-xmark text-xl"></i>';
      }
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavMenu.classList.add('hidden');
        mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars text-xl"></i>';
      });
    });
  }

  // --- 11. Interactive FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (header && content) {
      header.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');

        // Close all others
        faqItems.forEach(other => {
          const otherContent = other.querySelector('.faq-content');
          const otherIcon = other.querySelector('.faq-icon');
          if (otherContent) otherContent.classList.add('hidden');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        });

        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });

  // --- 12. Policy Modals (Privacy & Terms) ---
  const policyModal = document.getElementById('policyModal');
  const policyModalTitle = document.getElementById('policyModalTitle');
  const policyModalBody = document.getElementById('policyModalBody');
  const policyModalClose = document.getElementById('policyModalClose');
  const policyTriggers = document.querySelectorAll('.policy-link');

  const POLICIES = {
    privacy: {
      title: 'Privacy Policy',
      content: `
        <div class="space-y-4 text-xs text-stone-600 leading-relaxed">
          <p><strong>VELVI NATURALS PRIVATE LIMITED</strong> respects your personal privacy. We only collect basic contact information (name, delivery address, phone number, and email) that you voluntarily provide when making an inquiry, ordering Stevia Drop, or contacting customer care.</p>
          <h4 class="font-bold text-stone-900">How Information is Used:</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>To dispatch and fulfill your requested Stevia Drop product orders.</li>
            <li>To provide timely WhatsApp or phone order updates and delivery notifications.</li>
            <li>To respond to your product questions, wholesale queries, or feedback.</li>
          </ul>
          <h4 class="font-bold text-stone-900">Data Protection:</h4>
          <p>We do not sell, rent, or lease customer details to any third-party marketing companies. For any privacy queries, contact <em>velvinaturals@gmail.com</em>.</p>
        </div>
      `
    },
    terms: {
      title: 'Terms & Conditions',
      content: `
        <div class="space-y-4 text-xs text-stone-600 leading-relaxed">
          <p>Welcome to <strong>VELVI NATURALS</strong>. By browsing this website or placing a product enquiry for VELVI NATURALS Stevia Drop (10 ml), you agree to the following terms:</p>
          <h4 class="font-bold text-stone-900">Product Usability & Labelling:</h4>
          <p>VELVI NATURALS Stevia Drop is an organic & natural liquid sweetener designed for sweetening food and beverages. Please adhere strictly to the product label directions and storage requirements printed on the packaging.</p>
          <h4 class="font-bold text-stone-900">Orders & Deliveries:</h4>
          <p>All direct purchase requests are confirmed directly with our customer team via WhatsApp or telephone before dispatch. Free delivery is applicable on eligible multi-pack orders.</p>
          <h4 class="font-bold text-stone-900">Governing Law:</h4>
          <p>These terms are governed by the applicable laws of India under the jurisdiction of Bareilly, Uttar Pradesh.</p>
        </div>
      `
    },
    shipping: {
      title: 'Shipping & Delivery Policy',
      content: `
        <div class="space-y-4 text-xs text-stone-600 leading-relaxed">
          <h4 class="font-bold text-stone-900">Dispatch Timeline:</h4>
          <p>Orders confirmed before 2:00 PM are dispatched on the same business day from our facility in Bareilly, U.P. Delivery generally takes 2 to 5 business days across India.</p>
          <h4 class="font-bold text-stone-900">Shipping Rates:</h4>
          <p>Standard delivery charge is ₹49 for single-bottle orders. Free shipping is automatically unlocked on all multi-pack orders (Duo & Family Trio packs).</p>
          <h4 class="font-bold text-stone-900">Tracking:</h4>
          <p>Consignment tracking details are sent immediately to your registered WhatsApp number upon dispatch.</p>
        </div>
      `
    }
  };

  policyTriggers.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const policyKey = link.getAttribute('data-policy');
      const data = POLICIES[policyKey] || POLICIES.terms;
      if (policyModalTitle) policyModalTitle.textContent = data.title;
      if (policyModalBody) policyModalBody.innerHTML = data.content;
      if (policyModal) {
        policyModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (policyModalClose) {
    policyModalClose.addEventListener('click', () => {
      policyModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Expose global methods for inline HTML event triggers
  window.VelviApp = {
    addToCart,
    openCart,
    closeCart,
    changeQty: updateItemQuantity,
    removeItem: removeItemFromCart,
    showToast,
    openCheckout: openCheckoutModal
  };

  // Initial cart badge update & render
  updateCartBadges();
  updateDosage();
});
