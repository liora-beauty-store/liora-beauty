// --------------------------------------
// Imports
// --------------------------------------
const express = require('express');
const Stripe = require('stripe');

// --------------------------------------
// App Express
// --------------------------------------
const app = express();
app.use(express.json());

// --------------------------------------
// Stripe
// --------------------------------------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// --------------------------------------
// Route de test (santé du serveur)
// --------------------------------------
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// --------------------------------------
// Produits Liora Beauty
// (données en dur, comme dans ta capture)
// --------------------------------------
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
      fr: 'Sérum léger pour illuminer la peau',
      en: 'Lightweight serum to brighten skin',
    },
    image: '/serum.jpg',
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
      fr: 'Hydratation quotidienne pour tous types de peau',
      en: 'Daily hydration for all skin types',
    },
    image: '/creme.jpg',
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
      fr: 'Couleur longue tenue et fini velours',
      en: 'Long-lasting color with a velvet finish',
    },
    image: '/rouge.jpg',
  },
  {
    id: 'prod_brosse',
    price_cents: 1490,
    currency: 'eur',
    name: {
      fr: 'Brosse Nettoyante Douce',
      en: 'Gentle Cleansing Brush',
    },
    desc: {
      fr: 'Nettoyage en profondeur sans agresser la peau',
      en: 'Deep cleansing without irritating skin',
    },
    image: '/brosse.jpg',
  },
];

// --------------------------------------
// Route Stripe : créer une session Checkout
// --------------------------------------
app.post('/create-checkout-session', async (req, res) => {
  try {
    const items = req.body.items || [];

    // origine du site (pour les URLs de succès / annulation + images)
    const origin =
      req.headers.origin || 'https://liora-beauty.vercel.app';

    // Transformer les items du panier en line_items Stripe
    const line_items = items.map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) {
        throw new Error(`Produit introuvable : ${item.id}`);
      }

      return {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name.fr,
            images: [origin + product.image],
          },
          // Stripe attend un montant en CENTIMES
          unit_amount: product.price_cents,
        },
        quantity: item.quantity || 1,
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
      error: {
        message:
          err.message || "Erreur lors de la création de la session",
      },
    });
  }
});

// --------------------------------------
// Export pour Vercel
// --------------------------------------
module.exports = app;
