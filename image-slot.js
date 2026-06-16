/* =====================================================================
   <image-slot> — user-fillable image placeholder (standalone)
   ---------------------------------------------------------------------
   Drop or browse an image to fill the slot; it persists in localStorage
   keyed by the element id. Sized by host CSS (width/height:100%).
   A trimmed, dependency-free re-implementation of the design prototype's
   slot — enough for AJ to drop her real divider photos in later.

   Attributes:
     id           persistence key (required to survive reloads)
     placeholder  empty-state caption
     fit          object-fit (default 'cover')
   ===================================================================== */
(() => {
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
  const MAX_DIM = 1600;            // cap longest side before storing
  const KEY = (id) => 'aj-imgslot:' + id;

  // Downscale + re-encode so localStorage isn't flooded by raw uploads.
  async function toDataUrl(file) {
    if (!('createImageBitmap' in window)) {
      return new Promise((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.onerror = rej;
        fr.readAsDataURL(file);
      });
    }
    const bmp = await createImageBitmap(file);
    try {
      const scale = Math.min(1, MAX_DIM / Math.max(bmp.width, bmp.height));
      const w = Math.max(1, Math.round(bmp.width * scale));
      const h = Math.max(1, Math.round(bmp.height * scale));
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(bmp, 0, 0, w, h);
      return c.toDataURL('image/webp', 0.85);
    } finally { bmp.close && bmp.close(); }
  }

  const CSS = `
    :host{display:block;position:relative;width:100%;height:100%;
      font:13px/1.3 'Archivo',system-ui,sans-serif;color:rgba(255,255,255,.8);}
    .frame{position:absolute;inset:0;overflow:hidden;background:rgba(255,255,255,.04);}
    .frame img{position:absolute;inset:0;width:100%;height:100%;
      object-fit:cover;display:none;-webkit-user-drag:none;user-select:none;}
    .ring{position:absolute;inset:0;pointer-events:none;
      border:1.5px dashed rgba(255,255,255,.3);transition:border-color .12s;}
    :host([data-over]) .ring{border-color:#fff;}
    :host([data-filled]) .ring{display:none;}
    .empty{position:absolute;inset:0;display:flex;flex-direction:column;
      align-items:center;justify-content:center;gap:8px;text-align:center;
      padding:16px;cursor:pointer;user-select:none;}
    .empty svg{opacity:.6;}
    .cap{max-width:90%;font-weight:600;letter-spacing:.02em;text-transform:uppercase;
      font-size:12px;}
    .sub{font-size:11px;color:rgba(255,255,255,.55);}
    .sub u{text-underline-offset:2px;}
    .empty:hover .sub u{color:#fff;}
    :host([data-over]) .frame{background:rgba(255,255,255,.10);}
    .remove{position:absolute;top:12px;right:12px;z-index:2;appearance:none;border:0;
      border-radius:6px;padding:6px 11px;cursor:pointer;font:600 11px 'Archivo',system-ui,sans-serif;
      letter-spacing:.04em;background:rgba(0,0,0,.55);color:#fff;backdrop-filter:blur(6px);
      opacity:0;pointer-events:none;transition:opacity .15s;}
    :host([data-filled]:hover) .remove{opacity:1;pointer-events:auto;}
    .remove:hover{background:rgba(0,0,0,.75);}
    .err{position:absolute;left:10px;bottom:10px;right:10px;z-index:3;
      background:rgba(0,0,0,.7);color:#fff;font-size:11px;padding:5px 8px;border-radius:5px;}
  `;

  const ICON = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
    + ' stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'
    + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>'
    + '<path d="m21 15-5-5L5 21"/></svg>';

  class ImageSlot extends HTMLElement {
    static get observedAttributes() { return ['placeholder', 'fit']; }

    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = '<style>' + CSS + '</style>'
        + '<div class="frame"><img alt="">'
        + '<div class="empty">' + ICON + '<div class="cap"></div>'
        + '<div class="sub">or <u>browse files</u></div></div>'
        + '<div class="ring"></div></div>'
        + '<button class="remove" type="button" title="Remove image">Remove</button>'
        + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._img = root.querySelector('img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._input = root.querySelector('input');
      this._depth = 0;
      this._err = null;

      this._empty.addEventListener('click', () => this._input.click());
      root.querySelector('.remove').addEventListener('click', () => this._set(null));
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((t) => this.addEventListener(t, this));
    }

    connectedCallback() { this._render(); }
    attributeChangedCallback() { if (this.shadowRoot) this._render(); }

    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        if (--this._depth <= 0) { this._depth = 0; this.removeAttribute('data-over'); }
      } else if (e.type === 'drop') {
        e.preventDefault();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }

    async _ingest(file) {
      this._error(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._error('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      try {
        const url = await toDataUrl(file);
        this._set(url);
      } catch (err) {
        this._error('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }

    _set(url) {
      if (!this.id) { this._local = url; this._render(); return; }
      try {
        if (url) localStorage.setItem(KEY(this.id), url);
        else localStorage.removeItem(KEY(this.id));
      } catch (e) {
        // localStorage may be full (large image) or blocked — fall back to session.
        this._local = url;
        if (url) this._error('Saved for this session only (storage full).');
      }
      this._render();
    }

    _stored() {
      if (this._local !== undefined) return this._local;
      try { return this.id ? localStorage.getItem(KEY(this.id)) : null; } catch (e) { return null; }
    }

    _error(msg) {
      if (this._err) { this._err.remove(); this._err = null; }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err'; d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => { if (this._err === d) { d.remove(); this._err = null; } }, 3000);
    }

    _render() {
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      this._img.style.objectFit = this.getAttribute('fit') || 'cover';
      const url = this._stored();
      if (url) {
        this._img.src = url;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
      } else {
        this._img.removeAttribute('src');
        this._img.style.display = 'none';
        this._empty.style.display = 'flex';
        this.removeAttribute('data-filled');
      }
    }
  }

  if (!customElements.get('image-slot')) customElements.define('image-slot', ImageSlot);
})();
