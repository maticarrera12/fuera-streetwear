export const FREE_SHIPPING_FROM = 120000;

export const SHIPPING = [
  { id: 'standard', label: 'Envío estándar', note: '3 a 5 días hábiles', cost: 4500, freeOver: true },
  { id: 'express', label: 'Envío express', note: '24 a 48 horas', cost: 8000, freeOver: false },
  { id: 'pickup', label: 'Retiro en el showroom', note: 'Gratis · Lista en 24 horas', cost: 0, freeOver: false },
];
