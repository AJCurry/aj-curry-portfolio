/* =====================================================================
   AJ Curry — Portfolio
   Data-driven renderer. All content lives in data/content.json so it can
   be edited through Pages CMS (.pages.yml). This script fetches that file,
   builds the page (nav, hero, body sections, footer) into the same markup
   the design uses, then wires up the interactions.
   ===================================================================== */
(() => {
  'use strict';

  /* ---------- tiny DOM helper (textContent-safe for all glyphs) ---------- */
  const el = (tag, attrs, kids) => {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null) continue;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v;
      else n.setAttribute(k, v);
    }
    if (kids) (Array.isArray(kids) ? kids : [kids]).forEach(c => c && n.appendChild(c));
    return n;
  };

  /* ---------- helpers ---------- */
  const pad2 = (n) => String(n).padStart(2, '0');
  const stripBold = (t) => String(t == null ? '' : t).replace(/\*\*/g, '');
  // `**word**` → an emphasis element; everything else → text nodes.
  const mdBold = (text, tag) => {
    const parts = String(text == null ? '' : text).split('**');
    return parts.map((p, i) => {
      if (p === '') return null;
      return i % 2 === 1 ? el(tag, { text: p }) : document.createTextNode(p);
    }).filter(Boolean);
  };
  // Normalise an image path from the CMS to a URL relative to this page,
  // so it works whether the site is at the domain root or under a subpath.
  const assetUrl = (p) => {
    if (!p) return '';
    if (/^https?:\/\//.test(p)) return p;
    return String(p).replace(/^\/+/, '').replace(/^aj-curry-portfolio\//, '');
  };

  /* ---------- icon set (highlights) ---------- */
  const _svg = (p) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  const ICONS = {
    award: _svg('<circle cx="12" cy="8" r="5"/><path d="M8.5 12.6 7 21l5-3 5 3-1.5-8.4"/>'),
    gem: _svg('<path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18"/><path d="M8.5 3 7 9l5 12 5-12-1.5-6"/>'),
    star: _svg('<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.8 6.8 19l1-5.8L3.5 9.2l5.9-.9z"/>'),
    tv: _svg('<rect x="2" y="6.5" width="20" height="13" rx="2"/><path d="m8 22 4-3 4 3"/><path d="M3 6.5 7.5 2M21 6.5 16.5 2"/>'),
    music: _svg('<path d="M9 18V5l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="15" r="3"/>'),
    video: _svg('<path d="m16 9 5-3v12l-5-3"/><rect x="2" y="6" width="14" height="12" rx="2"/>'),
    grid: _svg('<rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/>'),
    mic: _svg('<rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 17v4"/>'),
    broadcast: _svg('<circle cx="12" cy="12" r="2"/><path d="M16.5 7.5a6 6 0 0 1 0 9M7.5 16.5a6 6 0 0 1 0-9M19.5 4.5a10 10 0 0 1 0 15M4.5 19.5a10 10 0 0 1 0-15"/>'),
    sparkle: _svg('<path d="M12 3v5M12 16v5M3 12h5M16 12h5M5.6 5.6l3.2 3.2M15.2 15.2l3.2 3.2M18.4 5.6l-3.2 3.2M8.8 15.2l-3.2 3.2"/>'),
    users: _svg('<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 6.1M20.5 20a5.6 5.6 0 0 0-4-5.4"/>'),
    play: _svg('<circle cx="12" cy="12" r="9"/><path d="M10 8.4 16 12l-6 3.6z"/>')
  };

  /* ---------- social glyphs (hero rail) ---------- */
  const SOCIAL = {
    x: { label: 'X (Twitter)', svg: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>' },
    twitter: { label: 'X (Twitter)', svg: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>' },
    instagram: { label: 'Instagram', svg: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="18" height="18" rx="5.2"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1.05" fill="currentColor" stroke="none"/></svg>' },
    tiktok: { label: 'TikTok', svg: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>' },
    snapchat: { label: 'Snapchat', svg: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.42.839-1.288 1.179-.089.029-.209.075-.344.119-.45.135-1.139.36-1.319.81-.09.225-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.282-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.03-.061-.046-.135-.046-.225-.015-.24.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.643.119-.853-.165-.434-.853-.658-1.302-.793-.135-.045-.255-.09-.345-.119-1.184-.464-1.288-.93-1.243-1.169.06-.345.464-.59.838-.59.135 0 .254.029.355.074.318.146.654.218.971.218.273 0 .442-.072.493-.094-.01-.15-.022-.318-.03-.49l-.003-.06c-.103-1.626-.229-3.652.3-4.847C7.857 1.077 11.214.793 12.206.793z"/></svg>' },
    linkedin: { label: 'LinkedIn', svg: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.64h.05c.53-.95 1.83-1.95 3.76-1.95 4.02 0 4.76 2.65 4.76 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21h-4z"/></svg>' },
    youtube: { label: 'YouTube', svg: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12zM9.8 15.3V8.7l5.7 3.3z"/></svg>' }
  };

  /* ---------- accordion factory (Career + Awards) ---------- */
  const makeAccItem = (openByDefault, btnContent, panelContent) => {
    const sign = el('span', { class: 'acc-sign', 'aria-hidden': 'true', text: openByDefault ? '–' : '+' });
    const btn = el('button', { class: 'acc-btn', type: 'button', 'aria-expanded': String(openByDefault) }, btnContent(sign));
    const panel = el('div', { class: 'acc-panel' }, el('div', { class: 'acc-panel-inner' }, panelContent));
    const item = el('div', { class: 'acc-item' + (openByDefault ? ' open' : '') }, [btn, panel]);
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      sign.textContent = open ? '–' : '+';
    });
    return item;
  };

  /* ============================ SECTION RENDERERS ============================ */

  const sectionHead = (num, title) => el('div', { class: 'section-head reveal' }, [
    num != null ? el('span', { class: 'section-num', text: num }) : null,
    el('h2', { class: 'section-title', text: title || '' })
  ].filter(Boolean));

  const renderHighlights = (b, num) => {
    const grid = el('div', { class: 'hl-accordion reveal card', id: 'hl-grid' });
    (b.items || []).forEach((h, i) => {
      const copy = el('p', { class: 'hl-tile-copy' }, mdBold(h.text, 'em'));
      const face = el('span', { class: 'hl-tile-face' }, [
        el('span', { class: 'hl-tile-num', text: pad2(i + 1) }),
        el('span', { class: 'hl-tile-icon', html: ICONS[h.icon] || ICONS.star })
      ]);
      grid.appendChild(el('div', {
        class: 'hl-tile', tabindex: '0', role: 'group', 'aria-label': stripBold(h.text)
      }, [face, el('div', { class: 'hl-tile-text' }, copy)]));
    });
    return el('section', { class: 'section', id: 'highlights' }, [sectionHead(num, b.title), grid]);
  };

  const qspreadPhoto = (b) => el('div', { class: 'qspread-photo' },
    el('div', { class: 'px-layer js-parallax', 'data-speed': '0.07' },
      el('img', {
        class: 'qspread-img', src: assetUrl(b.image), alt: b.imageAlt || '',
        loading: 'lazy', style: b.imagePosition ? 'object-position:' + b.imagePosition : null
      })
    )
  );

  const renderQuote = (b) => {
    const fig = el('figure', { class: 'qspread-text reveal' }, [
      el('span', { class: 'quote-mark', 'aria-hidden': 'true', text: '“' }),
      el('blockquote', { class: 'quote-body', text: b.quote || '' }),
      b.citation ? el('figcaption', { class: 'quote-cite', text: '— ' + b.citation }) : null
    ].filter(Boolean));
    return el('section', { class: 'qspread' + (b.side === 'right' ? ' alt' : '') }, [
      qspreadPhoto(b),
      el('div', { class: 'qspread-scrim', 'aria-hidden': 'true' }),
      el('div', { class: 'qspread-inner' }, fig)
    ]);
  };

  const renderDivider = (b) => {
    const wrap = el('div', { class: 'qspread-text reveal' }, el('p', { class: 'qspread-pull', text: b.headline || '' }));
    return el('section', { class: 'qspread' + (b.side === 'right' ? ' alt' : '') + ' qdivider' }, [
      qspreadPhoto(b),
      el('div', { class: 'qspread-scrim', 'aria-hidden': 'true' }),
      el('div', { class: 'qspread-inner' }, wrap)
    ]);
  };

  const renderCareer = (b, num) => {
    const acc = el('div', { class: 'acc reveal card', id: 'career-acc' });
    (b.roles || []).forEach((r, i) => {
      acc.appendChild(makeAccItem(
        i === 0,
        (sign) => el('div', { class: 'role-btn' }, [
          el('span', { class: 'role-dates', text: r.dates }),
          el('span', null, [
            el('span', { class: 'role-title', text: r.title }),
            el('span', { class: 'role-org', text: r.org })
          ]),
          sign
        ]),
        el('p', { class: 'role-desc', text: r.desc })
      ));
    });
    const kids = [sectionHead(num, b.title), acc];
    if (b.resumeUrl) {
      kids.push(el('a', {
        class: 'resume-link reveal', href: b.resumeUrl, target: '_blank', rel: 'noopener'
      }, [document.createTextNode((b.resumeLabel || 'View full résumé') + ' '), el('span', { 'aria-hidden': 'true', text: '→' })]));
    }
    return el('section', { class: 'section', id: 'career' }, kids);
  };

  const renderAwards = (b, num) => {
    const acc = el('div', { class: 'acc reveal card', id: 'awards-acc' });
    (b.orgs || []).forEach((o, i) => {
      const count = (o.groups || []).reduce((n, g) => n + (g.items ? g.items.length : 0), 0);
      const groupsWrap = el('div', { class: 'award-groups' });
      (o.groups || []).forEach((g) => {
        const items = el('div', { class: 'award-items' });
        (g.items || []).forEach((it) => {
          items.appendChild(el('div', { class: 'award-item' }, [
            el('span', { class: 'award-medal', text: it.medal ? it.medal + ' ' : '' }),
            el('a', { class: 'award-link', href: it.href, target: '_blank', rel: 'noopener', text: it.title }),
            document.createTextNode(' — ' + it.detail)
          ]));
        });
        groupsWrap.appendChild(el('div', { class: 'award-group' }, [
          el('div', { class: 'award-year', text: g.year }), items
        ]));
      });
      acc.appendChild(makeAccItem(
        i === 0,
        (sign) => el('div', { class: 'award-btn' }, [
          el('span', { class: 'award-head' }, [
            el('span', { class: 'award-name', text: o.name }),
            el('span', { class: 'award-tally', text: count + ' honors' })
          ]),
          sign
        ]),
        groupsWrap
      ));
    });
    return el('section', { class: 'section', id: 'awards' }, [sectionHead(num, b.title), acc]);
  };

  const renderProjects = (b, num) => {
    const rail = el('div', { class: 'rail', id: 'proj-rail' });
    (b.items || []).forEach((p, i) => {
      const rolesWrap = el('div', { class: 'proj-roles' },
        (p.roles || []).map((role) => el('span', { class: 'proj-role', text: role })));
      const media = [];
      if (p.image) media.push(el('img', { class: 'proj-photo', src: assetUrl(p.image), alt: p.title || '', loading: 'lazy' }));
      else media.push(el('span', { class: 'proj-num', 'aria-hidden': 'true', text: pad2(i + 1) }));
      if (p.tag) media.push(el('span', { class: 'proj-tag', text: p.tag }));
      media.push(el('span', { class: 'proj-badge', 'aria-hidden': 'true', text: '↗' }));
      rail.appendChild(el('article', { class: 'proj' + (p.image ? ' has-photo' : '') }, [
        el('a', { class: 'proj-media', href: p.href, target: '_blank', rel: 'noopener' },
          el('div', { class: 'proj-img' }, media)),
        el('h3', { class: 'proj-title', text: p.title }),
        rolesWrap,
        el('a', { class: 'proj-cta', href: p.href, target: '_blank', rel: 'noopener', text: p.cta })
      ]));
    });
    const head = el('div', { class: 'rail-head reveal' }, [
      el('div', { class: 'section-head', style: 'margin:0;' }, [
        num != null ? el('span', { class: 'section-num', text: num }) : null,
        el('h2', { class: 'section-title', text: b.title || '' })
      ].filter(Boolean)),
      el('div', { class: 'rail-nav' }, [
        el('span', { class: 'rail-hint', text: b.hint || 'Drag to explore' }),
        el('div', { class: 'rail-btns' }, [
          el('button', { class: 'rail-btn', id: 'proj-prev', 'aria-label': 'Previous projects', text: '←' }),
          el('button', { class: 'rail-btn', id: 'proj-next', 'aria-label': 'Next projects', text: '→' })
        ])
      ])
    ]);
    return el('section', { class: 'section', id: 'projects' }, [head, rail]);
  };

  const PRESS_VISIBLE = 8;
  const renderPress = (b, num) => {
    const grid = el('div', { class: 'press-grid reveal card', id: 'press-grid' });
    (b.items || []).forEach((a, i) => {
      grid.appendChild(el('a', {
        class: 'press-card' + (i >= PRESS_VISIBLE ? ' hidden' : ''),
        href: a.href, target: '_blank', rel: 'noopener'
      }, [
        el('span', { class: 'press-cta', text: a.cta }),
        el('h3', { class: 'press-title', text: a.title }),
        el('p', { class: 'press-desc', text: a.desc })
      ]));
    });
    const toggle = el('button', { class: 'press-toggle', id: 'press-toggle' });
    const kids = [
      sectionHead(num, b.title),
      grid,
      el('div', { class: 'press-toggle-wrap' }, toggle)
    ];
    if (b.panelists && b.panelists.length) {
      const pg = el('div', { class: 'panelist-grid reveal card', id: 'panelist-grid' });
      b.panelists.forEach((pn) => {
        pg.appendChild(el('div', { class: 'panelist' }, [
          el('span', { class: 'panelist-event', text: pn.event }),
          el('span', { class: 'panelist-date', text: pn.date })
        ]));
      });
      kids.push(el('h3', { class: 'panelist-head reveal', text: b.panelistTitle || 'Featured Panelist' }));
      kids.push(pg);
    }
    return el('section', { class: 'section', id: 'press' }, kids);
  };

  const RENDERERS = {
    highlights: renderHighlights,
    quote: renderQuote,
    divider: renderDivider,
    career: renderCareer,
    awards: renderAwards,
    projects: renderProjects,
    press: renderPress
  };
  const PRIMARY = { highlights: 1, career: 1, awards: 1, projects: 1, press: 1 };

  /* ---------- chrome: nav, hero, footer ---------- */
  const renderNav = (nav, navItems) => {
    const navEl = document.getElementById('nav');
    const right = el('div', { class: 'nav-right' });
    navItems.forEach((it) => right.appendChild(
      el('a', { class: 'navlink', href: '#' + it.id, text: it.label })));
    if (nav && nav.resumeUrl) {
      right.appendChild(el('a', {
        class: 'nav-cta', href: nav.resumeUrl, target: '_blank', rel: 'noopener',
        text: (nav && nav.resumeLabel) || 'Resume'
      }));
    }
    navEl.appendChild(el('a', { href: '#overview', class: 'nav-logo', text: (nav && nav.logo) || 'AJ Curry' }));
    navEl.appendChild(right);
  };

  const renderHero = (hero, firstSectionId) => {
    const img = el('img', { src: assetUrl(hero.image), alt: hero.imageAlt || '' });
    if (hero.imagePosition) img.style.setProperty('--hero-pos', hero.imagePosition);
    const social = el('nav', { class: 'hero-social', 'aria-label': 'Social media' },
      [el('span', { class: 'hero-social-label', 'aria-hidden': 'true', text: 'Follow' })]);
    (hero.social || []).forEach((s) => {
      const def = SOCIAL[(s.platform || '').toLowerCase()];
      if (!def || !s.url) return;
      social.appendChild(el('a', {
        class: 'hero-social-link', href: s.url, target: '_blank', rel: 'noopener',
        'aria-label': def.label, html: def.svg
      }));
    });
    return el('header', { class: 'hero', id: 'overview' }, [
      el('div', { class: 'hero-photo' }, [img, el('div', { class: 'hero-veil', 'aria-hidden': 'true' })]),
      el('div', { class: 'hero-content' }, [
        el('div', { class: 'eyebrow reveal' }, [
          el('span', { class: 'eyebrow-dot', 'aria-hidden': 'true' }),
          el('span', { class: 'eyebrow-text', text: hero.eyebrow || '' })
        ]),
        el('h1', { class: 'hero-title reveal', text: hero.name || '' }),
        el('p', { class: 'hero-intro reveal' }, mdBold(hero.intro, 'b'))
      ]),
      social,
      el('a', { href: '#' + (firstSectionId || 'highlights'), class: 'scroll-cue', 'aria-label': 'Scroll down' },
        [document.createTextNode('Scroll'), el('span', { class: 'line', 'aria-hidden': 'true' })])
    ]);
  };

  const renderFooter = (f) => {
    const footEl = document.getElementById('footer');
    const social = el('div', { class: 'footer-social' });
    (f.social || []).forEach((s) => social.appendChild(
      el('a', { href: s.url, target: '_blank', rel: 'noopener', text: s.label })));
    footEl.appendChild(el('div', { class: 'footer-inner' }, [
      el('div', { class: 'footer-top' }, [
        el('div', null, [
          el('p', { class: 'footer-kicker', text: f.kicker || '' }),
          el('a', { href: '#overview', class: 'footer-name', text: f.name || 'AJ Curry' })
        ]),
        social
      ]),
      el('div', { class: 'footer-bottom' }, [
        el('span', { class: 'footer-copy', text: f.copyright || '' }),
        el('a', { href: '#overview', class: 'footer-top-link' },
          [document.createTextNode('Back to top '), el('span', { 'aria-hidden': 'true', text: '↑' })])
      ])
    ]));
  };

  /* ============================== BUILD ============================== */
  const build = (data) => {
    const page = document.getElementById('page');

    // Pre-pass: number the primary sections and collect nav items (so reordering
    // renumbers and the nav always follows the section order).
    const nums = [];
    const navItems = [];
    let count = 0;
    (data.sections || []).forEach((b, i) => {
      if (PRIMARY[b.type]) { count++; nums[i] = pad2(count); navItems.push({ id: b.type, label: b.navLabel || b.title || b.type }); }
      else nums[i] = null;
    });
    const firstSectionId = navItems.length ? navItems[0].id : 'highlights';

    renderNav(data.nav || {}, navItems);
    page.appendChild(renderHero(data.hero || {}, firstSectionId));
    (data.sections || []).forEach((b, i) => {
      const fn = RENDERERS[b.type];
      if (fn) page.appendChild(fn(b, nums[i]));
    });
    renderFooter(data.footer || {});
  };

  /* ============================ INTERACTIONS ============================ */
  const initInteractions = (navItems) => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;

    // Split section titles into characters for the staggered reveal.
    document.querySelectorAll('.section-title').forEach((title) => {
      const text = title.textContent;
      title.textContent = '';
      let i = 0;
      Array.from(text).forEach((ch) => {
        if (ch === ' ') { title.appendChild(document.createTextNode(' ')); return; }
        const span = document.createElement('span');
        span.className = 'ch';
        span.textContent = ch;
        span.style.setProperty('--i', i++);
        title.appendChild(span);
      });
    });

    // Reveal on scroll (progressive enhancement + robust fallback).
    if ('IntersectionObserver' in window && !reduceMotion) {
      root.classList.add('js-anim');
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
      document.querySelectorAll('.reveal').forEach((n) => io.observe(n));
      setTimeout(() => {
        const probe = document.querySelector('.hero .reveal');
        if (!probe || parseFloat(getComputedStyle(probe).opacity) < 0.9) {
          root.classList.remove('js-anim');
        }
      }, 1500);
    }

    // Nav: shadow, link reveal, active section.
    const nav = document.getElementById('nav');
    const navLinks = Array.from(document.querySelectorAll('.navlink'));
    const sectionIds = navItems.map((n) => n.id);
    const onScrollNav = () => {
      const y = window.pageYOffset;
      nav.classList.toggle('scrolled', y > 16);
      nav.classList.toggle('show-links', y > window.innerHeight * 0.55);
      const mid = window.innerHeight * 0.35;
      let current = '';
      sectionIds.forEach((id) => {
        const sec = document.getElementById(id);
        if (sec && sec.getBoundingClientRect().top <= mid) current = id;
      });
      navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
    };

    // Parallax: drift each portrait photo within its frame.
    const pxEls = Array.from(document.querySelectorAll('.js-parallax'));
    const parallax = () => {
      if (reduceMotion) return;
      pxEls.forEach((elx) => {
        const frame = elx.parentElement;
        if (!frame) return;
        const r = frame.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const center = r.top + r.height / 2 - window.innerHeight / 2;
        const speed = parseFloat(elx.getAttribute('data-speed')) || 0.1;
        elx.style.transform = 'translateY(' + (-center * speed).toFixed(1) + 'px)';
      });
    };

    // Scroll progress bar (hairline at the top edge).
    const progressBar = document.getElementById('scroll-progress');
    const updateProgress = () => {
      if (!progressBar) return;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.pageYOffset / max)) : 0;
      progressBar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { onScrollNav(); parallax(); updateProgress(); ticking = false; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { onScrollNav(); parallax(); updateProgress(); }, { passive: true });
    onScrollNav();
    parallax();
    updateProgress();

    // Press: show all / show less.
    const pressGrid = document.getElementById('press-grid');
    const pressToggle = document.getElementById('press-toggle');
    if (pressGrid && pressToggle) {
      const total = pressGrid.querySelectorAll('.press-card').length;
      let pressOpen = false;
      const setLabel = () => { pressToggle.textContent = pressOpen ? 'Show less' : ('Show all ' + total + ' features'); };
      setLabel();
      pressToggle.addEventListener('click', () => {
        pressOpen = !pressOpen;
        pressGrid.querySelectorAll('.press-card').forEach((c, i) => {
          if (i >= PRESS_VISIBLE) c.classList.toggle('hidden', !pressOpen);
        });
        setLabel();
      });
    }

    // Projects rail: drag-to-scroll + prev/next.
    const track = document.getElementById('proj-rail');
    if (track) {
      let down = false, sx = 0, sl = 0, moved = false;
      track.addEventListener('pointerdown', (e) => { down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; });
      track.addEventListener('pointermove', (e) => {
        if (!down) return;
        const dx = e.clientX - sx;
        if (Math.abs(dx) > 4) { moved = true; track.style.cursor = 'grabbing'; }
        track.scrollLeft = sl - dx;
      });
      const up = () => { down = false; track.style.cursor = 'grab'; };
      track.addEventListener('pointerup', up);
      track.addEventListener('pointerleave', up);
      track.addEventListener('pointercancel', up);
      track.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
      const scrollProjects = (dir) => {
        const card = track.querySelector('.proj');
        const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
        const w = card ? card.getBoundingClientRect().width + gap : 340;
        track.scrollBy({ left: dir * w * 1.5, behavior: 'smooth' });
      };
      const prev = document.getElementById('proj-prev');
      const next = document.getElementById('proj-next');
      if (prev) prev.addEventListener('click', () => scrollProjects(-1));
      if (next) next.addEventListener('click', () => scrollProjects(1));
    }
  };

  /* ---------- smooth scroll (Lenis) + anchor binding ---------- */
  const initSmoothScroll = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const navH = () => { const n = document.getElementById('nav'); return n ? n.offsetHeight : 80; };
    const bindAnchors = (scrollTo) => {
      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
          const id = a.getAttribute('href');
          if (!id || id.length < 2) return;
          const t = document.querySelector(id);
          if (!t) return;
          e.preventDefault();
          scrollTo(t);
          if (history.pushState) history.pushState(null, '', id);
        });
      });
    };
    if (reduce || typeof Lenis === 'undefined') {
      bindAnchors((t) => t.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      return;
    }
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    bindAnchors((t) => lenis.scrollTo(t, { offset: -(navH() + 4), duration: 1.2 }));
    window.__lenis = lenis;
  };

  /* ---- Intro reveal: hold the navy overlay over the content load, then
     unveil the finished page with a single slide-up. ---- */
  const introEl = document.getElementById('intro');
  const removeIntro = () => {
    if (!introEl || !introEl.parentNode) return;
    introEl.classList.add('exit');
    const done = () => { if (introEl.parentNode) introEl.remove(); };
    introEl.addEventListener('transitionend', (e) => {
      if (e.target === introEl && e.propertyName === 'transform') done();
    }, { once: true });
    setTimeout(done, 1400);
    if (window.__lenis) window.__lenis.start();
  };
  // Absolute safety: never let the overlay trap the page if something stalls.
  const introSafety = setTimeout(removeIntro, 6000);
  const revealSite = (data) => {
    if (!introEl) return;
    const nameEl = introEl.querySelector('.intro-name');
    const tagEl = introEl.querySelector('.intro-tag');
    if (nameEl) nameEl.textContent = (data.hero && data.hero.name) || 'AJ Curry';
    if (tagEl) tagEl.textContent = (data.hero && data.hero.eyebrow) || '';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try { window.scrollTo(0, 0); } catch (e) {}
    if (window.__lenis) window.__lenis.stop();
    clearTimeout(introSafety);
    requestAnimationFrame(() => {
      introEl.classList.add('ready');
      setTimeout(removeIntro, reduce ? 200 : 820);
    });
  };

  /* ============================== BOOT ============================== */
  fetch('data/content.json', { cache: 'no-cache' })
    .then((r) => { if (!r.ok) throw new Error('content.json ' + r.status); return r.json(); })
    .then((data) => {
      build(data);
      const navItems = (data.sections || [])
        .filter((b) => PRIMARY[b.type])
        .map((b) => ({ id: b.type, label: b.navLabel || b.title || b.type }));
      initInteractions(navItems);
      initSmoothScroll();
      revealSite(data);
    })
    .catch((err) => {
      console.error('Failed to load site content:', err);
      clearTimeout(introSafety);
      removeIntro();
      const page = document.getElementById('page');
      if (page && !page.children.length) {
        page.appendChild(el('div', {
          style: 'max-width:640px;margin:22vh auto;padding:0 24px;font-family:Georgia,serif;color:#15171C;text-align:center;',
          html: '<p style="font-size:28px;line-height:1.3;">AJ Curry</p><p style="font-size:15px;color:#5A5E66;margin-top:12px;">Content is loading. If this message stays, please refresh.</p>'
        }));
      }
    });
})();
