import { MAX_QTY, fmt, loadCart, photo, readCatalog, saveCart, type Line } from './cart-store';
import './wishlist';

const catalog = readCatalog();
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

/* ---------- Cart state ---------- */
let cart: Line[] = loadCart(catalog);

const save = () => saveCart(cart);
const count = () => cart.reduce((a, l) => a + l.qty, 0);

function setLine(key: string, fn: (q: number) => number) {
  cart = cart.map((l) => (l.key === key ? { ...l, qty: fn(l.qty) } : l)).filter((l) => l.qty > 0);
  save();
  renderCart();
}

function renderCart() {
  const n = count();
  $$('[data-cart-count]').forEach((el) => (el.textContent = String(n)));
  $$('[data-cart-count-label]').forEach((el) => (el.textContent = String(n)));
  $('[data-cart-trigger]')?.setAttribute('aria-label', `Abrir carrito, ${n} ${n === 1 ? 'producto' : 'productos'}`);

  $('[data-cart-empty]')!.hidden = n > 0;
  $('[data-cart-has]')!.hidden = n === 0;
  $('[data-cart-empty]')!.style.display = n > 0 ? 'none' : '';

  const list = $('[data-cart-lines]')!;
  const tpl = $<HTMLTemplateElement>('#cart-line')!;
  list.replaceChildren();
  let subtotal = 0;
  for (const l of cart) {
    const p = catalog[l.slug];
    const c = p.colors.find((x) => x.id === l.color) ?? p.colors[0];
    const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    $<HTMLAnchorElement>('[data-l-link]', node)!.href = `/p/${l.slug}/`;
    const img = $<HTMLImageElement>('[data-l-img]', node)!;
    img.src = photo(p.img, 300);
    img.alt = p.name;
    $('[data-l-name]', node)!.textContent = p.name;
    $('[data-l-total]', node)!.textContent = fmt(p.price * l.qty);
    $('[data-l-meta]', node)!.textContent = `${c.name} · Talle ${l.size} · ${fmt(p.price)} c/u`;
    $('[data-l-qty]', node)!.textContent = String(l.qty);
    $<HTMLButtonElement>('[data-l-inc]', node)!.disabled = l.qty >= MAX_QTY;
    $('[data-l-dec]', node)!.addEventListener('click', () => setLine(l.key, (q) => q - 1));
    $('[data-l-inc]', node)!.addEventListener('click', () => setLine(l.key, (q) => Math.min(MAX_QTY, q + 1)));
    $('[data-l-remove]', node)!.addEventListener('click', () => setLine(l.key, () => 0));
    list.append(node);
    subtotal += p.price * l.qty;
  }
  $('[data-subtotal]')!.textContent = fmt(subtotal);
}

function bump() {
  const el = $('[data-cart-count]');
  if (!el) return;
  el.toggleAttribute('data-bump', true);
  setTimeout(() => el.toggleAttribute('data-bump', false), 320);
}

/* ---------- Overlays: menu / search / cart ---------- */
const menu = $('#menu')!;
const search = $('#search')!;
const cartEl = $('#cart')!;
const overlay = $('[data-overlay]')!;
const menuBtn = $('[data-open="menu"]')!;
let lastFocus: HTMLElement | null = null;

function closeAll() {
  menu.hidden = true;
  search.hidden = true;
  cartEl.toggleAttribute('data-open', false);
  overlay.toggleAttribute('data-open', false);
  cartEl.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  lastFocus?.focus();
  lastFocus = null;
}

function open(which: string) {
  const wasOpen = !menu.hidden || !search.hidden || cartEl.hasAttribute('data-open');
  if (!wasOpen) lastFocus = document.activeElement as HTMLElement;
  menu.hidden = which !== 'menu';
  search.hidden = which !== 'search';
  cartEl.toggleAttribute('data-open', which === 'cart');
  overlay.toggleAttribute('data-open', which === 'cart');
  cartEl.setAttribute('aria-hidden', String(which !== 'cart'));
  menuBtn.setAttribute('aria-expanded', String(which === 'menu'));
  document.body.style.overflow = 'hidden';
  if (which === 'search') {
    const q = $<HTMLInputElement>('#q')!;
    q.value = '';
    filterResults('');
    q.focus();
  }
}

