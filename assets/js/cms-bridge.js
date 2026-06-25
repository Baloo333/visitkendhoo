/**
 * VISUAL CMS BRIDGE
 * This script allows the static site to be data-driven while remaining
 * fully functional as a static site.
 */

async function initCMS() {
  const pathParts = window.location.pathname.split('/');
  let page = pathParts.pop().replace('.html', '') || 'index';
  if (page === 'index') page = 'home';

  const dataPath = `data/${page}.yml`;
  const siteDataPath = 'data/site.yml';

  try {
    if (typeof jsyaml === 'undefined') {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js');
    }

    const [pageData, siteData] = await Promise.all([
      fetchData(dataPath),
      fetchData(siteDataPath)
    ]);

    if (siteData) applySiteData(siteData);
    if (pageData) applyPageData(pageData, page);

    // Refresh reveal animations after content injection
    if (window.observer) {
        document.querySelectorAll('.reveal').forEach(el => window.observer.observe(el));
    }

  } catch (e) {
    console.log('CMS Bridge: Operating in static mode.', e);
  }
}

async function fetchData(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const text = await res.text();
    return jsyaml.load(text);
  } catch(e) { return null; }
}

function applySiteData(data) {
    document.querySelectorAll('[data-cms-site]').forEach(el => {
        const key = el.dataset.cmsSite;
        if (data[key]) {
            if (el.tagName === 'A' && key === 'contact_email') el.href = `mailto:${data[key]}`;
            el.textContent = data[key];
        }
    });
}

