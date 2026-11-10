/*
 * View-only document viewer.
 * Documents are shown as page images (no PDF is published), with right-click,
 * drag, and print disabled inside the viewer. Note: this discourages casual
 * downloading, but anything a browser can display can still be captured
 * (e.g. by screenshot).
 *
 * Usage: <button data-view="persona-mcmc" data-pages="9" data-title="..." data-width="860">
 */
(function () {
    'use strict';

    const viewer = document.createElement('div');
    viewer.className = 'viewer';
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');
    viewer.innerHTML =
        '<div class="viewer-bar">' +
        '  <span class="title"></span>' +
        '  <div class="controls">' +
        '    <button type="button" data-act="out" aria-label="Zoom out">−</button>' +
        '    <button type="button" data-act="in" aria-label="Zoom in">+</button>' +
        '    <button type="button" data-act="close">Close ✕</button>' +
        '  </div>' +
        '</div>' +
        '<div class="viewer-body"><div class="viewer-pages"></div>' +
        '<p class="viewer-note">View only. Please contact me for a copy.</p></div>';
    document.body.appendChild(viewer);

    const titleEl = viewer.querySelector('.title');
    const pagesEl = viewer.querySelector('.viewer-pages');
    const bodyEl = viewer.querySelector('.viewer-body');
    let width = 860;
    let lastFocus = null;

    function setWidth(w) {
        width = Math.max(480, Math.min(2000, w));
        pagesEl.style.setProperty('--vw', width + 'px');
    }

    function open(btn) {
        const id = btn.dataset.view;
        const n = parseInt(btn.dataset.pages, 10) || 1;
        titleEl.textContent = btn.dataset.title || '';
        setWidth(parseInt(btn.dataset.width, 10) || 860);
        pagesEl.innerHTML = '';
        for (let i = 1; i <= n; i++) {
            const page = document.createElement('div');
            page.className = 'viewer-page';
            const img = document.createElement('img');
            img.src = 'assets/research/' + id + '/page-' + i + '.jpg';
            img.alt = (btn.dataset.title || 'Document') + ', page ' + i;
            img.loading = i > 2 ? 'lazy' : 'eager';
            img.draggable = false;
            page.appendChild(img);
            pagesEl.appendChild(page);
        }
        lastFocus = document.activeElement;
        viewer.classList.add('open');
        document.body.style.overflow = 'hidden';
        bodyEl.scrollTop = 0;
        viewer.querySelector('[data-act="close"]').focus();
    }

    function close() {
        viewer.classList.remove('open');
        document.body.style.overflow = '';
        pagesEl.innerHTML = '';
        if (lastFocus) lastFocus.focus();
    }

    document.addEventListener('click', function (e) {
        const trigger = e.target.closest('[data-view]');
        if (trigger) { e.preventDefault(); open(trigger); return; }
        const act = e.target.closest('.viewer [data-act]');
        if (!act) return;
        if (act.dataset.act === 'close') close();
        if (act.dataset.act === 'in') setWidth(width + 200);
        if (act.dataset.act === 'out') setWidth(width - 200);
    });

    document.addEventListener('keydown', function (e) {
        if (!viewer.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        // block save / print shortcuts while viewing
        if ((e.metaKey || e.ctrlKey) && ['s', 'p'].includes(e.key.toLowerCase())) e.preventDefault();
    });

    viewer.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    viewer.addEventListener('dragstart', function (e) { e.preventDefault(); });
})();
