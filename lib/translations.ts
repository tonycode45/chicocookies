export type Lang = 'en' | 'fr' | 'es'

const en = {
  nav: { order: 'Order' },
  header: { toggleTheme: 'Toggle theme' },
  home: {
    hero: {
      badge: 'Handcrafted\u00a0·\u00a0Baked Fresh\u00a0·\u00a0Made to Order',
      headline: "The Cookie You'll Dream About",
      description:
        'Warm from the oven, soft at the center, golden at the edge. Peanut butter, oatmeal, and chocolate — each batch made by hand and finished with care.',
      cta: 'Order Now',
    },
    signature: {
      badge: 'The Signature',
      headline: 'One cookie, perfected.',
      description:
        "Chicoine's signature peanut butter oatmeal chocolate chip cookie was designed from the start to be the last cookie you'll ever need to try. Soft at the center, golden at the edge, made by hand every single time.",
    },
    pillars: {
      i: {
        title: 'Handcrafted',
        desc: 'Made in small batches with care. Each cookie is shaped and baked by hand — because that attention shows in the final bite.',
      },
      ii: {
        title: 'Perfectly Soft',
        desc: 'Golden edges, soft center. We know exactly when to pull them. The texture is the whole point.',
      },
      iii: {
        title: 'Natural Ingredients',
        desc: 'All-natural peanut butter, rolled oats, real chocolate chips. Seven ingredients — every one of them earned its place.',
      },
    },
    order: {
      badge: 'Place Your Order',
      headline: 'Select Your Quantity',
      paused: 'Orders temporarily paused',
      flavor: 'PB · Oatmeal · Choc Chip',
      perPack: 'per pack',
      popular: 'Most popular',
      perCookie: 'per cookie',
      cta: 'Order Now',
      savings: { medium: 'Better value', large: 'Best value' },
    },
    howItWorks: {
      badge: 'The Process',
      headline: 'Simple from start to finish',
      steps: [
        { n: '01', title: 'Choose Your Quantity', desc: 'Pick a size — 2, 6, or 12 cookies per pack. Add as many packs as you need.' },
        { n: '02', title: 'Pickup or Delivery', desc: 'Pickup is complimentary. Local delivery is a flat $5.' },
        { n: '03', title: 'Freshly Baked', desc: 'We confirm your order, bake fresh, and you enjoy.' },
      ],
    },
    ingredients: {
      badge: 'Transparency',
      headline: 'What goes inside',
      description: "Seven ingredients. Nothing artificial. Nothing you can't pronounce.",
      footer: 'No preservatives\u00a0·\u00a0No artificial flavors\u00a0·\u00a0Baked same day',
      items: [
        'All-natural peanut butter',
        'Rolled oats',
        'Chocolate chips',
        'Butter',
        'Brown sugar',
        'Egg',
        'All-purpose flour',
      ],
    },
    story: {
      badge: 'Our Story',
      quote:
        '\u201cMy mom started baking these cookies one day. I eventually started to like them, and she showed me how to make them. I perfected the recipe and made them even better \u2014 and now they\u2019re pretty famous at my school.\u201d',
      caption: 'We bake every batch ourselves. We pack every box by hand.\nAnd we\u2019re proud of every single one.',
    },
    fulfillment: {
      badge: 'Fulfillment',
      headline: 'Pickup & Delivery',
      pickup: {
        badge: 'Pickup',
        headline: 'Complimentary',
        fallback: 'Pickup address and timing are shared once your order is confirmed.',
      },
      delivery: {
        badge: 'Delivery',
        headline: '$5 flat fee',
        desc: 'We deliver within the local area. Provide your address at checkout and we handle the rest.',
      },
      footer: 'Payment collected on pickup or delivery\u00a0·\u00a0Cash & e-transfer accepted',
    },
    footer: {
      tagline: 'Handcrafted with care\u00a0·\u00a0Baked fresh for you',
    },
  },
  checkout: {
    badge: 'Your Order',
    headline: 'Checkout',
    selectItems: 'Select Items',
    perPack: 'per pack',
    popular: '\u00b7 Most popular',
    fulfillmentMethod: 'Fulfillment Method',
    pickup: { label: 'Pickup', sub: 'Complimentary' },
    delivery: { label: 'Delivery', sub: '+$5.00' },
    yourInfo: 'Your Information',
    fields: {
      fullName: 'Full Name',
      phone: 'Phone Number',
      email: 'Email Address',
      address: 'Street Address',
      city: 'City',
      notes: 'Order Notes',
      fullNamePlaceholder: 'Your full name',
      phonePlaceholder: '(555) 000-0000',
      emailPlaceholder: 'you@example.com (optional)',
      addressPlaceholder: '123 Main Street',
      cityPlaceholder: 'City',
      notesPlaceholder: 'Special requests, anything else?',
    },
    errors: {
      nameRequired: 'Name is required',
      phoneRequired: 'Phone number is required',
      addressRequired: 'Address is required for delivery',
      cityRequired: 'City is required for delivery',
      deliveryMinimum: 'Delivery requires a minimum order of $30.',
    },
    options: 'Options',
    weeklyDrop: {
      label: 'Reserve my spot in the weekly batch',
      desc: "We bake weekly — check this and we'll lock you in automatically each week",
    },
    eventOrder: {
      label: 'This is for an event or bulk order',
      desc: "Ordering for a party or large group? We'll follow up to confirm quantity and timing",
    },
    summary: {
      delivery: 'Delivery',
      complimentary: 'Complimentary',
      total: 'Total',
      paymentPickup: 'Payment collected on pickup — cash or e-transfer',
      paymentDelivery: 'Payment collected on delivery — cash or e-transfer',
    },
    submit: 'Place Order',
    submitting: 'Placing Order\u2026',
  },
  confirmation: {
    badge: 'Order Confirmed',
    headline: 'Thank You',
    received: "Your order has been received. We'll be in touch shortly to confirm details.",
    reference: 'Order reference:',
    nextSteps: {
      badge: 'What Happens Next',
      steps: [
        'We confirm your order and share pickup or delivery details.',
        'Your cookies are baked fresh — made specifically for you.',
        'Collect at pickup or receive at your door at the agreed time.',
        'Payment collected on arrival — cash or e-transfer.',
      ],
    },
    backHome: 'Back to Home',
  },
}

