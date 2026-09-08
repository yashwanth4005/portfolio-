/**
 * main.js — App Bootstrap
 * - Renders all sections from PORTFOLIO data
 * - Navigation: sticky + active-link + hamburger
 * - Scroll animations via IntersectionObserver
 * - Resume buttons
 */

/* ── SVG icon helpers ────────────────────────────────────────────── */
function svgGitHub(size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>`;
}
function svgLinkedIn(size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
}
function svgEmail(size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
}
function svgPhone(size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.69A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`;
}
function svgCert(size = 20) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`;
}
function svgLink(size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
}
function svgDownload(size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
}
function svgEye(size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

/* ── Escape helper ───────────────────────────────────────────────── */
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ── HERO ────────────────────────────────────────────────────────── */
let heroRoleTimer;

function renderHero() {
  const p = Content.getProfile().personal;
  const r = Content.getProfile().resume;
  const socials = [];
  if (p.github) socials.push({ href: p.github, label: 'GitHub', icon: svgGitHub(15) });
  if (p.linkedin) socials.push({ href: p.linkedin, label: 'LinkedIn', icon: svgLinkedIn(15) });
  if (p.email) socials.push({ href: `mailto:${p.email}`, label: 'Email', icon: svgEmail(15) });

  const socialsHTML = socials.map(s =>
    `<a href="${esc(s.href)}" aria-label="${esc(s.label)}" ${s.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${s.icon} ${esc(s.label)}</a>`
  ).join('');

  const imgFallbackStr = p.name ? p.name.charAt(0) : 'Y';
  const profileImgSrc = p.image || 'assets/images/profile.jpg';

  const aboutText = p.about || '';
  const topSkills = p.topSkills?.length ? p.topSkills.slice(0, 4) :
    (typeof Content !== 'undefined' ? Object.values(Content.getSkills()).flat().slice(0, 4) :
      ['JavaScript', 'React', 'Node.js', 'Python']);
  const availabilityLabel = p.availability === false ? 'Not Available' : (p.availabilityLabel || 'Available for Work');
  const locationLabel = p.location || 'Vijayawada, IND';
  const heroRoles = [
    'CSE Student · KL University',
    'Full-stack Developer',
    'Social & Digital Media Analytics'
  ];

  document.getElementById('hero-content').innerHTML = `
    <div class="hero-inner container">
      <div class="hero-text">
        <div class="hero-status-badge${p.availability === false ? ' is-unavailable' : ''}">
          <span class="hero-status-dot"></span>${esc(availabilityLabel)}
        </div>
        <p class="hero-greeting">Hi, I'm</p>
        <h1 class="hero-name">${esc(p.name)}</h1>
        <p class="hero-role-line"><span id="hero-role-text">${esc(heroRoles[0])}</span></p>
        <p class="hero-headline">${esc(p.headline)}</p>
        <p class="hero-description">${esc(aboutText.split('\\n')[0])}</p>
        <div class="hero-buttons">
          <a href="#projects" class="btn btn-primary">View Projects</a>
          <a href="${esc(r.path)}" target="_blank" class="btn btn-outline" id="btn-hero-resume">
            ${svgEye(16)} View Resume
          </a>
          <a href="#contact" class="btn btn-ghost">Contact Me</a>
        </div>
        <div class="hero-socials">${socialsHTML}</div>
      </div>
      <div class="hero-image-wrap">
        <div class="profile-ring tilt">
          <div class="profile-circle">
            <img id="profile-img" src="${esc(profileImgSrc)}" alt="${esc(p.name)} profile photo"/>
            <div id="profile-fallback" style="display:none">${esc(imgFallbackStr)}</div>
          </div>
        </div>
      </div>
      <div class="hero-highlights">
        <div class="highlight-card glass tilt">
            <div class="highlight-title">Top Skills</div>
            <div class="highlight-tags">
                ${topSkills.map(s => `<span>${esc(s)}</span>`).join('')}
            </div>
        </div>
        <div class="highlight-card glass tilt">
            <div class="highlight-title">Location</div>
          <div>🌎 ${esc(locationLabel)}</div>
        </div>
      </div>
    </div>
  `;

  clearInterval(heroRoleTimer);
  let roleIndex = 0;
  heroRoleTimer = setInterval(() => {
    const roleText = document.getElementById('hero-role-text');
    if (!roleText) return;
    roleText.classList.add('is-changing');
    setTimeout(() => {
      roleIndex = (roleIndex + 1) % heroRoles.length;
      roleText.textContent = heroRoles[roleIndex];
      roleText.classList.remove('is-changing');
    }, 250);
  }, 2600);

  // Image fallback
  const img = document.getElementById('profile-img');
  img.addEventListener('error', () => {
    img.style.display = 'none';
    document.getElementById('profile-fallback').style.display = 'flex';
  });
  // If already broken (cached error)
  if (img.complete && img.naturalWidth === 0) {
    img.style.display = 'none';
    document.getElementById('profile-fallback').style.display = 'flex';
  }
}

/* ── ABOUT ───────────────────────────────────────────────────────── */
function renderAbout() {
  const p = Content.getProfile().personal;

  // Instead of using PORTFOLIO.about data directly, we use p.about text blocks dynamically
  const aboutText = p.about || '';
  const paras = aboutText.split('\\n').filter(Boolean).map(p => `<p>${esc(p)}</p>`).join('');

  // Default cards
  const cardsHtml = `
    <div class="info-card">
      <div class="info-card-icon">🎯</div>
      <div class="info-card-label">Focus</div>
      <div class="info-card-value">${esc(p.focus || 'Software & Web Dev')}</div>
    </div>
    <div class="info-card">
      <div class="info-card-icon">📍</div>
      <div class="info-card-label">Location</div>
      <div class="info-card-value">${esc(p.location || 'Vijayawada, India')}</div>
    </div>
    <div class="info-card">
      <div class="info-card-icon">📧</div>
      <div class="info-card-label">Email</div>
      <div class="info-card-value">${esc(p.email)}</div>
    </div>
  `;

  document.getElementById('about-content').innerHTML = `
    <div class="about-grid">
      <div class="about-text reveal">${paras}</div>
      <div class="about-info-grid reveal reveal-delay-1">${cardsHtml}</div>
    </div>
  `;
}

/* ── EDUCATION ───────────────────────────────────────────────────── */
function renderEducation() {
  const eduData = typeof Content !== 'undefined' ? Content.getEducation() : PORTFOLIO.education;

  const html = eduData.map((e, i) => `
    <div class="edu-card tilt reveal${i ? ' reveal-delay-' + Math.min(i, 4) : ''}">
      <div class="edu-icon-wrap">🎓</div>
      <div>
        <div class="edu-degree">${esc(e.degree)}${e.branch ? ` – ${esc(e.branch)}` : ''}</div>
        <div class="edu-college">${esc(e.college)}</div>
        <div class="edu-university">${esc(e.university)}</div>
        <div class="edu-meta">
          ${e.year ? `<span class="edu-chip">📅 ${esc(e.year)}</span>` : ''}
          ${e.cgpa ? `<span class="edu-chip">📊 ${esc(e.cgpa)}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById('education-content').innerHTML =
    html ? `<div class="education-list">${html}</div>`
      : `<div class="section-empty"><div class="section-empty-icon">🎓</div><p>Education details coming soon.</p></div>`;
}

/* ── SKILLS ──────────────────────────────────────────────────────── */
function renderSkills() {
  // Reads from localStorage via Content module (falls back to PORTFOLIO.skills)
  const categories = Content.getSkills();
  let i = 0;
  const html = Object.entries(categories).map(([cat, skills]) => {
    const tags = skills.map(s => `<span class="badge">${esc(s)}</span>`).join('');
    const delay = i > 0 ? ` reveal-delay-${Math.min(i, 4)}` : '';
    i++;
    return `
      <div class="skill-category reveal${delay}">
        <div class="skill-cat-title">${esc(cat)}</div>
        <div class="skill-tags">${tags}</div>
      </div>
    `;
  }).join('');

  document.getElementById('skills-content').innerHTML = `<div class="skills-grid">${html}</div>`;
}

/* ── CURRENTLY LEARNING ──────────────────────────────────────────── */
function renderLearning() {
  // Reads from localStorage via Content module (falls back to PORTFOLIO.learning)
  const items = Content.getLearning();
  if (!items || !items.length) {
    document.getElementById('learning-content').innerHTML =
      `<div class="section-empty"><div class="section-empty-icon">📚</div><p>Add what you're studying in the admin panel (Ctrl+Shift+A → 📚 Edit Learning).</p></div>`;
    return;
  }
  const tags = items.map(t => `<span class="learning-tag">${esc(t)}</span>`).join('');
  document.getElementById('learning-content').innerHTML = `<div class="learning-tags reveal">${tags}</div>`;
}

