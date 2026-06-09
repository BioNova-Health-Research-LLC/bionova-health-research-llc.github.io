/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll(
  '.hero, .stats, .section, .contact-section'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealEls.forEach(el => observer.observe(el));


/* ── SMOOTH NAV ACTIVE STATE ── */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === '#' + entry.target.id
            ? 'var(--gray-900)'
            : '';
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));


/* ── CONTACT FORM ── */
const contactBtn = document.getElementById('contact-btn');
const emailInput = document.getElementById('email-input');
const feedback   = document.getElementById('form-feedback');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();

  if (!email) {
    feedback.style.color = '#E24B4A';
    feedback.textContent = 'Please enter your email address.';
    emailInput.focus();
    return;
  }

  if (!isValidEmail(email)) {
    feedback.style.color = '#E24B4A';
    feedback.textContent = 'Please enter a valid email address.';
    emailInput.focus();
    return;
  }

  contactBtn.disabled = true;
  contactBtn.textContent = 'Sending…';

  setTimeout(() => {
    feedback.style.color = 'var(--green-600)';
    feedback.textContent = "Thanks! We'll be in touch within 48 hours.";
    emailInput.value = '';
    contactBtn.textContent = 'Sent ✓';
  }, 800);
});

emailInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') contactBtn.click();
});

emailInput.addEventListener('input', () => {
  feedback.textContent = '';
  contactBtn.disabled = false;
  contactBtn.textContent = 'Get in touch →';
});
