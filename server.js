const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = Stripe(stripeSecret);

const PRODUCTS = [
  { id: "prod_serum", price_cents: 2990, currency: "eur",
    name: { fr: "Sérum Éclat Visage", en: "Radiance Face Serum" },
    desc: { fr: "Sérum léger pour illuminer la peau.", en: "Light serum to brighten skin." },
    image: "/images/serum.jpg" },
  { id: "prod_creme", price_cents: 2490, currency: "eur",
    name: { fr: "Crème Hydratante Pure", en: "Pure Hydrating Cream" },
    desc: { fr: "Hydratation quotidienne pour tous types de peau.", en: "Daily hydration for all skin types." },
    image: "/images/creme.jpg" },
  { id: "prod_rouge", price_cents: 1990, currency: "eur",
    name: { fr: "Rouge à Lèvres Velours", en: "Velvet Lipstick" },
    desc: { fr: "Couleur longue tenue et fini velours.", en: "Long-lasting color with a velvet finish." },
    image: "/images/rouge.jpg" },
  { id: "prod_brosse", price_cents: 1490, currency: "eur",
    name: { fr: "Brosse Nettoyante Douce", en: "Gentle Cleansing Brush" },
    desc: { fr: "Nettoie en profondeur sans irriter.", en: "Deep cleansing without irritation." },
    image: "/images/brosse.jpg" },
  { id: "prod_brume", price_cents: 2290, currency: "eur",
    name: { fr: "Brume Tonique Florale", en: "Floral Toning Mist" },
    desc: { fr: "Rafraîchit et tonifie la peau.", en: "Refreshes and tones the skin." },
    image: "/images/brume.jpg" }
];
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// ... ton tableau PRODUCTS, tes autres routes (Stripe, etc.)

// ➜ AJOUTE ÇA :
app.get('/', (req, res) => {
  res.send('Serveur Liora Beauty OK 👍');
});

// lancement du serveur
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
app.get('/api/products', (req, res) => {
  res.json(PRODUCTS);
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body; // [{id, quantity, lang}]
    const origin = req.headers.origin || 'http://localhost:4242';
    const line_items = items.map(item => {
      const p = PRODUCTS.find(pp => pp.id === item.id);
      if (!p) throw new Error('Produit introuvable: ' + item.id);
      return {
        price_data: {
          currency: p.currency,
          product_data: { name: p.name.en, images: [ origin + p.image ] },
          unit_amount: p.price_cents
        },
        quantity: item.quantity
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${origin}/success.html`,
      cancel_url: `${origin}/cancel.html`
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: { message: err.message }});
  }
});

const PORT = process.env.PORT || 4242;
app.get('/', (req, res) => {
  res.send('Serveur OK');
});
app.listen(PORT, () => console.log(`Liora Beauty server running on port ${PORT}`));