const fr: typeof en = {
  nav: { order: 'Commander' },
  header: { toggleTheme: 'Changer le th\u00e8me' },
  home: {
    hero: {
      badge: 'Artisanal\u00a0·\u00a0Fra\u00eechement cuit\u00a0·\u00a0Sur commande',
      headline: 'Le biscuit dont tu r\u00eaveras',
      description:
        "Chaud du four, moelleux au centre, dor\u00e9 sur les bords. Beurre d\u2019arachide, flocons d\u2019avoine et chocolat \u2014 chaque fourn\u00e9e faite \u00e0 la main avec soin.",
      cta: 'Commander',
    },
    signature: {
      badge: 'La Signature',
      headline: 'Un biscuit, perfectionn\u00e9.',
      description:
        "Le biscuit signature de Chicoine \u2014 beurre d\u2019arachide, flocons d\u2019avoine et p\u00e9pites de chocolat \u2014 a \u00e9t\u00e9 con\u00e7u d\u00e8s le d\u00e9part pour \u00eatre le dernier biscuit que vous essaierez. Moelleux au centre, dor\u00e9 sur les bords, fait \u00e0 la main \u00e0 chaque fois.",
    },
    pillars: {
      i: {
        title: 'Artisanal',
        desc: "Fait en petites fourn\u00e9es avec soin. Chaque biscuit est fa\u00e7onn\u00e9 et cuit \u00e0 la main \u2014 parce que cette attention se voit dans la derni\u00e8re bouch\u00e9e.",
      },
      ii: {
        title: 'Parfaitement moelleux',
        desc: "Bords dor\u00e9s, centre fondant. On sait exactement quand les sortir. La texture, c\u2019est tout.",
      },
      iii: {
        title: 'Ingr\u00e9dients naturels',
        desc: "Beurre d\u2019arachide naturel, flocons d\u2019avoine, vraies p\u00e9pites de chocolat. Sept ingr\u00e9dients \u2014 chacun m\u00e9rite sa place.",
      },
    },
    order: {
      badge: 'Passer une commande',
      headline: 'Choisissez votre quantit\u00e9',
      paused: 'Commandes temporairement suspendues',
      flavor: 'B.A.\u00a0·\u00a0Avoine\u00a0·\u00a0Choc',
      perPack: 'par paquet',
      popular: 'Le plus populaire',
      perCookie: 'par biscuit',
      cta: 'Commander',
      savings: { medium: 'Meilleur rapport', large: 'Meilleure valeur' },
    },
    howItWorks: {
      badge: 'Le processus',
      headline: 'Simple du d\u00e9but \u00e0 la fin',
      steps: [
        { n: '01', title: 'Choisissez votre quantit\u00e9', desc: 'Choisissez une taille \u2014 2, 6 ou 12 biscuits par paquet. Ajoutez autant de paquets que vous voulez.' },
        { n: '02', title: 'Cueillette ou livraison', desc: 'La cueillette est gratuite. La livraison locale est fixe \u00e0 5\u00a0$.' },
        { n: '03', title: 'Fra\u00eechement cuits', desc: 'On confirme votre commande, on cuit frais et vous vous r\u00e9galez.' },
      ],
    },
    ingredients: {
      badge: 'Transparence',
      headline: "Ce qu\u2019il y a \u00e0 l\u2019int\u00e9rieur",
      description: "Sept ingr\u00e9dients. Rien d\u2019artificiel. Rien que vous ne pouvez pas prononcer.",
      footer: 'Sans agents de conservation\u00a0·\u00a0Sans ar\u00f4mes artificiels\u00a0·\u00a0Cuit le jour m\u00eame',
      items: [
        'Beurre d\u2019arachide naturel',
        'Flocons d\u2019avoine',
        'P\u00e9pites de chocolat',
        'Beurre',
        'Cassonade',
        '\u0152uf',
        'Farine tout usage',
      ],
    },
    story: {
      badge: 'Notre histoire',
      quote:
        '\u00ab Un jour, ma m\u00e8re a commenc\u00e9 \u00e0 faire ces biscuits. J\u2019ai fini par les aimer, et elle m\u2019a montr\u00e9 comment les pr\u00e9parer. J\u2019ai perfectionn\u00e9 la recette et les ai rendus encore meilleurs \u2014 et maintenant ils sont plutôt c\u00e9l\u00e8bres \u00e0 mon \u00e9cole. \u00bb',
      caption: "Nous cuisons chaque fourn\u00e9e nous-m\u00eames. Nous emballons chaque bo\u00eete \u00e0 la main.\nEt nous sommes fiers de chacune d\u2019elles.",
    },
    fulfillment: {
      badge: 'Livraison',
      headline: 'Cueillette & Livraison',
      pickup: {
        badge: 'Cueillette',
        headline: 'Gratuite',
        fallback: "L\u2019adresse et l\u2019heure de cueillette sont communiqu\u00e9es une fois votre commande confirm\u00e9e.",
      },
      delivery: {
        badge: 'Livraison',
        headline: 'Frais fixe de 5\u00a0$',
        desc: 'Nous livrons dans la r\u00e9gion locale. Fournissez votre adresse lors du paiement et nous nous occupons du reste.',
      },
      footer: 'Paiement \u00e0 la cueillette ou \u00e0 la livraison\u00a0·\u00a0Comptant et virement accept\u00e9s',
    },
    footer: {
      tagline: 'Fait avec soin\u00a0·\u00a0Cuit frais pour vous',
    },
  },
  checkout: {
    badge: 'Votre commande',
    headline: 'Paiement',
    selectItems: 'Choisir les articles',
    perPack: 'par paquet',
    popular: '\u00b7 Le plus populaire',
    fulfillmentMethod: 'Mode de livraison',
    pickup: { label: 'Cueillette', sub: 'Gratuite' },
    delivery: { label: 'Livraison', sub: '+5,00\u00a0$' },
    yourInfo: 'Vos informations',
    fields: {
      fullName: 'Nom complet',
      phone: 'Num\u00e9ro de t\u00e9l\u00e9phone',
      email: 'Adresse courriel',
      address: 'Adresse',
      city: 'Ville',
      notes: 'Notes de commande',
      fullNamePlaceholder: 'Votre nom complet',
      phonePlaceholder: '(555) 000-0000',
      emailPlaceholder: 'vous@exemple.com (facultatif)',
      addressPlaceholder: '123 Rue Principale',
      cityPlaceholder: 'Ville',
      notesPlaceholder: 'Demandes sp\u00e9ciales, autre chose\u00a0?',
    },
    errors: {
      nameRequired: 'Le nom est requis',
      phoneRequired: 'Le num\u00e9ro de t\u00e9l\u00e9phone est requis',
      addressRequired: "L\u2019adresse est requise pour la livraison",
      cityRequired: 'La ville est requise pour la livraison',
      deliveryMinimum: 'La livraison n\u00e9cessite une commande minimale de 30\u00a0$.',
    },
    options: 'Options',
    weeklyDrop: {
      label: 'R\u00e9server ma place dans la fourn\u00e9e hebdomadaire',
      desc: "On cuit chaque semaine \u2014 cochez ceci et on vous r\u00e9serve automatiquement une place chaque semaine",
    },
    eventOrder: {
      label: "C\u2019est pour un \u00e9v\u00e9nement ou une commande en gros",
      desc: 'Vous commandez pour une f\u00eate ou un grand groupe\u00a0? On vous contactera pour confirmer la quantit\u00e9 et le d\u00e9lai.',
    },
    summary: {
      delivery: 'Livraison',
      complimentary: 'Gratuite',
      total: 'Total',
      paymentPickup: 'Paiement \u00e0 la cueillette \u2014 comptant ou virement',
      paymentDelivery: 'Paiement \u00e0 la livraison \u2014 comptant ou virement',
    },
    submit: 'Passer la commande',
    submitting: 'Envoi en cours\u2026',
  },
  confirmation: {
    badge: 'Commande confirm\u00e9e',
    headline: 'Merci',
    received: 'Votre commande a \u00e9t\u00e9 re\u00e7ue. Nous vous contacterons bient\u00f4t pour confirmer les d\u00e9tails.',
    reference: 'R\u00e9f\u00e9rence de commande\u00a0:',
    nextSteps: {
      badge: 'Ce qui se passe ensuite',
      steps: [
        'Nous confirmons votre commande et partageons les d\u00e9tails de cueillette ou de livraison.',
        'Vos biscuits sont cuits frais \u2014 faits sp\u00e9cialement pour vous.',
        "Cueillez \u00e0 l\u2019adresse ou recevez \u00e0 votre porte \u00e0 l\u2019heure convenue.",
        'Paiement \u00e0 la r\u00e9ception \u2014 comptant ou virement.',
      ],
    },
    backHome: "Retour \u00e0 l\u2019accueil",
  },
}

