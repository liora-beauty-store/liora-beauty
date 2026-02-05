# Liora Beauty — Pack clé en main (FR/EN)

Tu as maintenant le site personnalisé "Liora Beauty" prêt à déployer.

## Contenu
- `server.js` : backend Express + Stripe (sessions Checkout).
- `public/` : frontend bilingue FR/EN avec sélecteur de langue.
- `package.json` : dépendances.
- Images placeholders dans `public/images/`.
- README avec instructions de déploiement.

## Lance en local (rapide)
1. Installer Node.js (>=16) et npm.
2. Dans le dossier, `npm install`.
3. Définir la variable d'environnement `STRIPE_SECRET_KEY` (clé test Stripe):
   - macOS / Linux: `export STRIPE_SECRET_KEY=sk_test_xxx`
   - Windows (PowerShell): `$env:STRIPE_SECRET_KEY='sk_test_xxx'`
4. `npm run dev` (ou `npm start`)
5. Ouvrir `http://localhost:4242`

## Déploiement sur Vercel (pas besoin de carte bancaire)
Option A — depuis GitHub (recommandé)
1. Crée un compte sur https://github.com si tu n'en as pas.
2. Pousse le dossier du projet sur un nouveau repo (nom : `liora-beauty`).
   - `git init`
   - `git add .`
   - `git commit -m "Initial commit Liora Beauty"`
   - `git branch -M main`
   - `git remote add origin https://github.com/TONCOMPTE/liora-beauty.git`
   - `git push -u origin main`
3. Crée un compte gratuit sur https://vercel.com (utilise GitHub pour te connecter).
4. Dans Vercel : **New Project → Import from GitHub → select `liora-beauty`**.
5. Dans les Environment Variables, ajoute `STRIPE_SECRET_KEY` (valeur : ta clé Stripe test/live).
6. Clique sur **Deploy**. En quelques secondes tu auras une URL du type `https://liora-beauty.vercel.app`.

Option B — sans GitHub (méthode manuelle)
- Tu peux utiliser l'interface Vercel pour déployer via Vercel CLI (je peux te fournir les commandes si tu veux).

## Aide que je peux fournir (je peux faire maintenant)
1) Je peux zipper le projet et te fournir le lien (fichier prêt).  
2) Je peux te guider pas-à-pas pour créer le repo GitHub et connecter Vercel (je te donne chaque commande et chaque clic).  
3) Je peux ajouter un webhook Stripe et enregistrer les commandes dans Google Sheets.  
4) Je peux créer une version Shopify si tu préfères.

Dis-moi ce que tu veux faire maintenant : **(A) Télécharger le zip**, **(B) Je veux que tu m'expliques étape-par-étape comment créer le repo GitHub et déployer sur Vercel**, ou **(C) Autre**.