$$('[data-open]').forEach((b) => b.addEventListener('click', () => open(b.dataset.open!)));
$$('[data-close]').forEach((b) => b.addEventListener('click', closeAll));
// Anchor links inside overlays (e.g. mobile menu) must dismiss them.
$$('#menu a, #cart a').forEach((a) => a.addEventListener('click', closeAll));
document.addEventListener('keydown', (e) => e.key === 'Escape' && closeAll());

function filterResults(raw: string) {
  const q = raw.trim().toLowerCase();
  let shown = 0;
  $$('[data-result]', search).forEach((a) => {
    const match = !q || a.dataset.text!.includes(q);
    a.hidden = !match;
    if (match) shown++;
  });
  $('[data-no-results]', search)!.hidden = shown > 0;
}
$<HTMLInputElement>('#q')!.addEventListener('input', (e) => filterResults((e.target as HTMLInputElement).value));
$$('#search a').forEach((a) => a.addEventListener('click', closeAll));

/* ---------- Image error fallback: hide broken img + its duotone overlay ---------- */
document.addEventListener(
  'error',
  (e) => {
    const img = e.target as HTMLElement;
    if (img?.tagName !== 'IMG') return;
    img.style.visibility = 'hidden';
    img.parentElement?.querySelectorAll<HTMLElement>('.duo').forEach((n) => (n.style.display = 'none'));
  },
  true,
);

/* ---------- Product page ---------- */
const pdp = $('[data-pdp]');
if (pdp) {
  const p = catalog[pdp.dataset.slug!];
  const price = Number(pdp.dataset.price);
  const sizes = $$<HTMLButtonElement>('[data-size]', pdp);
  const colors = $$<HTMLButtonElement>('[data-color]', pdp);
  const addBtn = $<HTMLButtonElement>('[data-add]', pdp)!;
  const qtyEl = $('[data-qty]', pdp)!;
  const dec = $<HTMLButtonElement>('[data-qty-dec]', pdp)!;
  const inc = $<HTMLButtonElement>('[data-qty-inc]', pdp)!;
  let size: string | null = pdp.dataset.singleSize || null;
  let color = colors[0]?.dataset.color ?? p.colors[0].id;
  let qty = 1;
  let timer: number | undefined;

  const pressed = (b: Element) => b.getAttribute('aria-pressed') === 'true';
  const syncAdd = (added = false) => {
    const state = added ? 'added' : size ? 'ready' : 'size';
    addBtn.dataset.state = state;
    addBtn.disabled = state !== 'ready';
    addBtn.textContent = added ? 'AGREGADO ✓' : size ? `AGREGAR AL CARRITO — ${fmt(price * qty)}` : 'ELEGÍ TU TALLE';
  };
  const syncQty = () => {
    qtyEl.textContent = String(qty);
    dec.disabled = qty <= 1;
    inc.disabled = qty >= MAX_QTY;
    if (addBtn.dataset.state === 'ready') syncAdd();
  };

  $$<HTMLButtonElement>('[data-thumb]', pdp).forEach((t, _i, all) =>
    t.addEventListener('click', () => {
      all.forEach((x) => x.setAttribute('aria-pressed', String(x === t)));
      const main = $<HTMLImageElement>('[data-main-img]', pdp)!;
      $('[data-gi-label]', pdp)!.textContent = `${Number(t.dataset.thumb) + 1} / ${all.length}`;
      // Crossfade: fade out, swap once the next frame has loaded, fade back in.
      // Only the latest click wins if the user taps quickly.
      const next = new Image();
      const token = (main.dataset.pending = String(Math.random()));
      main.style.opacity = '0';
      const swap = () => {
        if (main.dataset.pending !== token) return;
        main.style.visibility = '';
        main.src = t.dataset.src!;
        main.alt = t.dataset.alt!;
        main.style.opacity = '';
      };
      next.onload = next.onerror = () => setTimeout(swap, 150);
      next.src = t.dataset.src!;
    }),
  );
  colors.forEach((c) =>
    c.addEventListener('click', () => {
      color = c.dataset.color!;
      colors.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
      $('[data-color-name]', pdp)!.textContent = c.dataset.name!;
    }),
  );
  sizes.forEach((s) =>
    s.addEventListener('click', () => {
      size = s.dataset.size!;
      sizes.forEach((x) => x.setAttribute('aria-pressed', String(x === s)));
      syncAdd();
    }),
  );
  dec.addEventListener('click', () => { qty = Math.max(1, qty - 1); syncQty(); });
  inc.addEventListener('click', () => { qty = Math.min(MAX_QTY, qty + 1); syncQty(); });

  addBtn.addEventListener('click', () => {
    if (!size) return;
    const key = `${pdp.dataset.slug}|${color}|${size}`;
    const i = cart.findIndex((l) => l.key === key);
    if (i >= 0) cart[i] = { ...cart[i], qty: Math.min(MAX_QTY, cart[i].qty + qty) };
    else cart.push({ key, slug: pdp.dataset.slug!, color, size, qty });
    save();
    renderCart();
    bump();
    syncAdd(true);
    clearTimeout(timer);
    timer = window.setTimeout(() => { syncAdd(); open('cart'); }, 650);
  });

  syncQty();
  syncAdd();
}

