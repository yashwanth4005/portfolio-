/**
 * Projects Module
 * - Stores projects in localStorage
 * - Renders project cards and empty state
 * - Add / Edit / Delete project form (admin only)
 * - Project detail modal (public)
 */

const Projects = (() => {
    const STORAGE_KEY = 'portfolio-projects';

    /* ── Storage ─────────────────────────────────────────────────── */
    function getAll() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [...(window.PUBLISHED_CONTENT?.projects || [])];
        } catch { return [...(window.PUBLISHED_CONTENT?.projects || [])]; }
    }

    function save(projects) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }

    function getById(id) {
        return getAll().find(p => p.id === id) || null;
    }

    function upsert(project) {
        const all = getAll();
        const idx = all.findIndex(p => p.id === project.id);
        if (idx >= 0) all[idx] = project;
        else all.unshift(project);
        save(all);
    }

    function remove(id) {
        save(getAll().filter(p => p.id !== id));
    }

    function generateId() {
        return 'proj_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }

    /* ── Render ──────────────────────────────────────────────────── */
    function renderAll() {
        const container = document.getElementById('projects-container');
        if (!container) return;
        const projects = getAll();
        const isAdmin = typeof Admin !== 'undefined' && Admin.isLoggedIn();

        if (projects.length === 0) {
            container.innerHTML = renderEmptyState(isAdmin);
            if (isAdmin) {
                container.querySelector('#btn-empty-add-project')?.addEventListener('click', () => openProjectForm());
            }
            return;
        }

        container.innerHTML = `<div class="projects-grid">${projects.map(renderCard).join('')}</div>`;
        bindCardEvents();
    }

    function renderEmptyState(isAdmin) {
        return `
      <div class="projects-empty reveal">
        <div class="projects-empty-icon">🚀</div>
        <div class="projects-empty-title">Projects Coming Soon</div>
        <p class="projects-empty-desc">Projects I build while learning and solving real-world problems will appear here.</p>
        ${isAdmin ? `
          <div style="margin-top:24px">
            <button class="btn btn-primary" id="btn-empty-add-project">+ Add Your First Project</button>
          </div>
        ` : ''}
      </div>
    `;
    }

    function renderCard(p) {
        const isAdmin = typeof Admin !== 'undefined' && Admin.isLoggedIn();
        const imageSection = p.image
            ? `<img class="project-card-img" src="${escHtml(p.image)}" alt="${escHtml(p.title)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
         <div class="project-card-img-placeholder" style="display:none">📁</div>`
            : `<div class="project-card-img-placeholder">📁</div>`;

        const techTags = (p.technologies || [])
            .slice(0, 5)
            .map(t => `<span class="badge badge-neutral">${escHtml(t)}</span>`)
            .join('');

        const githubBtn = p.github
            ? `<a href="${escHtml(p.github)}" target="_blank" rel="noopener" class="btn btn-outline btn-sm" onclick="event.stopPropagation()">${svgGithub(14)} GitHub</a>`
            : '';
        const demoBtn = p.liveDemo
            ? `<a href="${escHtml(p.liveDemo)}" target="_blank" rel="noopener" class="btn btn-primary btn-sm" onclick="event.stopPropagation()">${svgExternal(14)} Live Demo</a>`
            : '';

        const featuredBadge = p.featured
            ? `<div class="project-featured-badge">★ Featured</div>`
            : '';

        const adminBar = isAdmin ? `
      <div class="project-admin-bar">
        <button class="btn btn-ghost btn-sm" data-action="edit" data-id="${p.id}">✏ Edit</button>
        <button class="btn btn-sm" style="color:var(--danger);border:1px solid var(--danger);background:transparent" data-action="delete" data-id="${p.id}">✕ Delete</button>
      </div>
    ` : '';

        return `
      <div class="project-card tilt" data-id="${p.id}" role="button" tabindex="0" aria-label="View ${escHtml(p.title)} project details">
        ${imageSection}
        <div class="project-card-body">
          ${featuredBadge}
          <div class="project-card-category">${escHtml(p.category || 'Project')}</div>
          <div class="project-card-title">${escHtml(p.title)}</div>
          <p class="project-card-desc">${escHtml(p.description || '')}</p>
          <div class="project-card-tags">${techTags}</div>
          <div class="project-card-actions">${githubBtn}${demoBtn}</div>
        </div>
        ${adminBar}
      </div>
    `;
    }

    function bindCardEvents() {
        document.querySelectorAll('.project-card').forEach(card => {
            // Click to open detail
            card.addEventListener('click', e => {
                if (e.target.closest('[data-action]')) return; // handled by admin bar
                if (e.target.closest('a')) return;
                const id = card.dataset.id;
                openDetailModal(id);
            });
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!e.target.closest('[data-action]')) openDetailModal(card.dataset.id);
                }
            });
        });

        // Admin bar actions
        document.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', e => { e.stopPropagation(); openProjectForm(btn.dataset.id); });
        });
        document.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                if (confirm('Delete this project? This cannot be undone.')) {
                    remove(btn.dataset.id);
                    renderAll();
                }
            });
        });
    }

    /* ── Project Detail Modal ───────────────────────────────────── */
    function openDetailModal(id) {
        const p = getById(id);
        if (!p) return;
        const overlay = document.getElementById('modal-project-detail');
        const body = overlay.querySelector('.modal-body');

        const imageSec = p.image
            ? `<img src="${escHtml(p.image)}" alt="${escHtml(p.title)}" class="detail-image" onerror="this.style.display='none'">`
            : '';

        const techTags = (p.technologies || [])
            .map(t => `<span class="badge badge-neutral">${escHtml(t)}</span>`)
            .join(' ');

        const featuresList = (p.features || []).length
            ? `<div class="detail-section-label">Key Features</div>
         <ul class="detail-features">${p.features.map(f => `<li>${escHtml(f)}</li>`).join('')}</ul>`
            : '';

        const contributionSec = p.contribution
            ? `<div class="detail-section-label">My Contribution</div>
         <p style="font-size:0.9rem;color:var(--text-secondary)">${escHtml(p.contribution)}</p>`
            : '';

        const githubBtn = p.github
            ? `<a href="${escHtml(p.github)}" target="_blank" rel="noopener" class="btn btn-outline">${svgGithub(16)} View on GitHub</a>`
            : '';
        const demoBtn = p.liveDemo
            ? `<a href="${escHtml(p.liveDemo)}" target="_blank" rel="noopener" class="btn btn-primary">${svgExternal(16)} Live Demo</a>`
            : '';

        const featuredBadge = p.featured
            ? `<span class="project-featured-badge" style="display:inline-flex;margin-bottom:8px">★ Featured Project</span><br>`
            : '';

        body.innerHTML = `
      ${imageSec}
      ${featuredBadge}
      <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:8px">${escHtml(p.title)}</h2>
      ${p.category ? `<div style="font-size:0.8rem;color:var(--accent);font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:12px">${escHtml(p.category)}</div>` : ''}
      <p style="font-size:0.95rem;color:var(--text-secondary);line-height:1.7;margin-bottom:16px">${escHtml(p.description || '')}</p>
      ${p.technologies?.length ? `<div class="detail-section-label">Technologies</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:4px">${techTags}</div>` : ''}
      ${featuresList}
      ${contributionSec}
      <div class="detail-actions">${githubBtn}${demoBtn}</div>
    `;

        overlay.querySelector('.modal-title').textContent = p.title;
        overlay.classList.add('open');
    }

    /* ── Project Form Modal ─────────────────────────────────────── */
    let _editingId = null;
    let _chips = [];
    let _features = [];

    function openProjectForm(editId = null) {
        _editingId = editId;
        _chips = [];
        _features = [];

        const overlay = document.getElementById('modal-project-form');
        const existing = editId ? getById(editId) : null;
        overlay.querySelector('.modal-title').textContent = editId ? 'Edit Project' : 'Add Project';

        const body = overlay.querySelector('.modal-body');
        body.innerHTML = buildFormHTML(existing);

        // Init chip input
        initChipInput(existing?.technologies || []);
        // Init features
        initFeatureList(existing?.features || []);

        overlay.classList.add('open');
        overlay.querySelector('#f-title')?.focus();
    }

    function buildFormHTML(data = null) {
        const cats = ['Web Development', 'Machine Learning', 'Data', 'Python', 'Mobile', 'Other'];
        return `
      <div class="form-group">
        <label class="form-label" for="f-title">Project Title <span class="req">*</span></label>
        <input id="f-title" class="form-input" type="text" placeholder="My Awesome Project" value="${escAttr(data?.title || '')}"/>
        <div class="form-error-msg" id="err-title">Title is required.</div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="f-github">GitHub Link <span class="req">*</span></label>
          <input id="f-github" class="form-input" type="url" placeholder="https://github.com/..." value="${escAttr(data?.github || '')}"/>
          <div class="form-error-msg" id="err-github">Enter a valid GitHub URL.</div>
        </div>
        <div class="form-group">
          <label class="form-label" for="f-live">Live Demo Link <span style="color:var(--text-muted);font-weight:400">(optional)</span></label>
          <input id="f-live" class="form-input" type="url" placeholder="https://..." value="${escAttr(data?.liveDemo || '')}"/>
          <div class="form-error-msg" id="err-live">Enter a valid URL.</div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="f-desc">Description <span class="req">*</span></label>
        <textarea id="f-desc" class="form-textarea" placeholder="What does this project do? What problem does it solve?">${escHtml(data?.description || '')}</textarea>
        <div class="form-error-msg" id="err-desc">Description is required.</div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="f-category">Category</label>
          <select id="f-category" class="form-select">
            ${cats.map(c => `<option value="${c}" ${data?.category === c ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="f-image">Project Image URL <span style="color:var(--text-muted);font-weight:400">(optional)</span></label>
          <input id="f-image" class="form-input" type="url" placeholder="https://..." value="${escAttr(data?.image || '')}"/>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Technologies Used <span class="req">*</span></label>
        <div class="chip-input-wrap" id="chip-wrap">
          <input class="chip-text-input" id="chip-input" type="text" placeholder="Type a tech and press Enter or comma" autocomplete="off"/>
        </div>
        <div class="form-hint">Press Enter or comma to add. Click × to remove.</div>
        <div class="form-error-msg" id="err-tech">Add at least one technology.</div>
      </div>
      <div class="form-group">
        <label class="form-label">Key Features <span style="color:var(--text-muted);font-weight:400">(optional)</span></label>
        <div id="feature-list-wrap" class="feature-list-wrap"></div>
        <button type="button" class="btn-add-feature" id="btn-add-feature">+ Add a feature point</button>
      </div>
      <div class="form-group">
        <label class="form-label" for="f-contribution">My Contribution <span style="color:var(--text-muted);font-weight:400">(optional)</span></label>
        <textarea id="f-contribution" class="form-textarea" style="min-height:70px" placeholder="Describe what you personally worked on...">${escHtml(data?.contribution || '')}</textarea>
      </div>
      <div class="form-group">
        <div class="form-toggle-row">
          <span class="toggle-label">⭐ Mark as Featured Project</span>
          <label class="toggle-switch">
            <input type="checkbox" id="f-featured" ${data?.featured ? 'checked' : ''}/>
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    `;
    }

    /* ── Chip (technology tags) input ───────────────────────────── */
    function initChipInput(existing = []) {
        _chips = [...existing];
        renderChips();
        const input = document.getElementById('chip-input');
        const wrap = document.getElementById('chip-wrap');
        if (!input || !wrap) return;
        wrap.addEventListener('click', () => input.focus());
        input.addEventListener('keydown', e => {
            if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
                e.preventDefault();
                addChip(input.value.trim());
                input.value = '';
            }
            if (e.key === 'Backspace' && !input.value && _chips.length) {
                _chips.pop();
                renderChips();
            }
        });
        input.addEventListener('blur', () => {
            if (input.value.trim()) { addChip(input.value.trim()); input.value = ''; }
        });
    }

    function addChip(val) {
        val = val.replace(/,/g, '').trim();
        if (!val || _chips.includes(val)) return;
        _chips.push(val);
        renderChips();
    }

    function removeChip(val) {
        _chips = _chips.filter(c => c !== val);
        renderChips();
    }

    function renderChips() {
        const wrap = document.getElementById('chip-wrap');
        const input = document.getElementById('chip-input');
        if (!wrap || !input) return;
        const existingChips = wrap.querySelectorAll('.chip');
        existingChips.forEach(c => c.remove());
        _chips.forEach(val => {
            const chip = document.createElement('span');
            chip.className = 'chip';
            chip.innerHTML = `${escHtml(val)}<button class="chip-remove" type="button" aria-label="Remove ${escHtml(val)}">×</button>`;
            chip.querySelector('.chip-remove').addEventListener('click', () => removeChip(val));
            wrap.insertBefore(chip, input);
        });
    }

    /* ── Feature list ───────────────────────────────────────────── */
    function initFeatureList(existing = []) {
        _features = [...existing];
        renderFeatures();
        document.getElementById('btn-add-feature')?.addEventListener('click', () => {
            _features.push('');
            renderFeatures();
            const rows = document.querySelectorAll('.feature-row input');
            rows[rows.length - 1]?.focus();
        });
    }

    function renderFeatures() {
        const wrap = document.getElementById('feature-list-wrap');
        if (!wrap) return;
        wrap.innerHTML = _features.map((f, i) => `
      <div class="feature-row">
        <input class="form-input" type="text" placeholder="Describe a key feature…" value="${escAttr(f)}" data-feat-idx="${i}"/>
        <button class="btn-remove-feature" type="button" data-feat-del="${i}" aria-label="Remove feature">✕</button>
      </div>
    `).join('');
        wrap.querySelectorAll('[data-feat-idx]').forEach(inp => {
            inp.addEventListener('input', () => { _features[+inp.dataset.featIdx] = inp.value; });
        });
        wrap.querySelectorAll('[data-feat-del]').forEach(btn => {
            btn.addEventListener('click', () => {
                _features.splice(+btn.dataset.featDel, 1);
                renderFeatures();
            });
        });
    }

    /* ── Form validate & save ───────────────────────────────────── */
    function validateAndSave() {
        let valid = true;
        const show = (id, condition) => {
            document.getElementById(id)?.classList.toggle('show', !condition);
            document.querySelector(`#${id}`)?.previousElementSibling?.classList?.toggle('error', !condition);
            if (!condition) valid = false;
        };

        const title = document.getElementById('f-title')?.value.trim();
        const github = document.getElementById('f-github')?.value.trim();
        const desc = document.getElementById('f-desc')?.value.trim();
        let liveDemo = document.getElementById('f-live')?.value.trim();
        const image = document.getElementById('f-image')?.value.trim();
        const category = document.getElementById('f-category')?.value;
        const featured = document.getElementById('f-featured')?.checked || false;
        const contribution = document.getElementById('f-contribution')?.value.trim();

        show('err-title', !!title);
        show('err-github', !!github && isValidUrl(github));
        show('err-desc', !!desc);
        show('err-tech', _chips.length > 0);

        if (liveDemo && !isValidUrl(liveDemo)) { show('err-live', false); }
        else document.getElementById('err-live')?.classList.remove('show');

        if (!valid) return;

        // Collect feature strings, filter empties
        const features = _features.map(f => f.trim()).filter(Boolean);

        const project = {
            id: _editingId || generateId(),
            title,
            github,
            liveDemo: liveDemo || '',
            description: desc,
            image: image || '',
            technologies: _chips,
            category: category || 'Other',
            featured,
            features,
            contribution: contribution || '',
            createdAt: _editingId ? getById(_editingId)?.createdAt : Date.now(),
            updatedAt: Date.now(),
        };

        upsert(project);
        closeProjectForm();
        renderAll();
    }

    function closeProjectForm() {
        document.getElementById('modal-project-form').classList.remove('open');
        _editingId = null;
        _chips = [];
        _features = [];
    }

    /* ── Detail modal close ─────────────────────────────────────── */
    function closeDetailModal() {
        document.getElementById('modal-project-detail').classList.remove('open');
    }

    /* ── URL validator ──────────────────────────────────────────── */
    function isValidUrl(str) {
        try { return ['http:', 'https:'].includes(new URL(str).protocol); }
        catch { return false; }
    }

    /* ── Escape helpers ─────────────────────────────────────────── */
    function escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    function escAttr(str) { return escHtml(str); }

    /* ── Icon SVGs ──────────────────────────────────────────────── */
    function svgGithub(size = 16) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>`;
    }
    function svgExternal(size = 16) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
    }

    /* ── Init ────────────────────────────────────────────────────── */
    function init() {
        // Project form modal buttons
        const formOverlay = document.getElementById('modal-project-form');
        if (formOverlay) {
            formOverlay.querySelector('#modal-project-submit')?.addEventListener('click', validateAndSave);
            formOverlay.querySelector('.modal-close')?.addEventListener('click', closeProjectForm);
            formOverlay.querySelector('#modal-project-cancel')?.addEventListener('click', closeProjectForm);
            // No click-outside-to-close for form (prevent accidental data loss)
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && formOverlay.classList.contains('open')) closeProjectForm();
            });
        }

        // Detail modal
        const detailOverlay = document.getElementById('modal-project-detail');
        if (detailOverlay) {
            detailOverlay.querySelector('.modal-close')?.addEventListener('click', closeDetailModal);
            detailOverlay.addEventListener('click', e => {
                if (e.target === detailOverlay) closeDetailModal();
            });
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && detailOverlay.classList.contains('open')) closeDetailModal();
            });
        }

        renderAll();
    }

    return { init, renderAll, openProjectForm, getAll };
})();
