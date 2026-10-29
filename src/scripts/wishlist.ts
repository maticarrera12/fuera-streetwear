const WISH_KEY = 'fuera-wishlist-v1';
const RECENT_KEY = 'fuera-recent-v1';
const RECENT_MAX = 8;

// localStorage is user-controlled and can throw (private mode), so validate and fall back to empty.
function read(key: string): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(raw) ? raw.filter((s): s is string => typeof s === 'string') : [];
  } catch {
    return [];
  }
}
function write(key: string, list: string[]) {
  try { localStorage.setItem(key, JSON.stringify(list)); } catch {}
}

const $$ = <T extends Element = HTMLElement>(sel: string) => [...document.querySelectorAll<T>(sel)];

function renderButtons() {
  const wished = new Set(read(WISH_KEY));
  for (const b of $$<HTMLButtonElement>('[data-wish]')) {
    const on = wished.has(b.dataset.slug!);
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', `${on ? 'Quitar de favoritos' : 'Guardar en favoritos'}: ${b.dataset.name}`);
  }
  for (const el of $$('[data-wish-count]')) {
    el.textContent = String(wished.size);
    el.hidden = wished.size === 0;
  }
}

// A collection is a server-rendered list of every product; we only show (and order) the ones in storage.
function renderCollections() {
  for (const box of $$('[data-collection]')) {
    const stored = box.dataset.collection === 'wishlist' ? read(WISH_KEY) : read(RECENT_KEY);
    const order = stored.filter((s) => s !== box.dataset.exclude);
    const items = $$('[data-slug]').filter((el) => el.parentElement === box);
    items.forEach((li) => (li.hidden = !order.includes(li.dataset.slug!)));
    order.forEach((s) => {
      const li = items.find((i) => i.dataset.slug === s);
      if (li) box.append(li);
    });
    const shown = items.filter((li) => !li.hidden).length;
    box.hidden = shown === 0;
    const wrap = box.closest<HTMLElement>('[data-collection-wrap]');
    if (wrap) wrap.hidden = shown === 0;
    wrap?.querySelector<HTMLElement>('[data-collection-empty]')?.toggleAttribute('hidden', shown > 0);
  }
}

function toggle(slug: string) {
  const list = read(WISH_KEY);
  write(WISH_KEY, list.includes(slug) ? list.filter((s) => s !== slug) : [slug, ...list]);
  renderButtons();
  renderCollections();
}

// Wishlist hearts live inside product cards, so clicks must not follow the card link.
document.addEventListener('click', (e) => {
  const btn = (e.target as Element).closest<HTMLButtonElement>('[data-wish]');
  if (!btn) return;
  e.preventDefault();
  toggle(btn.dataset.slug!);
});

const pdp = document.querySelector<HTMLElement>('[data-pdp]');
if (pdp) write(RECENT_KEY, [pdp.dataset.slug!, ...read(RECENT_KEY).filter((s) => s !== pdp.dataset.slug)].slice(0, RECENT_MAX));

renderButtons();
renderCollections();