function applyPageData(data, page) {
    if (data.hero) {
        const hero = document.querySelector('.hero-card, .subhero-card');
        if (hero) {
            if (data.hero.image) {
                const img = hero.querySelector('img');
                if (img) img.src = data.hero.image;
            }
            const eyebrow = hero.querySelector('.eyebrow');
            if (eyebrow) eyebrow.textContent = data.hero.eyebrow;
            const h1 = hero.querySelector('h1');
            if (h1) {
                const titleText = data.hero.title || '';
                if (data.hero.dhivehi_title) {
                    h1.innerHTML = `${titleText}<span class="dv">${data.hero.dhivehi_title}</span>`;
                } else {
                    h1.textContent = titleText;
                }
            }
            const lede = hero.querySelector('.lede');
            if (lede) lede.textContent = data.hero.lede;
        }
    }

    // Home Page Specifics
    if (page === 'home') {
        if (data.stats) {
            const statsWrap = document.querySelector('.stats');
            if (statsWrap) {
                statsWrap.innerHTML = data.stats.map(s => `
                    <div class="stat"><b>${s.value}</b><span>${s.label}</span></div>
                `).join('');
            }
        }
        if (data.experiences) {
            const cards = document.querySelectorAll('section:nth-of-type(3) .grid .card');
            data.experiences.forEach((exp, i) => {
                if (cards[i]) {
                    const ic = cards[i].querySelector('.ic');
                    if (ic) ic.textContent = exp.icon;
                    const h3 = cards[i].querySelector('h3');
                    if (h3) h3.textContent = exp.title;
                    const p = cards[i].querySelector('p');
                    if (p) p.textContent = exp.text;
                    const a = cards[i].querySelector('.card-link');
                    if (a) {
                        a.textContent = exp.link_label;
                        a.href = exp.link_url;
                    }
                }
            });
        }
        if (data.split_sections) {
            const splits = document.querySelectorAll('.split');
            data.split_sections.forEach((sec, i) => {
                if (splits[i]) {
                    const img = splits[i].querySelector('.split-media img');
                    if (img) img.src = sec.image;
                    const tag = splits[i].querySelector('.float-tag');
                    if (tag) tag.innerHTML = `<span class="em">${sec.float_tag_emoji}</span> ${sec.float_tag_text}`;
                    const eyebrow = splits[i].querySelector('.eyebrow');
                    if (eyebrow) eyebrow.textContent = sec.eyebrow;
                    const h2 = splits[i].querySelector('h2');
                    if (h2) h2.textContent = sec.title;
                    const p = splits[i].querySelector('p');
                    if (p) p.textContent = sec.text;
                    const btn = splits[i].querySelector('.btn');
                    if (btn) {
                        btn.textContent = sec.button_label;
                        btn.href = sec.button_url;
                    }
                }
            });
        }
    }

    // History Page Specifics
    if (page === 'history') {
        if (data.quick_facts) {
            const factList = document.querySelector('.card.bg-sky ul');
            if (factList) {
                factList.innerHTML = data.quick_facts.map(f => `
                    <li><strong>${f.label}:</strong> ${f.value}</li>
                `).join('');
            }
        }
        if (data.content_sections) {
            const sections = document.querySelectorAll('section:not(.subhero)');
            data.content_sections.forEach((sec, i) => {
                const el = sections[i + 1]; // Offset by 1 for the first text section
                if (el) {
                    const img = el.querySelector('.split-media img');
                    if (img) img.src = sec.image;
                    const tag = el.querySelector('.float-tag');
                    if (tag) tag.innerHTML = `<span class="em">${sec.float_tag_emoji}</span> ${sec.float_tag_text}`;
                    const eyebrow = el.querySelector('.eyebrow');
                    if (eyebrow) eyebrow.textContent = sec.eyebrow;
                    const h2 = el.querySelector('h2');
                    if (h2) h2.textContent = sec.title;
                    const p = el.querySelector('p');
                    if (p) p.textContent = sec.text;
                }
            });
        }
    }

    // Culture Page Specifics
    if (page === 'culture' && data.remedies) {
        const grid = document.querySelector('.grid-3');
        if (grid) {
            grid.innerHTML = data.remedies.map(r => `
                <div class="card reveal">
                    <div class="ic mint">🌿</div>
                    <h3>${r.name}</h3>
                    <p>${r.description}</p>
                </div>
            `).join('');
        }
    }

    // Explore Page Specifics
    if (page === 'explore' && data.excursions) {
        const list = document.querySelector('.excursion-list');
        if (list) {
            list.innerHTML = data.excursions.map(e => `
                <div class="excursion-row reveal">
                    <span class="name">${e.name}${e.note ? `<span class="note">${e.note}</span>` : ''}</span>
                    <span class="price">${e.price}${e.unit ? `<small>${e.unit}</small>` : ''}</span>
                </div>
            `).join('');
        }
    }

    // Plan Page Specifics
    if (page === 'plan') {
        if (data.guesthouses) {
            const grid = document.querySelector('#stay .grid');
            if (grid) {
                grid.innerHTML = data.guesthouses.map(g => `
                    <div class="card reveal" ${g.featured ? 'style="border:2px solid var(--sun);"' : ''}>
                        ${g.featured ? '<span class="chip chip-sun">⭐ Featured local guesthouse</span>' : '<div class="ic">🛏️</div>'}
                        <h3 style="font-size:${g.featured ? '1.5rem' : '1.2rem'}; margin-top:.7rem;">${g.name}</h3>
                        <p>${g.description}</p>
                        ${g.details ? `
                            <ul style="font-size:.92rem; color:var(--ink-soft); display:grid; gap:.5rem; margin-top:1.1rem;">
                                ${g.details.address ? `<li>📍 ${g.details.address}</li>` : ''}
                                ${g.details.email ? `<li>✉️ <a class="cite-link" href="mailto:${g.details.email}">${g.details.email}</a></li>` : ''}
                                ${g.details.phone ? `<li>📞 ${g.details.phone}</li>` : ''}
                                ${g.details.website ? `<li>🌐 <a class="cite-link" href="${g.details.website}" target="_blank" rel="noopener">${g.details.website.replace('https://','')}</a></li>` : ''}
                            </ul>
                        ` : ''}
                        ${g.button_label ? `
                            <a href="${g.button_url}" target="_blank" rel="noopener" class="btn btn-primary mt-2">${g.button_label}</a>
                        ` : ''}
                    </div>
                `).join('');
            }
        }
        if (data.ways_to_reach) {
            const steps = document.querySelectorAll('.steps .step');
            data.ways_to_reach.forEach((w, i) => {
                if (steps[i]) {
                    const num = steps[i].querySelector('.num');
                    if (num) num.textContent = w.icon;
                    const h4 = steps[i].querySelector('h4');
                    if (h4) h4.textContent = w.title;
                    const p = steps[i].querySelector('p');
                    if (p) p.textContent = w.text;
                }
            });
        }
        if (data.etiquette) {
            const items = document.querySelectorAll('.acc-item');
            data.etiquette.forEach((e, i) => {
                if (items[i]) {
                    const summary = items[i].querySelector('summary');
                    if (summary) summary.textContent = e.question;
                    const body = items[i].querySelector('.acc-body');
                    if (body) body.textContent = e.answer;
                }
            });
        }
    }

    // Generic data-cms fallback
    document.querySelectorAll('[data-cms]').forEach(el => {
        const path = el.dataset.cms.split('.');
        let value = data;
        for (const key of path) {
            value = value ? value[key] : null;
        }
        if (value && typeof value !== 'object') {
            if (el.tagName === 'IMG') el.src = value;
            else el.textContent = value;
        }
    });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

document.addEventListener('DOMContentLoaded', initCMS);
