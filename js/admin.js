/**
 * Admin Module — Owner-only project management
 * Trigger: Ctrl + Shift + A
 * Auth: SHA-256 hashed PIN stored in localStorage (or PORTFOLIO.admin.pinHash)
 *
 * SECURITY NOTE: This is suitable for a personal/GitHub Pages portfolio.
 * It prevents casual visitors from accessing admin. Not production-grade.
 * Migrate to Firebase Auth, Supabase, or a backend API for real security.
 */

const Admin = (() => {
    const SESSION_KEY = 'portfolio-admin-session';
    const PIN_HASH_KEY = 'portfolio-admin-pin-hash';

    let overlay, loginModal, toolbar;
    let loginMode = 'login';

    /* ── Helpers ─────────────────────────────────────────────────── */
    async function sha256(str) {
        const buf = new TextEncoder().encode(str);
        const hash = await crypto.subtle.digest('SHA-256', buf);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    function getStoredHash() {
        return localStorage.getItem(PIN_HASH_KEY) || PORTFOLIO.admin.pinHash || null;
    }

    function isLoggedIn() {
        return sessionStorage.getItem(SESSION_KEY) === 'true';
    }

    function setLoggedIn(val) {
        if (val) sessionStorage.setItem(SESSION_KEY, 'true');
        else sessionStorage.removeItem(SESSION_KEY);
    }

    /* ── Toolbar ─────────────────────────────────────────────────── */
    function showToolbar() {
        document.body.classList.add('admin-mode');
        toolbar.classList.add('visible');
        // Refresh admin bars on project cards
        Projects.renderAll();
    }

    function hideToolbar() {
        document.body.classList.remove('admin-mode');
        toolbar.classList.remove('visible');
        Projects.renderAll();
    }

    function buildToolbar() {
        toolbar = document.getElementById('admin-toolbar');
        if (!toolbar) return;

        toolbar.innerHTML = `
      <span class="admin-badge">⚙ Admin</span>
      <button class="btn btn-outline btn-sm" id="btn-edit-profile">👤 Edit Profile</button>
    <button class="btn btn-outline btn-sm" id="btn-edit-highlights">✨ Edit Highlights</button>
      <button class="btn btn-primary btn-sm" id="btn-add-project">+ Add Project</button>
      <button class="btn btn-outline btn-sm" id="btn-edit-education">🎓 Edit Education</button>
      <button class="btn btn-outline btn-sm" id="btn-edit-exp">💼 Edit Experience</button>
      <button class="btn btn-outline btn-sm" id="btn-edit-cert">🏆 Edit Certifications</button>
      <button class="btn btn-outline btn-sm" id="btn-edit-skills">🛠 Edit Skills</button>
      <button class="btn btn-outline btn-sm" id="btn-edit-learning">📚 Edit Learning</button>
    <button class="btn btn-primary btn-sm" id="btn-publish-github">☁ Publish Changes</button>
      <button class="btn btn-ghost btn-sm" id="btn-admin-reset-pin" style="margin-left:auto;color:currentColor;">🔑 Change PIN</button>
      <button class="btn btn-ghost btn-sm" style="color:currentColor;" id="btn-admin-logout">Logout</button>
    `;

        document.getElementById('btn-add-project').addEventListener('click', () => {
            // const Projects is global-scope but NOT window.Projects — call directly
            Projects.openProjectForm();
        });
        document.getElementById('btn-edit-profile').addEventListener('click', () => {
            Content.openProfileEditor();
        });
        document.getElementById('btn-edit-highlights').addEventListener('click', () => {
            Content.openProfileEditor();
            setTimeout(() => document.getElementById('pe-availability')?.focus(), 0);
        });
        document.getElementById('btn-edit-education').addEventListener('click', () => {
            Content.openEducationEditor();
        });
        document.getElementById('btn-edit-exp').addEventListener('click', () => {
            Content.openExpEditor();
        });
        document.getElementById('btn-edit-cert').addEventListener('click', () => {
            Content.openCertEditor();
        });
        document.getElementById('btn-edit-skills').addEventListener('click', () => {
            Content.openSkillsEditor();
        });
        document.getElementById('btn-edit-learning').addEventListener('click', () => {
            Content.openLearningEditor();
        });
        document.getElementById('btn-publish-github').addEventListener('click', publishToGitHub);
        document.getElementById('btn-admin-reset-pin').addEventListener('click', resetPin);
        document.getElementById('btn-admin-logout').addEventListener('click', logout);
    }

    function resetPin() {
        openLoginModal('change');
    }

    /* ── Login Modal ─────────────────────────────────────────────── */
        function openLoginModal(mode = 'login') {
                loginMode = mode;
        const hasHash = !!getStoredHash();
        overlay = document.getElementById('modal-admin-login');
        const body = overlay.querySelector('.modal-body');
                const title = overlay.querySelector('#admin-modal-title');

                if (mode === 'change' && hasHash) {
                        title.textContent = '🔑 Change Admin PIN';
                        body.innerHTML = `
                <p style="font-size:0.875rem;color:var(--text-muted);margin-bottom:20px;">
                    Confirm your current PIN, then create a new one.
                </p>
                <div class="form-group">
                    <label class="form-label">Current PIN <span class="req">*</span></label>
                    <input type="password" class="form-input" id="admin-pin-current" placeholder="Enter current PIN" autocomplete="current-password"/>
                </div>
                <div class="form-group">
                    <label class="form-label">New PIN <span class="req">*</span></label>
                    <input type="password" class="form-input" id="admin-pin-new" placeholder="Create a new PIN" autocomplete="new-password"/>
                </div>
                <div class="form-group">
                    <label class="form-label">Confirm new PIN <span class="req">*</span></label>
                    <input type="password" class="form-input" id="admin-pin-confirm" placeholder="Confirm new PIN" autocomplete="new-password"/>
                </div>
                <div class="form-error-msg" id="admin-error"></div>
            `;
                        overlay.querySelector('#modal-admin-submit').textContent = 'Change PIN';
                        overlay.querySelector('.modal-close')?.focus();
                        overlay.classList.add('open');
                        wirePinEnterKey();
                        setTimeout(() => overlay.querySelector('#admin-pin-current')?.focus(), 100);
                        return;
                }

                title.textContent = '🔒 Admin Access';

        if (!hasHash) {
            // First-time setup
            body.innerHTML = `
        <p style="font-size:0.875rem;color:var(--text-muted);margin-bottom:20px;">
          No admin PIN set. Create one now. This PIN will be hashed and stored in your browser.
        </p>
        <div class="form-group">
          <label class="form-label">New PIN <span class="req">*</span></label>
          <input type="password" class="form-input" id="admin-pin-new" placeholder="Create a PIN" autocomplete="new-password"/>
        </div>
        <div class="form-group">
          <label class="form-label">Confirm PIN <span class="req">*</span></label>
          <input type="password" class="form-input" id="admin-pin-confirm" placeholder="Confirm PIN" autocomplete="new-password"/>
        </div>
        <div class="form-error-msg" id="admin-error"></div>
      `;
            overlay.querySelector('#modal-admin-submit').textContent = 'Set PIN & Login';
        } else {
            body.innerHTML = `
        <p style="font-size:0.875rem;color:var(--text-muted);margin-bottom:20px;">
          Enter your admin PIN to manage projects.
        </p>
        <div class="form-group">
          <label class="form-label">Admin PIN <span class="req">*</span></label>
          <input type="password" class="form-input" id="admin-pin-input" placeholder="Enter your PIN" autocomplete="current-password"/>
        </div>
        <div class="form-error-msg" id="admin-error"></div>
      `;
            overlay.querySelector('#modal-admin-submit').textContent = 'Login';
            setTimeout(() => overlay.querySelector('#admin-pin-input')?.focus(), 100);
        }

        overlay.classList.add('open');

        // Handle Enter key
        overlay.querySelectorAll('.form-input').forEach(inp => {
            inp.addEventListener('keydown', e => { if (e.key === 'Enter') submitLogin(); });
        });
    }

    function wirePinEnterKey() {
        overlay.querySelectorAll('.form-input').forEach(inp => {
            inp.addEventListener('keydown', e => { if (e.key === 'Enter') submitLogin(); });
        });
    }

    async function submitLogin() {
        const errEl = document.getElementById('admin-error');
        errEl.classList.remove('show');

        const hasHash = !!getStoredHash();

        if (loginMode === 'change' && hasHash) {
            const currentPin = document.getElementById('admin-pin-current').value.trim();
            const newPin = document.getElementById('admin-pin-new').value.trim();
            const confirmPin = document.getElementById('admin-pin-confirm').value.trim();

            if (!currentPin || !newPin || !confirmPin) {
                errEl.textContent = 'Please complete all PIN fields.';
                errEl.classList.add('show');
                return;
            }
            if (await sha256(currentPin) !== getStoredHash()) {
                errEl.textContent = 'Current PIN is incorrect.';
                errEl.classList.add('show');
                return;
            }
            if (newPin !== confirmPin) {
                errEl.textContent = 'New PINs do not match.';
                errEl.classList.add('show');
                return;
            }

            localStorage.setItem(PIN_HASH_KEY, await sha256(newPin));
            closeLoginModal();
            return;
        }

        if (!hasHash) {
            // Set new PIN flow
            const newPin = document.getElementById('admin-pin-new').value.trim();
            const confirmPin = document.getElementById('admin-pin-confirm').value.trim();
            if (!newPin) {
                errEl.textContent = 'Please enter a PIN.';
                errEl.classList.add('show');
                return;
            }
            if (newPin !== confirmPin) {
                errEl.textContent = 'PINs do not match.';
                errEl.classList.add('show');
                return;
            }

            const hash = await sha256(newPin);
            localStorage.setItem(PIN_HASH_KEY, hash);

            // Show hash to user so they can optionally add to data.js
            console.info(
                '%c[Admin] PIN hash (paste into PORTFOLIO.admin.pinHash in data.js for version-controlled auth):\n' + hash,
                'color: #4F6EF7; font-weight: bold;'
            );

            closeLoginModal();
            setLoggedIn(true);
            showToolbar();
        } else {
            // Login flow
            const pinEl = document.getElementById('admin-pin-input');
            const pin = pinEl.value.trim();
            if (!pin) {
                errEl.textContent = 'Please enter your PIN.';
                errEl.classList.add('show');
                pinEl.focus();
                return;
            }

            const hash = await sha256(pin);
            const storedHash = getStoredHash();

            if (hash === storedHash) {
                closeLoginModal();
                setLoggedIn(true);
                showToolbar();
            } else {
                errEl.textContent = 'Incorrect PIN. Try again.';
                errEl.classList.add('show');
                pinEl.value = '';
                pinEl.focus();
            }
        }
    }

    function closeLoginModal() {
        document.getElementById('modal-admin-login').classList.remove('open');
        loginMode = 'login';
    }

    function logout() {
        setLoggedIn(false);
        hideToolbar();
    }

    function encodeBase64(value) {
        return btoa(unescape(encodeURIComponent(value)));
    }

    function parseRepository(value) {
        try {
            const url = new URL(value.trim());
            const parts = url.pathname.split('/').filter(Boolean);
            if (url.hostname !== 'github.com' || parts.length < 2) return null;
            return { owner: parts[0], repo: parts[1].replace(/\.git$/, '') };
        } catch {
            return null;
        }
    }

    async function githubRequest(token, path, options = {}) {
        const response = await fetch(`https://api.github.com${path}`, {
            ...options,
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28',
                ...(options.headers || {})
            }
        });
        if (!response.ok) {
            const detail = await response.json().catch(() => ({}));
            throw new Error(detail.message || `GitHub request failed (${response.status})`);
        }
        return response.status === 204 ? null : response.json();
    }

    async function getFileSha(token, repo, path) {
        try {
            const file = await githubRequest(token, `/repos/${repo.owner}/${repo.repo}/contents/${path}`);
            return file.sha;
        } catch (error) {
            if (error.message.includes('Not Found')) return undefined;
            throw error;
        }
    }

    async function putRepositoryFile(token, repo, path, content, message) {
        const sha = await getFileSha(token, repo, path);
        const body = { message, content: encodeBase64(content) };
        if (sha) body.sha = sha;
        await githubRequest(token, `/repos/${repo.owner}/${repo.repo}/contents/${path}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
    }

    async function publishToGitHub() {
        const repositoryUrl = window.prompt('Enter your GitHub repository URL (example: https://github.com/username/portfolio):');
        if (!repositoryUrl) return;
        const repo = parseRepository(repositoryUrl);
        if (!repo) {
            window.alert('Please enter a valid GitHub repository URL.');
            return;
        }

        const token = window.prompt('Paste a GitHub fine-grained token with Contents: Read and write permission for this repository. It will not be saved:');
        if (!token) return;

        const profile = JSON.parse(JSON.stringify(Content.getProfile()));
        const profileImage = profile.personal?.image || '';
        const hasUploadedImage = profileImage.startsWith('data:image/');
        if (hasUploadedImage) profile.personal.image = 'assets/images/profile.jpg';

        const snapshot = {
            profile,
            skills: Content.getSkills(),
            learning: Content.getLearning(),
            education: Content.getEducation(),
            certifications: Content.getCertifications(),
            experience: Content.getExperience(),
            projects: Projects.getAll ? Projects.getAll() : []
        };
        const publishedFile = `/* Generated by the Admin panel. Do not edit manually. */\nwindow.PUBLISHED_CONTENT = ${JSON.stringify(snapshot)};\n`;

        try {
            const repoLabel = `${repo.owner}/${repo.repo}`;
            await putRepositoryFile(token, repo, 'js/published-content.js', publishedFile, 'Update portfolio content');
            if (hasUploadedImage) {
                const imageBase64 = profileImage.split(',')[1];
                const sha = await getFileSha(token, repo, 'assets/images/profile.jpg');
                const body = {
                    message: 'Update profile image',
                    content: imageBase64
                };
                if (sha) body.sha = sha;
                await githubRequest(token, `/repos/${repo.owner}/${repo.repo}/contents/assets/images/profile.jpg`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
            }
            window.alert(`Published successfully to ${repoLabel}. GitHub Pages may take a minute to deploy.`);
        } catch (error) {
            window.alert(`Publish failed: ${error.message}`);
        }
    }

    /* ── Init ────────────────────────────────────────────────────── */
    function init() {
        buildToolbar();

        // Keyboard shortcut Ctrl + Shift + A
        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                if (isLoggedIn()) {
                    logout();
                } else {
                    openLoginModal();
                }
            }
        });

        // Wire up admin login modal buttons
        const loginOverlay = document.getElementById('modal-admin-login');
        if (loginOverlay) {
            loginOverlay.querySelector('#modal-admin-submit')?.addEventListener('click', submitLogin);
            loginOverlay.querySelector('.modal-close')?.addEventListener('click', closeLoginModal);
            loginOverlay.querySelector('#modal-admin-cancel')?.addEventListener('click', closeLoginModal);
            loginOverlay.addEventListener('click', e => {
                if (e.target === loginOverlay) closeLoginModal();
            });
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && loginOverlay.classList.contains('open')) closeLoginModal();
            });
        }

        // Restore session after page reload
        if (isLoggedIn()) {
            showToolbar();
        }
    }

    return { init, isLoggedIn, openLoginModal };
})();
