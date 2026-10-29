export type CatalogEntry = { name: string; price: number; img: string; colors: { id: string; name: string }[] };
export type Line = { key: string; slug: string; color: string; size: string; qty: number };

export const CART_KEY = 'fuera-cart-v1';
export const MAX_QTY = 10;

export const readCatalog = (): Record<string, CatalogEntry> => JSON.parse(document.getElementById('catalog')!.textContent!);
export const fmt = (n: number) => '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const photo = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export function loadCart(catalog: Record<string, CatalogEntry>): Line[] {
  try {
    const raw = JSON.parse(sessionStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    // Drop anything that doesn't map to the catalog: storage is user-controlled.
    return raw.filter((l) => l && catalog[l.slug] && Number.isInteger(l.qty) && l.qty > 0).map((l) => ({ ...l, qty: Math.min(MAX_QTY, l.qty) }));
  } catch {
    return [];
  }
}

export function saveCart(cart: Line[]) {
  try { sessionStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
  window.dispatchEvent(new CustomEvent('cart:change'));
}

export const ORDER_KEY = 'fuera-order-v1';

export type OrderLine = { name: string; color: string; size: string; qty: number; price: number; img: string };
export type Order = {
  id: string;
  email: string;
  name: string;
  address: string;
  phone: string;
  shipping: { label: string; cost: number };
  payment: string;
  lines: OrderLine[];
  subtotal: number;
  total: number;
};

export function clearCart() {
  try { sessionStorage.removeItem(CART_KEY); } catch {}
}
