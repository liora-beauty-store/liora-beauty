// --------------------------------------
// Backend minimal Liora Beauty (test)
// --------------------------------------

const express = require('express');const Stripe = require('stripe');

const app = express();const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.use(express.json());

// Route de test pour vérifier que le serveur marche
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Route de test pour le checkout (pour l'instant, pas de Stripe)
app.post('/create-checkout-session', (req, res) => {
  // On renvoie juste une URL factice pour vérifier que l'appel fonctionne
  res.json({
    url: 'https://example.com/fake-checkout'
  });
});

// Export pour Vercel (PAS de app.listen ici)
module.exports = app;
