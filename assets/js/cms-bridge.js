/**
 * VISUAL CMS BRIDGE
 * This script allows the static site to be data-driven while remaining
 * fully functional as a static site.
 */

async function initCMS() {
  const page = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  const dataPath = `data/${page === 'index' ? 'home' : page}.yml`;
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
    if (pageData) applyPageData(pageData);

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

function applyPageData(data) {
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
                if (data.hero.dhivehi_title) {
                    h1.innerHTML = `${data.hero.title}<span class="dv">${data.hero.dhivehi_title}</span>`;
                } else {
                    h1.textContent = data.hero.title;
                }
            }
            const lede = hero.querySelector('.lede');
            if (lede) lede.textContent = data.hero.lede;
        }
    }

    // Home Page Stats
    if (data.stats) {
        const statsWrap = document.querySelector('.stats');
        if (statsWrap) {
            statsWrap.innerHTML = data.stats.map(s => `
                <div class="stat"><b>${s.value}</b><span>${s.label}</span></div>
            `).join('');
        }
    }

    // Excursions list (Explore page)
    if (data.excursions) {
        const list = document.querySelector('.excursion-list');
        if (list) {
            list.innerHTML = data.excursions.map(e => `
                <div class="excursion-row">
                    <span class="name">${e.name}${e.note ? `<span class="note">${e.note}</span>` : ''}</span>
                    <span class="price">${e.price}${e.price !== 'Varies' ? '<small>per person</small>' : '<small>on request</small>'}</span>
                </div>
            `).join('');
        }
    }

    document.querySelectorAll('[data-cms]').forEach(el => {
        const path = el.dataset.cms.split('.');
        let value = data;
        for (const key of path) {
            value = value ? value[key] : null;
        }
        if (value) {
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
