// ------------------------------
// Imports
// ------------------------------
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const bodyParser = require('body-parser');

// ------------------------------
// App Express
// ------------------------------
const app = express();

app.use(cors());
app.use(bodyParser.json());
// Pour servir les fichiers statiques (images, success.html, cancel.html, etc.)


// ------------------------------
// Stripe
// ------------------------------
const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
  throw new Error('STRIPE_SECRET_KEY manquante');
}

const stripe = Stripe(stripeSecret);

// ------------------------------
// Produits Liora Beauty
// ------------------------------
const PRODUCTS = [
  {
    id: 'prod_serum',
    price_cents: 2990,
    currency: 'eur',
    name: {
      fr: 'Sérum Éclat Visage',
      en: 'Radiance Face Serum',
    },
    desc: {
      fr: 'Sérum léger pour illuminer la peau.',
      en: 'Lightweight serum to brighten skin.',
    },
    image: '/images/serum.jpg',
  },
  {
    id: 'prod_creme',
    price_cents: 2490,
    currency: 'eur',
    name: {
      fr: 'Crème Hydratante Pure',
      en: 'Pure Hydrating Cream',
    },
    desc: {
      fr: 'Hydratation quotidienne pour tous types de peau.',
      en: 'Daily hydration for all skin types.',
    },
    image: '/images/creme.jpg',
  },
  {
    id: 'prod_rouge',
    price_cents: 1990,
    currency: 'eur',
    name: {
      fr: 'Rouge à Lèvres Velours',
      en: 'Velvet Lipstick',
    },
    desc: {
      fr: 'Couleur longue tenue et fini velours.',
      en: 'Long-lasting color with a velvet finish.',
    },
    image: '/images/rouge.jpg',
  },
  {
    id: 'prod_brosse',
    price_cents: 1490,
    currency: 'eur',
    name: {
      fr: 'Brosse Nettoyante Douce',
      en: 'Soft Cleansing Brush',
    },
    desc: {
      fr: 'Nettoie en profondeur sans agresser la peau.',
      en: 'Deep yet gentle cleansing.',
    },
    image: '/images/brosse.jpg',
  },
  {
    id: 'prod_brume',
    price_cents: 2290,
    currency: 'eur',
    name: {
      fr: 'Brume Tonique Florale',
      en: 'Floral Tonic Mist',
    },
    desc: {
      fr: 'Rafraîchit et tonifie la peau à tout moment.',
      en: 'Refreshes and tones the skin anytime.',
    },
    image: '/images/brume.jpg',
  },
];

// ------------------------------
// Routes simples
// ------------------------------

// Vérification rapide que le serveur tourne
app.get('/', (req, res) => {
  res.send('Serveur Liora Beauty OK 👍');
});

// Retourne la liste des produits
app.get('/api/products', (req, res) => {
  res.json(PRODUCTS);
});

// ------------------------------
// Route de paiement Stripe (Checkout Session)
// ------------------------------
app.post('/create-checkout-session', async (req, res) => {
  try {
    // items : [{ id: 'prod_serum', quantity: 1 }, ...]
    const { items } = req.body;
    const origin = req.headers.origin || 'http://localhost:4242';

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: { message: 'Aucun article reçu' } });
    }

    const line_items = items.map((item) => {
      const p = PRODUCTS.find((pp) => pp.id === item.id);
      if (!p) {
        throw new Error('Produit introuvable: ' + item.id);
      }

      return {
        price_data: {
          currency: p.currency,
          product_data: {
            name: p.name.fr,
            images: [origin + p.image],
          },
          unit_amount: p.price_cents, // en centimes
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${origin}/success.html`,
      cancel_url: `${origin}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Erreur Stripe :', err);
    res.status(400).json({
      error: { message: err.message || 'Erreur lors de la création de la session de paiement' },
    });
  }
});

// ------------------------------
// Démarrage du serveur
// ------------------------------

});
module.exports = app;