/* ── CERTIFICATIONS ──────────────────────────────────────────────── */
function renderCertifications() {
  const certs = typeof Content !== 'undefined' ? Content.getCertifications() : PORTFOLIO.certifications;
  if (!certs || !certs.length) {
    document.getElementById('certs-content').innerHTML = `
      <div class="section-empty">
        <div class="section-empty-icon">🏆</div>
        <p>Certifications will appear here once added in <code>data.js</code>.</p>
      </div>
    `;
    return;
  }
  const html = certs.map((c, i) => `
    <div class="cert-card reveal${i ? ' reveal-delay-' + Math.min(i, 4) : ''}">
      <div class="cert-org">${esc(c.org)}</div>
      <div class="cert-name">${esc(c.name)}</div>
      <div class="cert-date">${esc(c.date)}</div>
      ${c.link ? `<a href="${esc(c.link)}" class="btn btn-outline btn-sm cert-link-btn" target="_blank" rel="noopener">${svgLink(12)} View Credential</a>` : ''}
    </div>
  `).join('');
  document.getElementById('certs-content').innerHTML = `<div class="certs-grid">${html}</div>`;
}

/* ── EXPERIENCE ──────────────────────────────────────────────────── */
function renderExperience() {
  const exp = typeof Content !== 'undefined' ? Content.getExperience() : PORTFOLIO.experience;
  if (!exp || !exp.length) {
    document.getElementById('experience-content').innerHTML = `
      <div class="section-empty">
        <div class="section-empty-icon">💼</div>
        <p>Experience details will appear here. Add entries in <code>data.js</code>.</p>
      </div>
    `;
    return;
  }
  const html = exp.map((e, i) => `
    <div class="exp-card reveal${i ? ' reveal-delay-' + Math.min(i, 4) : ''}">
      <div class="exp-header">
        <div>
          <div class="exp-title">${esc(e.title)}</div>
          <div class="exp-company">${esc(e.company)}</div>
        </div>
        <div class="exp-meta">
          <span class="exp-type">${esc(e.type)}</span>
          <span class="exp-duration">${esc(e.duration)}</span>
          ${e.location ? `<span style="font-size:0.78rem;color:var(--text-muted)">${esc(e.location)}</span>` : ''}
        </div>
      </div>
      ${e.points?.length ? `<ul class="exp-points">${e.points.map(pt => `<li>${esc(pt)}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('');
  document.getElementById('experience-content').innerHTML = `<div class="experience-list">${html}</div>`;
}

/* ── RESUME ──────────────────────────────────────────────────────── */
function renderResume() {
  const r = Content.getProfile().resume;
  document.getElementById('resume-content').innerHTML = `
    <div class="resume-box reveal">
      <div class="resume-icon">📄</div>
      <h3 class="resume-title">My Resume</h3>
      <p class="resume-desc">Download or view my latest resume below.<br><i>Updated via Admin Panel</i></p>
      <div class="resume-buttons">
        <a href="${esc(r.path)}" target="_blank" class="btn btn-primary" id="btn-view-resume">
          ${svgEye(16)} View Resume
        </a>
        <a href="${esc(r.path)}" target="_blank" class="btn btn-outline" id="btn-download-resume">
          ${svgDownload(16)} Download / Save
        </a>
      </div>
    </div>
  `;
}

/* ── CONTACT ─────────────────────────────────────────────────────── */
function renderContact() {
  const p = Content.getProfile().personal;
  const links = [];
  if (p.email) links.push({ href: `mailto:${p.email}`, label: p.email, icon: svgEmail(20) });
  if (p.github) links.push({ href: p.github, label: 'GitHub', icon: svgGitHub(20) });
  if (p.linkedin) links.push({ href: p.linkedin, label: 'LinkedIn', icon: svgLinkedIn(20) });
  if (p.phone) links.push({ href: `tel:${p.phone}`, label: p.phone, icon: svgPhone(20) });

  const linksHTML = links.map(l => `
    <a href="${esc(l.href)}" class="contact-link"
       ${l.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>
      ${l.icon}
      <span>${esc(l.label)}</span>
    </a>
  `).join('');

  document.getElementById('contact-content').innerHTML = `
    <div class="contact-inner">
      <p class="contact-tagline">
        Open to opportunities, collaborations, and interesting projects.<br>
        Feel free to reach out — I'd love to connect!
      </p>
      <div class="contact-links reveal">${linksHTML}</div>
      <div class="contact-cta reveal reveal-delay-2">
        "The best way to predict the future is to build it."
      </div>
    </div>
  `;
}

/* ── FOOTER ──────────────────────────────────────────────────────── */
function renderFooter() {
  const p = Content.getProfile().personal;
  const year = new Date().getFullYear();
  document.getElementById('footer-content').innerHTML = `
    <div class="footer-inner">
      <span class="footer-copy">© ${year} ${esc(p.name)} — Built with passion and code.</span>
      <div class="footer-links">
        ${p.github ? `<a href="${esc(p.github)}"   target="_blank" rel="noopener" aria-label="GitHub">${svgGitHub(16)}</a>` : ''}
        ${p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn">${svgLinkedIn(16)}</a>` : ''}
        ${p.email ? `<a href="mailto:${esc(p.email)}" aria-label="Email">${svgEmail(16)}</a>` : ''}
      </div>
    </div>
  `;
}

/* ── NAVIGATION ──────────────────────────────────────────────────── */
function initNav() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close mobile nav on link click
  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('open')) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Active section highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ── SCROLL REVEAL ───────────────────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  // Observe existing elements
  function observeAll() {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
  }

  observeAll();
  // Re-observe when projects section updates (dynamic content)
  const projectsSection = document.getElementById('projects-container');
  if (projectsSection) {
    new MutationObserver(observeAll).observe(projectsSection, { childList: true, subtree: true });
  }
}

/* ── PAGE META ───────────────────────────────────────────────────── */
function setPageMeta() {
  const p = PORTFOLIO.personal;
  document.title = `${p.name} — Portfolio`;
}

/* ── RICH UI ANIMATIONS ──────────────────────────────────────────── */
function initParticles() {
  if (typeof tsParticles === 'undefined') return;

  // Only init if in dark mode or we can tie it to theme later, but generally looks best in dark.
  // The "stars" preset works well. Let's configure it explicitly.
  tsParticles.load("tsparticles", {
    preset: "stars",
    background: { color: "transparent" },
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: ["#4F6EF7", "#FFFFFF", "#6B85FA"] },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 2, random: true },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        grab: { distance: 140, line_linked: { opacity: 0.5 } },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
}

function initTilt() {
  if (typeof VanillaTilt === 'undefined') return;
  VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 8,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
    scale: 1.02
  });
}

/* ── INIT ────────────────────────────────────────────────────────── */
function init() {
  setPageMeta();

  // Render all sections from data
  renderHero();
  renderAbout();
  renderEducation();
  renderSkills();
  renderLearning();
  renderResume();
  renderContact();
  renderFooter();

  // Init UI systems
  Theme.init();
  initNav();
  initReveal();
  Admin.init();
  Projects.init();
  Content.init();

  // Init Rich UI
  initParticles();
  initTilt();
}

document.addEventListener('DOMContentLoaded', init);