const es: typeof en = {
  nav: { order: 'Pedir' },
  header: { toggleTheme: 'Cambiar tema' },
  home: {
    hero: {
      badge: 'Artesanal\u00a0·\u00a0Horneado fresco\u00a0·\u00a0Hecho a pedido',
      headline: 'La galleta con la que so\u00f1ar\u00e1s',
      description:
        'Caliente del horno, suave en el centro, dorada en los bordes. Mantequilla de man\u00ed, avena y chocolate \u2014 cada lote hecho a mano con cuidado.',
      cta: 'Pedir ahora',
    },
    signature: {
      badge: 'La Firma',
      headline: 'Una galleta, perfeccionada.',
      description:
        'La galleta signature de Chicoine \u2014 mantequilla de man\u00ed, avena y chispas de chocolate \u2014 fue dise\u00f1ada desde el principio para ser la \u00faltima galleta que necesitar\u00e1s probar. Suave en el centro, dorada en los bordes, hecha a mano cada vez.',
    },
    pillars: {
      i: {
        title: 'Artesanal',
        desc: 'Hecha en lotes peque\u00f1os con cuidado. Cada galleta es moldeada y horneada a mano \u2014 porque esa atenci\u00f3n se nota en cada bocado.',
      },
      ii: {
        title: 'Perfectamente suave',
        desc: 'Bordes dorados, centro suave. Sabemos exactamente cu\u00e1ndo sacarlas. La textura es todo.',
      },
      iii: {
        title: 'Ingredientes naturales',
        desc: 'Mantequilla de man\u00ed natural, avena, chispas de chocolate reales. Siete ingredientes \u2014 cada uno gan\u00f3 su lugar.',
      },
    },
    order: {
      badge: 'Haz tu pedido',
      headline: 'Elige tu cantidad',
      paused: 'Pedidos temporalmente pausados',
      flavor: 'M.M.\u00a0·\u00a0Avena\u00a0·\u00a0Choc',
      perPack: 'por paquete',
      popular: 'El m\u00e1s popular',
      perCookie: 'por galleta',
      cta: 'Pedir ahora',
      savings: { medium: 'Mejor relaci\u00f3n', large: 'Mejor valor' },
    },
    howItWorks: {
      badge: 'El proceso',
      headline: 'Simple de principio a fin',
      steps: [
        { n: '01', title: 'Elige tu cantidad', desc: 'Elige un tama\u00f1o \u2014 2, 6 o 12 galletas por paquete. A\u00f1ade tantos paquetes como necesites.' },
        { n: '02', title: 'Recogida o entrega', desc: 'La recogida es gratuita. La entrega local tiene un precio fijo de $5.' },
        { n: '03', title: 'Reci\u00e9n horneadas', desc: 'Confirmamos tu pedido, horneamos fresco y t\u00fa disfrutas.' },
      ],
    },
    ingredients: {
      badge: 'Transparencia',
      headline: 'Qu\u00e9 hay adentro',
      description: 'Siete ingredientes. Nada artificial. Nada que no puedas pronunciar.',
      footer: 'Sin conservantes\u00a0·\u00a0Sin sabores artificiales\u00a0·\u00a0Horneado el mismo d\u00eda',
      items: [
        'Mantequilla de man\u00ed natural',
        'Avena en copos',
        'Chispas de chocolate',
        'Mantequilla',
        'Az\u00facar morena',
        'Huevo',
        'Harina todo uso',
      ],
    },
    story: {
      badge: 'Nuestra historia',
      quote:
        '\u201cUn d\u00eda, mi mam\u00e1 empez\u00f3 a hornear estas galletas. Con el tiempo empec\u00e9 a gustarme y ella me ense\u00f1\u00f3 c\u00f3mo hacerlas. Perfeccion\u00e9 la receta y las mejor\u00e9 a\u00fan m\u00e1s \u2014 y ahora son bastante famosas en mi escuela.\u201d',
      caption: 'Horneamos cada lote nosotros mismos. Empacamos cada caja a mano.\nY estamos orgullosos de cada una.',
    },
    fulfillment: {
      badge: 'Entrega',
      headline: 'Recogida & Entrega',
      pickup: {
        badge: 'Recogida',
        headline: 'Gratuita',
        fallback: 'La direcci\u00f3n y el horario de recogida se comparten una vez confirmado tu pedido.',
      },
      delivery: {
        badge: 'Entrega',
        headline: 'Tarifa fija de $5',
        desc: 'Entregamos en el \u00e1rea local. Proporciona tu direcci\u00f3n al pagar y nosotros nos encargamos del resto.',
      },
      footer: 'Pago en recogida o entrega\u00a0·\u00a0Efectivo y transferencia aceptados',
    },
    footer: {
      tagline: 'Hecho con cuidado\u00a0·\u00a0Horneado fresco para ti',
    },
  },
  checkout: {
    badge: 'Tu pedido',
    headline: 'Pago',
    selectItems: 'Seleccionar art\u00edculos',
    perPack: 'por paquete',
    popular: '\u00b7 El m\u00e1s popular',
    fulfillmentMethod: 'M\u00e9todo de entrega',
    pickup: { label: 'Recogida', sub: 'Gratuita' },
    delivery: { label: 'Entrega', sub: '+$5.00' },
    yourInfo: 'Tu informaci\u00f3n',
    fields: {
      fullName: 'Nombre completo',
      phone: 'N\u00famero de tel\u00e9fono',
      email: 'Correo electr\u00f3nico',
      address: 'Direcci\u00f3n',
      city: 'Ciudad',
      notes: 'Notas del pedido',
      fullNamePlaceholder: 'Tu nombre completo',
      phonePlaceholder: '(555) 000-0000',
      emailPlaceholder: 't\u00fa@ejemplo.com (opcional)',
      addressPlaceholder: '123 Calle Principal',
      cityPlaceholder: 'Ciudad',
      notesPlaceholder: '\u00bfSolicitudes especiales, algo m\u00e1s?',
    },
    errors: {
      nameRequired: 'El nombre es obligatorio',
      phoneRequired: 'El n\u00famero de tel\u00e9fono es obligatorio',
      addressRequired: 'La direcci\u00f3n es obligatoria para la entrega',
      cityRequired: 'La ciudad es obligatoria para la entrega',
      deliveryMinimum: 'La entrega requiere un pedido m\u00ednimo de $30.',
    },
    options: 'Opciones',
    weeklyDrop: {
      label: 'Reservar mi lugar en el lote semanal',
      desc: 'Horneamos semanalmente \u2014 marca esto y te reservamos autom\u00e1ticamente cada semana',
    },
    eventOrder: {
      label: 'Es para un evento o pedido a granel',
      desc: '\u00bfPides para una fiesta o grupo grande? Te contactaremos para confirmar cantidad y tiempo.',
    },
    summary: {
      delivery: 'Entrega',
      complimentary: 'Gratuita',
      total: 'Total',
      paymentPickup: 'Pago en recogida \u2014 efectivo o transferencia',
      paymentDelivery: 'Pago en entrega \u2014 efectivo o transferencia',
    },
    submit: 'Hacer pedido',
    submitting: 'Enviando pedido\u2026',
  },
  confirmation: {
    badge: 'Pedido confirmado',
    headline: 'Gracias',
    received: 'Tu pedido ha sido recibido. Nos pondremos en contacto pronto para confirmar los detalles.',
    reference: 'Referencia del pedido:',
    nextSteps: {
      badge: 'Qu\u00e9 pasa despu\u00e9s',
      steps: [
        'Confirmamos tu pedido y compartimos los detalles de recogida o entrega.',
        'Tus galletas se hornean frescas \u2014 hechas espec\u00edficamente para ti.',
        'Recoge en el punto o rec\u00edbelas en tu puerta a la hora acordada.',
        'Pago al recibirlas \u2014 efectivo o transferencia.',
      ],
    },
    backHome: 'Volver al inicio',
  },
}

export const translations: Record<Lang, typeof en> = { en, fr, es }