/* ---------- Newsletter (demo: validates, sends nothing) ---------- */
// Pages that omit the newsletter band (checkout, order) have nothing to wire up.
function initNewsletter() {
  if (!$('#nl-form')) return;
  const nlForm = $<HTMLFormElement>('#nl-form')!;
  const nlEmail = $<HTMLInputElement>('#nl-email')!;
  const nlMsg = $('#nl-msg')!;
  const nlDone = $('#nl-done')!;
  const setNlError = (msg: string) => {
    nlEmail.setAttribute('aria-invalid', 'true');
    nlMsg.replaceChildren();
    const dot = document.createElement('span');
    dot.className = 'size-2.5 flex-none bg-naranja';
    const text = document.createElement('span');
    text.textContent = msg;
    nlMsg.append(dot, text);
  };
  const clearNlError = () => {
    nlEmail.removeAttribute('aria-invalid');
    nlMsg.replaceChildren();
  };
  nlEmail.addEventListener('input', clearNlError);
  nlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = nlEmail.value.trim();
    if (!v) return setNlError('Escribí tu email para sumarte.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return setNlError('Ese email no parece válido. Revisalo.');
    clearNlError();
    $('#nl-sent')!.textContent = v;
    nlForm.hidden = true;
    nlDone.hidden = false;
  });
  $('#nl-reset')!.addEventListener('click', () => {
    nlEmail.value = '';
    nlForm.hidden = false;
    nlDone.hidden = true;
  });
}
initNewsletter();

renderCart();

/* ---------- Staggered reveal for cards ---------- */
const reveals = $$('[data-anim]');
// Elements clipped/scaled to zero area are never "intersecting" themselves,
// so those variants are triggered by their parent entering the viewport.
const selfObserved = new Set(['up', 'pop']);
const groups = new Map<Element, HTMLElement[]>();
for (const el of reveals) {
  const target = selfObserved.has(el.dataset.anim!) ? el : (el.parentElement ?? el);
  groups.set(target, [...(groups.get(target) ?? []), el]);
}
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        groups.get(en.target)?.forEach((el) => el.classList.add('is-in'));
        io.unobserve(en.target);
      }),
    { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
  );
  groups.forEach((_, t) => io.observe(t));
} else {
  reveals.forEach((el) => el.classList.add('is-in'));
}

/* ---------- Image failure fallback ---------- */
// A broken image would leave an empty box (or a solid blue duotone); show the striped placeholder instead.
function markBroken(img: HTMLImageElement) {
  img.classList.add('img-failed');
  const frame = img.closest('.photo-bg');
  if (frame && $$<HTMLImageElement>('img', frame).every((i) => i.classList.contains('img-failed'))) frame.classList.add('is-empty');
}
document.addEventListener('error', (e) => e.target instanceof HTMLImageElement && markBroken(e.target), true);
$$<HTMLImageElement>('img').forEach((img) => img.complete && img.naturalWidth === 0 && img.src && markBroken(img));
