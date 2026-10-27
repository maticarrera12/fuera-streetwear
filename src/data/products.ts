export const unsplash = (id: string, w = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export interface Colour {
  id: string;
  name: string;
  bg: string;
}

export interface Product {
  slug: string;
  n: string;
  name: string;
  ref: string;
  price: number;
  tag: string | null;
  colors: Colour[];
  sizes: string[];
  soldOut: string[];
  imgs: string[];
  short: string;
  desc: string;
  material: string;
  care: string;
  fitShort: string;
  fit: string;
}

const COL = {
  azul: { id: 'azul', name: 'Azul FUERA', bg: '#0E287F' },
  crema: { id: 'crema', name: 'Crema', bg: '#F3E9D6' },
  azam: { id: 'azul-amarillo', name: 'Azul / Amarillo', bg: 'linear-gradient(90deg,#0E287F 50%,#DBE028 50%)' },
} satisfies Record<string, Colour>;

export const IMG = {
  hero: unsplash('1649114383220-c4f0f0dbafbe', 1400),
  edA: unsplash('1635650804060-bb009bcb2ea5', 1400),
  edB: unsplash('1565735962008-5b622658e325', 900),
  edC: unsplash('1635650805023-f2529440b5aa', 1600),
};

export const PRODUCTS: Product[] = [
  {
    slug: 'heavy-tee', n: '01', name: 'FUERA Heavy Tee', ref: 'FU-001-HT', price: 38000, tag: 'NUEVO',
    colors: [COL.azul, COL.crema], sizes: ['S', 'M', 'L', 'XL', 'XXL'], soldOut: ['XXL'],
    imgs: ['1599423843366-d5bbbe44b4cd', '1613372281199-ec69ace5e926', '1635650804060-bb009bcb2ea5'],
    short: 'Remera oversize de algodón pesado. Hombro caído, cuello acanalado y FUERA® estampado al frente.',
    desc: 'La base del uniforme. Corte amplio y recto, largo extendido y una tela con cuerpo que mantiene la forma después de cada lavado. El logo va al frente, chico, donde tiene que estar.',
    material: '100% algodón peinado, 240 g/m². Estampado serigráfico al agua.',
    care: 'Lavar del revés en agua fría. No usar secadora. Planchar sin tocar el estampado.',
    fitShort: 'Calce oversize', fit: 'Oversize. Si buscás un calce regular, elegí un talle menos del habitual.',
  },
  {
    slug: 'no-rules-tee', n: '02', name: 'No Rules Tee', ref: 'FU-001-NR', price: 36000, tag: 'GRÁFICO',
    colors: [COL.crema], sizes: ['S', 'M', 'L', 'XL', 'XXL'], soldOut: ['S'],
    imgs: ['1611029819306-d6bd88125ddb', '1635650804483-2a77a8c9e728', '1635650805015-2fa50682873a'],
    short: 'Remera crema con el gráfico NO RULES serigrafiado en naranja en la espalda.',
    desc: 'Una frase, una tinta, ninguna explicación. Frente limpio y espalda con gráfico de gran escala en naranja. Pensada para llevar sola o debajo de un buzo abierto.',
    material: '100% algodón, 220 g/m². Tinta plastisol naranja.',
    care: 'Lavar del revés en agua fría. Secar a la sombra. No usar lavandina.',
    fitShort: 'Calce relajado', fit: 'Relajado. Más amplia que una remera clásica, sin llegar al oversize de la Heavy Tee.',
  },
  {
    slug: 'daily-uniform-hoodie', n: '03', name: 'Daily Uniform Hoodie', ref: 'FU-001-DH', price: 79000, tag: 'LIMITADO',
    colors: [COL.crema, COL.azul], sizes: ['S', 'M', 'L', 'XL'], soldOut: [],
    imgs: ['1579883180654-695b7f038d4c', '1639445837038-4493d8715829', '1635650805000-f31dee3133bc'],
    short: 'Buzo con capucha de frisa pesada. Bolsillo canguro, puños anchos y FUERA® bordado en el pecho.',
    desc: 'El buzo de todos los días, hecho para durar más que la temporada. Capucha doble sin cordón, costuras reforzadas y un bordado tono sobre tono que se ve de cerca.',
    material: '80% algodón, 20% poliéster. Frisa invisible, 400 g/m².',
    care: 'Lavar en agua fría con colores similares. No usar secadora. No planchar el bordado.',
    fitShort: 'Calce amplio', fit: 'Amplio, con hombro caído. Tu talle habitual da el calce pensado para la campaña.',
  },
  {
    slug: 'signature-cap', n: '04', name: 'FUERA Signature Cap', ref: 'FU-001-SC', price: 28000, tag: null,
    colors: [COL.azam], sizes: ['ÚNICO'], soldOut: [],
    imgs: ['1635650804263-1a1941e14df5', '1635650804494-41f0ecefec22', '1635650805023-f2529440b5aa'],
    short: 'Gorra de seis paneles azul con bordado FUERA® en amarillo. Cierre regulable.',
    desc: 'Visera curva, copa media y el logo en amarillo para que no pase desapercibida. Cierre trasero metálico para ajustarla a cualquier cabeza.',
    material: '100% algodón twill. Bordado de hilo poliéster.',
    care: 'Limpiar a mano con paño húmedo. No lavar en lavarropas.',
    fitShort: 'Talle único', fit: 'Talle único regulable (54–60 cm).',
  },
];

export const fmt = (n: number) => '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const href = (p: Product) => `/p/${p.slug}/`;
