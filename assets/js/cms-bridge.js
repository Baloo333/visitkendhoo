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
        const heroSection = document.querySelector('section.relative.min-h-screen, header.relative.w-full');
        if (heroSection) {
            if (data.hero.image) {
                const img = heroSection.querySelector('img, .bg-cover');
                if (img) {
                    if (img.tagName === 'IMG') img.src = data.hero.image;
                    else img.style.backgroundImage = `url('${data.hero.image}')`;
                }
            }
            const eyebrow = heroSection.querySelector('.font-label-md, .font-label-caps');
            if (eyebrow) eyebrow.textContent = data.hero.eyebrow;
            const h1 = heroSection.querySelector('h1');
            if (h1) {
                const titleText = data.hero.title || '';
                if (data.hero.dhivehi_title) {
                    h1.innerHTML = `${titleText}<span class="block font-headline-md text-headline-md text-secondary-fixed mt-2">${data.hero.dhivehi_title}</span>`;
                } else {
                    h1.textContent = titleText;
                }
            }
            const lede = heroSection.querySelector('p.font-body-lg');
            if (lede) lede.textContent = data.hero.lede;
        }
    }

    // Home Page Specifics
    if (page === 'home') {
        if (data.stats) {
            const statsGrid = document.querySelector('section.py-section-gap .grid.grid-cols-2');
            if (statsGrid) {
                const statCards = statsGrid.querySelectorAll('.bg-surface-container-lowest, .bg-white');
                data.stats.forEach((s, i) => {
                    if (statCards[i]) {
                        const h3 = statCards[i].querySelector('h3');
                        if (h3) h3.textContent = s.value;
                        const p = statCards[i].querySelector('p');
                        if (p) p.textContent = s.label;
                    }
                });
            }
        }
        if (data.experiences) {
            const expCards = document.querySelectorAll('section.bg-surface-container-low .grid .group');
            data.experiences.forEach((exp, i) => {
                if (expCards[i]) {
                    const ic = expCards[i].querySelector('.material-symbols-outlined');
                    if (ic) ic.textContent = exp.icon;
                    const h3 = expCards[i].querySelector('h3');
                    if (h3) h3.textContent = exp.title;
                    const p = expCards[i].querySelector('p');
                    if (p) p.textContent = exp.text;
                    const a = expCards[i].querySelector('a');
                    if (a) {
                        a.innerHTML = `${exp.link_label} <span class="material-symbols-outlined text-[18px]">arrow_forward</span>`;
                        a.href = exp.link_url;
                    }
                }
            });
        }
        if (data.split_sections) {
            const sections = document.querySelectorAll('section.py-section-gap.bg-background, section.py-section-gap.bg-surface-container-low');
            // Storytelling and Culture sections
            data.split_sections.forEach((sec, i) => {
                const el = sections[i];
                if (el) {
                    const img = el.querySelector('img');
                    if (img) img.src = sec.image;
                    const tag = el.querySelector('.glass-card span.font-body-md');
                    if (tag) tag.innerHTML = `<span class="text-2xl">${sec.float_tag_emoji}</span> ${sec.float_tag_text}`;
                    const eyebrow = el.querySelector('.font-label-md');
                    if (eyebrow) eyebrow.textContent = sec.eyebrow;
                    const h2 = el.querySelector('h2');
                    if (h2) h2.textContent = sec.title;
                    const p = el.querySelector('p.font-body-lg');
                    if (p) p.textContent = sec.text;
                    const btn = el.querySelector('a.inline-flex');
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
            const statsGrid = document.querySelector('#quick-facts-grid');
            if (statsGrid) {
                statsGrid.innerHTML = data.quick_facts.map(fact => `
                    <div class="bg-surface-container-lowest p-8 rounded-xl border border-surface-variant shadow-sm text-center reveal">
                        <h3 class="font-headline-lg text-headline-lg text-primary">${fact.value}</h3>
                        <p class="font-body-md text-[14px] text-on-surface-variant mt-2">${fact.label}</p>
                    </div>
                `).join('');
            }
        }
        if (data.content_sections) {
            const sections = document.querySelectorAll('main section.grid');
            data.content_sections.forEach((sec, i) => {
                const el = sections[i];
                if (el) {
                    const img = el.querySelector('img');
                    if (img) img.src = sec.image;
                    const tagLabel = el.querySelector('.glass-card .font-label-md');
                    if (tagLabel) tagLabel.textContent = sec.float_tag_text;
                    // Note: float_tag_emoji not explicitly used in the snippet for this section but could be added

                    const h2 = el.querySelector('h2');
                    if (h2) h2.textContent = sec.title;
                    const ps = el.querySelectorAll('p.font-body-md');
                    if (ps.length > 0) {
                        // Split text if it's long? In the snippet there are two p tags.
                        // For now just put the text in the first one.
                        ps[0].textContent = sec.text;
                    }
                }
            });
        }
    }

    // Culture Page Specifics
    if (page === 'culture' && data.remedies) {
        const grid = document.querySelector('section.w-full .grid-cols-1.md\\:grid-cols-3');
        if (grid) {
            grid.innerHTML = data.remedies.map(r => `
                <div class="bg-white rounded-xl overflow-hidden primary-shadow group reveal">
                    <div class="p-6">
                        <h3 class="font-headline-md text-headline-md text-primary mb-2">${r.name}</h3>
                        <p class="font-body-md text-body-md text-on-surface-variant">${r.description}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    // Explore Page Specifics
    if (page === 'explore' && data.excursions) {
        const pricingTable = document.querySelector('#excursions .space-y-4');
        if (pricingTable) {
            pricingTable.innerHTML = data.excursions.map(e => `
                <div class="flex justify-between items-center border-b border-outline-variant/30 pb-3 reveal">
                    <div class="flex flex-col">
                        <span class="font-body-md text-body-md text-on-background">${e.name}</span>
                        ${e.note ? `<span class="text-[12px] text-on-surface-variant">${e.note}</span>` : ''}
                    </div>
                    <div class="text-right">
                        <span class="font-label-md text-label-md text-primary block">${e.price}</span>
                        ${e.unit ? `<span class="text-[10px] text-on-surface-variant uppercase">${e.unit}</span>` : ''}
                    </div>
                </div>
            `).join('');
        }
    }

    // Plan Page Specifics
    if (page === 'plan') {
        if (data.guesthouses) {
            const grid = document.querySelector('#guesthouse-grid');
            if (grid) {
                grid.innerHTML = data.guesthouses.map(g => `
                    <div class="bg-surface-container-lowest p-8 rounded-xl border border-surface-variant shadow-sm group hover:-translate-y-1 transition-transform duration-300 reveal">
                        <div class="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mb-6 text-primary">
                            <span class="material-symbols-outlined">${g.featured ? 'hotel_class' : 'hotel'}</span>
                        </div>
                        <h3 class="font-headline-md text-[24px] font-semibold text-on-surface mb-4">${g.name}</h3>
                        <p class="font-body-md text-body-md text-on-surface-variant mb-6">${g.description}</p>
                        ${g.details ? `
                            <ul class="text-sm text-on-surface-variant space-y-2 mb-6">
                                ${g.details.address ? `<li class="flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">location_on</span> ${g.details.address}</li>` : ''}
                                ${g.details.email ? `<li class="flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">mail</span> <a href="mailto:${g.details.email}" class="hover:text-primary transition-colors">${g.details.email}</a></li>` : ''}
                                ${g.details.phone ? `<li class="flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">phone</span> ${g.details.phone}</li>` : ''}
                                ${g.details.website ? `<li class="flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">language</span> <a href="${g.details.website}" target="_blank" class="hover:text-primary transition-colors">${g.details.website.replace('https://','')}</a></li>` : ''}
                            </ul>
                        ` : ''}
                        ${g.button_label ? `
                            <a href="${g.button_url}" target="_blank" class="inline-flex bg-primary text-on-primary px-6 py-2 rounded-xl font-body-md text-body-md hover:-translate-y-0.5 transition-transform duration-200">
                                ${g.button_label}
                            </a>
                        ` : ''}
                    </div>
                `).join('');
            }
        }
        if (data.ways_to_reach) {
            const reachGrid = document.querySelector('#getting-there .grid-cols-1.md\\:grid-cols-3');
            if (reachGrid) {
                const options = reachGrid.querySelectorAll('.glass-panel');
                data.ways_to_reach.forEach((w, i) => {
                    if (options[i]) {
                        const icon = options[i].querySelector('.material-symbols-outlined');
                        // Mapping icon text to something reasonable if it's an emoji
                        if (w.icon === '✈️') icon.textContent = 'flight';
                        else if (w.icon === '🚤') icon.textContent = 'sailing';
                        else if (w.icon === '⛴️') icon.textContent = 'directions_boat';

                        const h3 = options[i].querySelector('h3');
                        if (h3) h3.textContent = w.title;
                        const p = options[i].querySelector('p');
                        if (p) p.textContent = w.text;
                    }
                });
            }
        }
        if (data.etiquette) {
            const etiquetteGrid = document.querySelector('section.bg-surface-bright .grid');
            if (etiquetteGrid) {
                etiquetteGrid.innerHTML = data.etiquette.map(e => `
                    <div class="flex items-start gap-4 p-6 glass-panel rounded-lg reveal">
                        <span class="material-symbols-outlined text-secondary" style="font-size: 28px;">info</span>
                        <div>
                            <h4 class="font-label-md text-label-md text-on-surface uppercase mb-2">${e.question}</h4>
                            <p class="font-body-md text-body-md text-on-surface-variant text-sm">
                                ${e.answer}
                            </p>
                        </div>
                    </div>
                `).join('');
            }
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
