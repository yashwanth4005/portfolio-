/**
 * content.js — Skills & Currently Learning admin editor
 * Persists to localStorage; falls back to PORTFOLIO data.js defaults.
 * Calling convention mirrors projects.js:
 *   Content.openSkillsEditor()   — opens Skills modal
 *   Content.openLearningEditor() — opens Currently Learning modal
 */

const Content = (() => {
    const PROFILE_KEY = 'portfolio-profile';
    const SKILLS_KEY = 'portfolio-skills';
    const LEARNING_KEY = 'portfolio-learning';
    const EDUCATION_KEY = 'portfolio-education';
    const CERT_KEY = 'portfolio-certifications';
    const EXP_KEY = 'portfolio-exp';

    /* ── Escape helper ────────────────────────────────────────────── */
    function esc(str) {
        return String(str ?? '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /* ── Data access ──────────────────────────────────────────────── */
    function getProfile() {
        try {
            const p = localStorage.getItem(PROFILE_KEY);
            if (p) return JSON.parse(p);
            return window.PUBLISHED_CONTENT?.profile || _getDefaultProfile();
        } catch {
            return window.PUBLISHED_CONTENT?.profile || _getDefaultProfile();
        }
    }

    function _getDefaultProfile() {
        const perf = JSON.parse(JSON.stringify(PORTFOLIO.personal || {}));
        // The original data structure had 'about' as a separate object with paragraphs.
        // We merged this into the personal profile editor for the CMS.
        if (PORTFOLIO.about && Array.isArray(PORTFOLIO.about.paragraphs)) {
            perf.about = PORTFOLIO.about.paragraphs.join('\\n\\n');
        } else {
            perf.about = perf.description || '';
        }
        // Image mapping
        perf.image = perf.profileImage || perf.image || '';
        perf.availability = perf.availability !== false;
        perf.availabilityLabel = perf.availabilityLabel || 'Available for Work';
        perf.location = perf.location || 'Vijayawada, IND';
        perf.topSkills = perf.topSkills || Object.values(PORTFOLIO.skills || {}).flat().slice(0, 4);

        return {
            personal: perf,
            resume: JSON.parse(JSON.stringify(PORTFOLIO.resume || {}))
        };
    }
    function getSkills() {
        try {
            const s = localStorage.getItem(SKILLS_KEY);
            return s ? JSON.parse(s) : JSON.parse(JSON.stringify(window.PUBLISHED_CONTENT?.skills || PORTFOLIO.skills));
        } catch { return JSON.parse(JSON.stringify(window.PUBLISHED_CONTENT?.skills || PORTFOLIO.skills)); }
    }

    function getLearning() {
        try {
            const s = localStorage.getItem(LEARNING_KEY);
            return s ? JSON.parse(s) : [...(window.PUBLISHED_CONTENT?.learning || PORTFOLIO.learning || [])];
        } catch { return [...(window.PUBLISHED_CONTENT?.learning || PORTFOLIO.learning || [])]; }
    }

    function getEducation() {
        try {
            const e = localStorage.getItem(EDUCATION_KEY);
            return e ? JSON.parse(e) : [...(window.PUBLISHED_CONTENT?.education || PORTFOLIO.education || [])];
        } catch { return [...(window.PUBLISHED_CONTENT?.education || PORTFOLIO.education || [])]; }
    }

    function getCertifications() {
        try {
            const c = localStorage.getItem(CERT_KEY);
            return c ? JSON.parse(c) : [...(window.PUBLISHED_CONTENT?.certifications || PORTFOLIO.certifications || [])];
        } catch { return [...(window.PUBLISHED_CONTENT?.certifications || PORTFOLIO.certifications || [])]; }
    }

    function getExperience() {
        try {
            const e = localStorage.getItem(EXP_KEY);
            return e ? JSON.parse(e) : [...(window.PUBLISHED_CONTENT?.experience || PORTFOLIO.experience || [])];
        } catch { return [...(window.PUBLISHED_CONTENT?.experience || PORTFOLIO.experience || [])]; }
    }

    function saveProfile(data) { localStorage.setItem(PROFILE_KEY, JSON.stringify(data)); }
    function saveSkills(data) { localStorage.setItem(SKILLS_KEY, JSON.stringify(data)); }
    function saveLearning(data) { localStorage.setItem(LEARNING_KEY, JSON.stringify(data)); }
    function saveEducation(data) { localStorage.setItem(EDUCATION_KEY, JSON.stringify(data)); }
    function saveCertifications(data) { localStorage.setItem(CERT_KEY, JSON.stringify(data)); }
    function saveExperience(data) { localStorage.setItem(EXP_KEY, JSON.stringify(data)); }

    /* ════════════════════════════════════════════════════════════════
       PROFILE EDITOR
    ════════════════════════════════════════════════════════════════ */
    let _profile = {};

    function openProfileEditor() {
        _profile = JSON.parse(JSON.stringify(getProfile())); // deep clone
        refreshProfileBody();
        document.getElementById('modal-profile-editor').classList.add('open');
    }

    function closeProfileEditor() {
        document.getElementById('modal-profile-editor').classList.remove('open');
    }

    function refreshProfileBody() {
        const body = document.getElementById('profile-editor-body');
        if (!body) return;
        const p = _profile.personal;
        const r = _profile.resume;

        body.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label" for="pe-name">Name</label>
                    <input id="pe-name" class="form-input" value="${esc(p.name)}"/>
                </div>
                <div class="form-group">
                    <label class="form-label" for="pe-headline">Headline</label>
                    <input id="pe-headline" class="form-input" value="${esc(p.headline)}"/>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label" for="pe-about">About Text</label>
                <textarea id="pe-about" class="form-textarea" style="min-height:90px">${esc(p.about)}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label" for="pe-image-file">Profile Picture <span style="font-weight:400;color:var(--text-muted)">(Native Upload)</span></label>
                <div style="display:flex; gap: 12px; align-items:center; margin-top:4px;">
                    <img id="pe-image-preview" src="${esc(p.image || '')}" style="width: 60px; height: 75px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg-surface); display: ${p.image ? 'block' : 'none'}"/>
                    <input id="pe-image-file" type="file" accept="image/*" class="form-input" style="flex:1" />
                </div>
                <p class="form-hint" style="margin-top:8px">Image is securely compressed (Base64) inside your browser's local storage.</p>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label" for="pe-email">Email</label>
                    <input id="pe-email" class="form-input" type="email" value="${esc(p.email)}"/>
                </div>
                <div class="form-group">
                    <label class="form-label" for="pe-phone">Phone</label>
                    <input id="pe-phone" class="form-input" value="${esc(p.phone)}"/>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label" for="pe-github">GitHub Link</label>
                    <input id="pe-github" class="form-input" type="url" value="${esc(p.github)}"/>
                </div>
                <div class="form-group">
                    <label class="form-label" for="pe-linkedin">LinkedIn Link</label>
                    <input id="pe-linkedin" class="form-input" type="url" value="${esc(p.linkedin)}"/>
                </div>
            </div>
            <div class="form-group" style="padding-top:12px;border-top:1px dashed var(--border)">
                <label class="form-label" for="pe-resume-path">Resume Link URL (Google Drive, OneDrive, etc.)</label>
                <p class="form-hint" style="margin-bottom:8px">Link to your resume. Cloud links prevent browser "Failed to load pdf" errors.</p>
                <input id="pe-resume-path" class="form-input" type="url" value="${esc(r.path)}"/>
            </div>
            <div class="form-group" style="padding-top:12px;border-top:1px dashed var(--border)">
                <label class="form-label">Right-side Highlights</label>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="pe-availability">Work Availability</label>
                        <select id="pe-availability" class="form-input">
                            <option value="available" ${p.availability !== false ? 'selected' : ''}>Available for Work</option>
                            <option value="unavailable" ${p.availability === false ? 'selected' : ''}>Not Available</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="pe-location">Location</label>
                        <input id="pe-location" class="form-input" value="${esc(p.location || '')}" placeholder="Vijayawada, IND"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="pe-top-skills">Top Skills</label>
                    <input id="pe-top-skills" class="form-input" value="${esc((p.topSkills || []).join(', '))}" placeholder="Python, C, SQL, Spring Boot"/>
                    <p class="form-hint">Separate skills with commas. The first four appear on the right.</p>
                </div>
            </div>
        `;

        // Canvas Compressor logic
        const fileInp = document.getElementById('pe-image-file');
        const preview = document.getElementById('pe-image-preview');
        fileInp.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_SIZE = 800; // Optimal max dimension for retaining quality without breaking localStorage 5MB limits

                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height = Math.round(height * (MAX_SIZE / width));
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width = Math.round(width * (MAX_SIZE / height));
                            height = MAX_SIZE;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.82); // 82% quality yields great results with a tiny footprint
                    _profile.personal.image = dataUrl;
                    preview.src = dataUrl;
                    preview.style.display = 'block';
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    function saveAndCloseProfile() {
        const p = _profile.personal;
        const r = _profile.resume;
        p.name = document.getElementById('pe-name').value.trim();
        p.headline = document.getElementById('pe-headline').value.trim();
        p.about = document.getElementById('pe-about').value.trim();
        p.email = document.getElementById('pe-email').value.trim();
        p.phone = document.getElementById('pe-phone').value.trim();
        p.github = document.getElementById('pe-github').value.trim();
        p.linkedin = document.getElementById('pe-linkedin').value.trim();
        r.path = document.getElementById('pe-resume-path').value.trim();
        p.availability = document.getElementById('pe-availability').value === 'available';
        p.availabilityLabel = p.availability ? 'Available for Work' : 'Not Available';
        p.location = document.getElementById('pe-location').value.trim();
        p.topSkills = document.getElementById('pe-top-skills').value.split(',').map(skill => skill.trim()).filter(Boolean).slice(0, 4);

        saveProfile(_profile);
        closeProfileEditor();
        // Since profile affects multiple sections (Hero, About, Contact, Resume, Nav),
        // we can simply reload the page to apply everything cleanly, OR re-render all those sections.
        // Re-rendering specific sections is smoother.
        if (typeof renderHero === 'function') renderHero();
        if (typeof renderAbout === 'function') renderAbout();
        if (typeof renderResume === 'function') renderResume();
        if (typeof renderContact === 'function') renderContact();
        // Also update document title
        document.title = `${p.name} — Portfolio`;
    }

    /* ════════════════════════════════════════════════════════════════
       EDUCATION EDITOR
    ════════════════════════════════════════════════════════════════ */
    let _education = [];

    function openEducationEditor() {
        _education = JSON.parse(JSON.stringify(getEducation())); // deep clone
        refreshEducationBody();
        document.getElementById('modal-education-editor').classList.add('open');
    }

    function closeEducationEditor() {
        document.getElementById('modal-education-editor').classList.remove('open');
    }

    function refreshEducationBody() {
        const body = document.getElementById('education-editor-body');
        if (!body) return;

        const eduHTML = _education.map((edu, idx) => `
            <div class="ce-category" style="margin-bottom:16px;">
                <div class="ce-cat-header" style="margin-bottom:12px;">
                    <span class="ce-cat-title">Item ${idx + 1}</span>
                    <button class="btn btn-ghost btn-sm ce-del-edu" data-idx="${idx}">✕ Remove</button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Degree (with Branch)</label>
                        <input class="form-input ce-edu-degree" data-idx="${idx}" value="${esc(edu.degree)}" placeholder="B.Tech Computer Science"/>
                    </div>
                    <div class="form-group">
                        <label class="form-label">College / School Name</label>
                        <input class="form-input ce-edu-college" data-idx="${idx}" value="${esc(edu.college)}" placeholder="College of Engineering"/>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">University / Location</label>
                        <input class="form-input ce-edu-uni" data-idx="${idx}" value="${esc(edu.university)}" placeholder="University Name"/>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Timeline / Year</label>
                        <input class="form-input ce-edu-year" data-idx="${idx}" value="${esc(edu.year)}" placeholder="2021 - 2025"/>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="ce-edu-cgpa-${idx}">CGPA / Grade</label>
                        <input id="ce-edu-cgpa-${idx}" class="form-input ce-edu-cgpa" data-idx="${idx}" value="${esc(edu.cgpa || '')}" placeholder="8.5 / 10 or 85%"/>
                    </div>
                </div>
            </div>
        `).join('');

        body.innerHTML = eduHTML || `<p class="text-muted" style="text-align:center;padding:24px 0">No education entries found.</p>`;

        // Event listeners for remove buttons inside this render
        body.querySelectorAll('.ce-del-edu').forEach(btn => {
            btn.addEventListener('click', (e) => {
                _education.splice(Number(e.target.dataset.idx), 1);
                refreshEducationBody();
            });
        });

        // Save bindings on change so we don't lose data when dynamically re-rendering
        body.querySelectorAll('input').forEach(inp => {
            inp.addEventListener('input', (e) => {
                const idx = Number(e.target.dataset.idx);
                if (e.target.classList.contains('ce-edu-degree')) _education[idx].degree = e.target.value;
                if (e.target.classList.contains('ce-edu-college')) _education[idx].college = e.target.value;
                if (e.target.classList.contains('ce-edu-uni')) _education[idx].university = e.target.value;
                if (e.target.classList.contains('ce-edu-year')) _education[idx].year = e.target.value;
                if (e.target.classList.contains('ce-edu-cgpa')) _education[idx].cgpa = e.target.value;
            });
        });
    }

    function saveAndCloseEducation() {
        saveEducation(_education);
        closeEducationEditor();
        if (typeof renderEducation === 'function') renderEducation();
    }

    /* ════════════════════════════════════════════════════════════════
       SKILLS EDITOR
    ════════════════════════════════════════════════════════════════ */
    let _skills = {};

    function openSkillsEditor() {
        _skills = JSON.parse(JSON.stringify(getSkills())); // deep clone
        refreshSkillsBody();
        document.getElementById('modal-skills-editor').classList.add('open');
    }

    function closeSkillsEditor() {
        document.getElementById('modal-skills-editor').classList.remove('open');
    }

    function refreshSkillsBody() {
        const body = document.getElementById('skills-editor-body');
        if (!body) return;

        const catsHTML = Object.entries(_skills).map(([cat, skills]) => `
            <div class="ce-category">
                <div class="ce-cat-header">
                    <span class="ce-cat-title">${esc(cat)}</span>
                    <button class="btn btn-ghost btn-sm ce-del-cat" data-cat="${esc(cat)}">✕ Remove category</button>
                </div>
                <div class="ce-chips">
                    ${(skills || []).map(s => `
                        <span class="ce-chip">
                            ${esc(s)}
                            <button class="ce-chip-remove" data-cat="${esc(cat)}" data-skill="${esc(s)}" aria-label="Remove ${esc(s)}">×</button>
                        </span>`).join('')}
                </div>
                <div class="ce-add-row">
                    <input class="form-input ce-skill-inp" data-cat="${esc(cat)}" placeholder="Type a skill, press Enter…" autocomplete="off"/>
                    <button class="btn btn-outline btn-sm ce-add-skill" data-cat="${esc(cat)}">+ Add</button>
                </div>
            </div>
        `).join('');

        body.innerHTML = `
            ${catsHTML}
            <div class="ce-add-cat-row">
                <input class="form-input" id="ce-newcat-inp" placeholder="New category name (e.g. &quot;Databases&quot;)…" autocomplete="off"/>
                <button class="btn btn-primary btn-sm" id="ce-add-cat-btn">+ Add Category</button>
            </div>
        `;

        /* bind events */
        body.querySelectorAll('.ce-del-cat').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm(`Remove category "${btn.dataset.cat}" and all its skills?`)) {
                    delete _skills[btn.dataset.cat];
                    refreshSkillsBody();
                }
            });
        });

        body.querySelectorAll('.ce-chip-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const { cat, skill } = btn.dataset;
                _skills[cat] = (_skills[cat] || []).filter(s => s !== skill);
                refreshSkillsBody();
            });
        });

        body.querySelectorAll('.ce-add-skill').forEach(btn => {
            btn.addEventListener('click', () => addSkillFromInput(btn.dataset.cat));
        });

        body.querySelectorAll('.ce-skill-inp').forEach(inp => {
            inp.addEventListener('keydown', e => {
                if (e.key === 'Enter') { e.preventDefault(); addSkillFromInput(inp.dataset.cat); }
            });
        });

        document.getElementById('ce-add-cat-btn').addEventListener('click', () => {
            const inp = document.getElementById('ce-newcat-inp');
            const val = inp.value.trim();
            if (!val) return;
            if (!_skills[val]) _skills[val] = [];
            inp.value = '';
            refreshSkillsBody();
        });

        document.getElementById('ce-newcat-inp').addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); document.getElementById('ce-add-cat-btn').click(); }
        });
    }

    function addSkillFromInput(cat) {
        const body = document.getElementById('skills-editor-body');
        // CSS.escape handles special chars in attribute selector
        const inp = body.querySelector(`.ce-skill-inp[data-cat="${CSS.escape(cat)}"]`);
        if (!inp) return;
        const vals = inp.value.split(',').map(v => v.trim()).filter(Boolean);
        vals.forEach(v => {
            if (!_skills[cat]) _skills[cat] = [];
            if (!_skills[cat].includes(v)) _skills[cat].push(v);
        });
        refreshSkillsBody();
    }

    function saveAndCloseSkills() {
        saveSkills(_skills);
        closeSkillsEditor();
        renderSkills(); // defined in main.js (global scope)
    }

    /* ════════════════════════════════════════════════════════════════
       LEARNING EDITOR
    ════════════════════════════════════════════════════════════════ */
    let _learning = [];

    function openLearningEditor() {
        _learning = [...getLearning()];
        refreshLearningBody();
        document.getElementById('modal-learning-editor').classList.add('open');
    }

    function closeLearningEditor() {
        document.getElementById('modal-learning-editor').classList.remove('open');
    }

    function refreshLearningBody() {
        const body = document.getElementById('learning-editor-body');
        if (!body) return;

        const chips = _learning.map(item => `
            <span class="ce-chip">
                ${esc(item)}
                <button class="ce-chip-remove le-remove" data-item="${esc(item)}" aria-label="Remove ${esc(item)}">×</button>
            </span>`).join('');

        body.innerHTML = `
            <p class="form-hint" style="margin-bottom:16px">
                Add technologies, topics, or concepts you are actively studying.<br>
                You can separate multiple items with a comma.
            </p>
            <div class="ce-chips" id="le-chips-wrap">
                ${chips || '<span style="font-size:0.85rem;color:var(--text-muted)">No items yet — add one below.</span>'}
            </div>
            <div class="ce-add-row" style="margin-top:16px">
                <input class="form-input" id="le-new-inp" placeholder="e.g. React.js, Docker, DSA…" autocomplete="off"/>
                <button class="btn btn-primary btn-sm" id="le-add-btn">+ Add</button>
            </div>
        `;

        body.querySelectorAll('.le-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                _learning = _learning.filter(i => i !== btn.dataset.item);
                refreshLearningBody();
            });
        });

        const leAddBtn = document.getElementById('le-add-btn');
        const leInp = document.getElementById('le-new-inp');

        leAddBtn.addEventListener('click', () => {
            const vals = leInp.value.split(',').map(v => v.trim()).filter(Boolean);
            vals.forEach(v => { if (!_learning.includes(v)) _learning.push(v); });
            refreshLearningBody();
        });

        leInp.addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); leAddBtn.click(); }
        });

        leInp.focus();
    }

    function saveAndCloseLearning() {
        saveLearning(_learning);
        closeLearningEditor();
        renderLearning(); // defined in main.js (global scope)
    }

    /* ════════════════════════════════════════════════════════════════
       CERTIFICATIONS EDITOR
    ════════════════════════════════════════════════════════════════ */
    let _certs = [];

    function openCertEditor() {
        _certs = JSON.parse(JSON.stringify(getCertifications()));
        refreshCertBody();
        document.getElementById('modal-cert-editor').classList.add('open');
    }

    function closeCertEditor() {
        document.getElementById('modal-cert-editor').classList.remove('open');
    }

    function refreshCertBody() {
        const body = document.getElementById('cert-editor-body');
        if (!body) return;

        const html = _certs.map((c, idx) => `
            <div class="ce-category" style="margin-bottom:16px;">
                <div class="ce-cat-header" style="margin-bottom:12px;">
                    <span class="ce-cat-title">Item ${idx + 1}</span>
                    <button class="btn btn-ghost btn-sm ce-del-cert" data-idx="${idx}">✕ Remove</button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <input class="form-input ce-cert-name" data-idx="${idx}" value="${esc(c.name || '')}" placeholder="AWS Developer"/>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Organization</label>
                        <input class="form-input ce-cert-org" data-idx="${idx}" value="${esc(c.org || '')}" placeholder="Amazon"/>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Date</label>
                        <input class="form-input ce-cert-date" data-idx="${idx}" value="${esc(c.date || '')}" placeholder="Aug 2024"/>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Link</label>
                        <input class="form-input ce-cert-link" data-idx="${idx}" value="${esc(c.link || '')}" placeholder="https://..."/>
                    </div>
                </div>
            </div>
        `).join('');

        body.innerHTML = html || `<p class="text-muted" style="text-align:center;padding:24px 0">No certifications found.</p>`;

        body.querySelectorAll('.ce-del-cert').forEach(btn => {
            btn.addEventListener('click', e => {
                _certs.splice(Number(e.target.dataset.idx), 1);
                refreshCertBody();
            });
        });

        body.querySelectorAll('input').forEach(inp => {
            inp.addEventListener('input', e => {
                const idx = Number(e.target.dataset.idx);
                if (e.target.classList.contains('ce-cert-name')) _certs[idx].name = e.target.value;
                if (e.target.classList.contains('ce-cert-org')) _certs[idx].org = e.target.value;
                if (e.target.classList.contains('ce-cert-date')) _certs[idx].date = e.target.value;
                if (e.target.classList.contains('ce-cert-link')) _certs[idx].link = e.target.value;
            });
        });
    }

    function saveAndCloseCert() {
        saveCertifications(_certs);
        closeCertEditor();
        if (typeof renderCertifications === 'function') renderCertifications();
    }

    /* ════════════════════════════════════════════════════════════════
       EXPERIENCE EDITOR
    ════════════════════════════════════════════════════════════════ */
    let _exp = [];

    function openExpEditor() {
        _exp = JSON.parse(JSON.stringify(getExperience()));
        // Convert points array to multiline string for simple textarea editing
        _exp.forEach(e => { if (Array.isArray(e.points)) e.pointsStr = e.points.join('\\n'); });
        refreshExpBody();
        document.getElementById('modal-exp-editor').classList.add('open');
    }

    function closeExpEditor() {
        document.getElementById('modal-exp-editor').classList.remove('open');
    }

    function refreshExpBody() {
        const body = document.getElementById('exp-editor-body');
        if (!body) return;

        const html = _exp.map((ex, idx) => `
            <div class="ce-category" style="margin-bottom:16px;">
                <div class="ce-cat-header" style="margin-bottom:12px;">
                    <span class="ce-cat-title">Item ${idx + 1}</span>
                    <button class="btn btn-ghost btn-sm ce-del-exp" data-idx="${idx}">✕ Remove</button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Role Title</label>
                        <input class="form-input ce-exp-title" data-idx="${idx}" value="${esc(ex.title || '')}" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Company</label>
                        <input class="form-input ce-exp-company" data-idx="${idx}" value="${esc(ex.company || '')}" />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Duration</label>
                        <input class="form-input ce-exp-duration" data-idx="${idx}" value="${esc(ex.duration || '')}" placeholder="Jan 2024 - Present" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Type / Location</label>
                        <input class="form-input ce-exp-type" data-idx="${idx}" value="${esc((ex.type || '') + (ex.location ? ' · ' + ex.location : ''))}" placeholder="Internship · Remote" />
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Key Points (One per line)</label>
                    <textarea class="form-textarea ce-exp-points" data-idx="${idx}" style="min-height:80px;font-size:0.9rem">${esc(ex.pointsStr || '')}</textarea>
                </div>
            </div>
        `).join('');

        body.innerHTML = html || `<p class="text-muted" style="text-align:center;padding:24px 0">No experience found.</p>`;

        body.querySelectorAll('.ce-del-exp').forEach(btn => {
            btn.addEventListener('click', e => {
                _exp.splice(Number(e.target.dataset.idx), 1);
                refreshExpBody();
            });
        });

        body.querySelectorAll('.ce-exp-title, .ce-exp-company, .ce-exp-duration, .ce-exp-type').forEach(inp => {
            inp.addEventListener('input', e => {
                const idx = Number(e.target.dataset.idx);
                if (e.target.classList.contains('ce-exp-title')) _exp[idx].title = e.target.value;
                if (e.target.classList.contains('ce-exp-company')) _exp[idx].company = e.target.value;
                if (e.target.classList.contains('ce-exp-duration')) _exp[idx].duration = e.target.value;
                if (e.target.classList.contains('ce-exp-type')) {
                    // split for basic storage
                    const parts = e.target.value.split('·').map(s => s.trim());
                    _exp[idx].type = parts[0] || '';
                    _exp[idx].location = parts[1] || '';
                }
            });
        });

        body.querySelectorAll('.ce-exp-points').forEach(ta => {
            ta.addEventListener('input', e => {
                _exp[Number(e.target.dataset.idx)].pointsStr = e.target.value;
            });
        });
    }

    function saveAndCloseExp() {
        // Convert pointsStr back to array securely before saving
        _exp.forEach(e => {
            if (e.pointsStr) {
                e.points = e.pointsStr.split('\\n').filter(s => s.trim() !== '');
            } else {
                e.points = [];
            }
            delete e.pointsStr;
        });
        saveExperience(_exp);
        closeExpEditor();
        if (typeof renderExperience === 'function') renderExperience();
    }

    /* ── Init ──────────────────────────────────────────────────────── */
    function init() {
        /* Profile modal */
        const pOverlay = document.getElementById('modal-profile-editor');
        if (pOverlay) {
            pOverlay.querySelector('#modal-profile-save')?.addEventListener('click', saveAndCloseProfile);
            pOverlay.querySelector('#modal-profile-cancel')?.addEventListener('click', closeProfileEditor);
            pOverlay.querySelector('.modal-close')?.addEventListener('click', closeProfileEditor);
            pOverlay.addEventListener('click', e => { if (e.target === pOverlay) closeProfileEditor(); });
            // Profile form can have a lot of text, so we skip Escape-to-close to prevent accidental data loss
        }

        /* Skills modal */
        const sOverlay = document.getElementById('modal-skills-editor');
        if (sOverlay) {
            sOverlay.querySelector('#modal-skills-save')?.addEventListener('click', saveAndCloseSkills);
            sOverlay.querySelector('#modal-skills-cancel')?.addEventListener('click', closeSkillsEditor);
            sOverlay.querySelector('.modal-close')?.addEventListener('click', closeSkillsEditor);
            sOverlay.addEventListener('click', e => { if (e.target === sOverlay) closeSkillsEditor(); });
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && sOverlay.classList.contains('open')) closeSkillsEditor();
            });
        }

        /* Learning modal */
        const lOverlay = document.getElementById('modal-learning-editor');
        if (lOverlay) {
            lOverlay.querySelector('#modal-learning-save')?.addEventListener('click', saveAndCloseLearning);
            lOverlay.querySelector('#modal-learning-cancel')?.addEventListener('click', closeLearningEditor);
            lOverlay.querySelector('.modal-close')?.addEventListener('click', closeLearningEditor);
            lOverlay.addEventListener('click', e => { if (e.target === lOverlay) closeLearningEditor(); });
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && lOverlay.classList.contains('open')) closeLearningEditor();
            });
        }

        /* Education modal */
        const eOverlay = document.getElementById('modal-education-editor');
        if (eOverlay) {
            eOverlay.querySelector('#modal-education-save')?.addEventListener('click', saveAndCloseEducation);
            eOverlay.querySelector('#modal-education-cancel')?.addEventListener('click', closeEducationEditor);
            eOverlay.querySelector('.modal-close')?.addEventListener('click', closeEducationEditor);
            eOverlay.querySelector('#modal-education-add')?.addEventListener('click', () => {
                _education.push({ degree: '', college: '', university: '', year: '', cgpa: '' });
                refreshEducationBody();
            });
            eOverlay.addEventListener('click', e => { if (e.target === eOverlay) closeEducationEditor(); });
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && eOverlay.classList.contains('open')) closeEducationEditor();
            });
        }

        /* Certifications modal */
        const cOverlay = document.getElementById('modal-cert-editor');
        if (cOverlay) {
            cOverlay.querySelector('#modal-cert-save')?.addEventListener('click', saveAndCloseCert);
            cOverlay.querySelector('#modal-cert-cancel')?.addEventListener('click', closeCertEditor);
            cOverlay.querySelector('.modal-close')?.addEventListener('click', closeCertEditor);
            cOverlay.querySelector('#modal-cert-add')?.addEventListener('click', () => {
                _certs.push({ name: '', org: '', date: '', link: '' });
                refreshCertBody();
            });
            cOverlay.addEventListener('click', e => { if (e.target === cOverlay) closeCertEditor(); });
        }

        /* Experience modal */
        const expOverlay = document.getElementById('modal-exp-editor');
        if (expOverlay) {
            expOverlay.querySelector('#modal-exp-save')?.addEventListener('click', saveAndCloseExp);
            expOverlay.querySelector('#modal-exp-cancel')?.addEventListener('click', closeExpEditor);
            expOverlay.querySelector('.modal-close')?.addEventListener('click', closeExpEditor);
            expOverlay.querySelector('#modal-exp-add')?.addEventListener('click', () => {
                _exp.push({ title: '', company: '', type: '', duration: '', location: '', points: [] });
                refreshExpBody();
            });
            expOverlay.addEventListener('click', e => { if (e.target === expOverlay) closeExpEditor(); });
        }
    }

    return {
        init,
        getProfile,
        getSkills,
        getLearning,
        getEducation,
        getCertifications,
        getExperience,
        openProfileEditor,
        openSkillsEditor,
        openLearningEditor,
        openEducationEditor,
        openCertEditor,
        openExpEditor
    };
})();
