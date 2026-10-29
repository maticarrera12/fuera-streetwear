import { FREE_SHIPPING_FROM, SHIPPING } from './shipping';
import { fmt } from './products';

export interface InfoPage {
  slug: string;
  title: string;
  intro: string;
  sections: { title: string; body: string[] }[];
}

const [standard, express] = SHIPPING;

export const INFO_PAGES: InfoPage[] = [
  {
    slug: 'envios',
    title: 'Envíos',
    intro: 'Cómo y cuándo llega tu pedido.',
    sections: [
      {
        title: 'Opciones y costos',
        body: [
          `Envío estándar: ${fmt(standard.cost)}, entre 3 y 5 días hábiles. Gratis en compras desde ${fmt(FREE_SHIPPING_FROM)}.`,
          `Envío express: ${fmt(express.cost)}, entre 24 y 48 horas.`,
          'Retiro en el showroom: gratis, con el pedido listo en 24 horas.',
        ],
      },
      {
        title: 'Seguimiento',
        body: ['Cuando el pedido sale, recibís un email con el código de seguimiento. Los plazos corren desde la confirmación del pago.'],
      },
      {
        title: 'Cobertura',
        body: ['Enviamos a todo el país. Los plazos pueden ampliarse en zonas alejadas y en fechas de alta demanda.'],
      },
    ],
  },
  {
    slug: 'cambios-y-devoluciones',
    title: 'Cambios y devoluciones',
    intro: 'Si algo no te queda o no es lo que esperabas, lo resolvemos.',
    sections: [
      {
        title: 'Plazo',
        body: ['Tenés 30 días desde la entrega para pedir un cambio o una devolución.'],
      },
      {
        title: 'Condiciones',
        body: ['La prenda debe estar sin uso, sin lavar y con sus etiquetas. Las piezas de tirada limitada marcadas como tales admiten cambio de talle, pero no devolución de dinero.'],
      },
      {
        title: 'Cómo pedirlo',
        body: ['Escribinos a hola@fuera.example con tu número de pedido y el motivo. Te respondemos con los pasos y la dirección de envío.'],
      },
      {
        title: 'Reintegros',
        body: ['Una vez recibida y revisada la prenda, el reintegro se acredita por el mismo medio de pago en hasta 10 días hábiles.'],
      },
    ],
  },
  {
    slug: 'terminos',
    title: 'Términos y condiciones',
    intro: 'Las reglas básicas de uso de este sitio.',
    sections: [
      {
        title: 'Sitio conceptual',
        body: ['FUERA® es una marca ficticia creada para un proyecto de portfolio. No existen productos, stock, precios ni ventas reales, y ningún pedido genera una obligación de entrega ni de pago.'],
      },
      {
        title: 'Uso del sitio',
        body: ['Podés navegar y probar el flujo de compra libremente. Los pedidos que generes son simulaciones y no se envían ni se cobran.'],
      },
      {
        title: 'Propiedad intelectual',
        body: ['El diseño, los textos y la identidad visual pertenecen a su autor. Las fotografías son imágenes de referencia de terceros.'],
      },
    ],
  },
  {
    slug: 'privacidad',
    title: 'Privacidad',
    intro: 'Qué datos maneja este sitio, que son pocos.',
    sections: [
      {
        title: 'Qué guardamos',
        body: ['El carrito y el último pedido simulado se guardan en el almacenamiento de sesión de tu navegador. Se borran al cerrar la pestaña y nunca salen de tu dispositivo.'],
      },
      {
        title: 'Qué no hacemos',
        body: ['No usamos cookies de seguimiento ni analítica. Los formularios de checkout y newsletter no envían tus datos a ningún servidor.'],
      },
      {
        title: 'Servicios de terceros',
        body: ['Las tipografías se cargan desde Google Fonts y las imágenes desde Unsplash, por lo que esos servicios pueden recibir tu dirección IP al cargar la página.'],
      },
    ],
  },
];
