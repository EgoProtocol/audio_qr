# 🔧 PROMPT OPTIMISÉ POUR CLAUDE

_(Frontend UI/UX — Audio to QR Utility)_

---

## RÔLE

Tu es un **expert frontend UI/UX** spécialisé dans les **produits utilitaires modernes** (type remove.bg, ilovepdf, tinywow).

Tu travailles sur un **outil simple, rapide, orienté action**, destiné à des utilisateurs non techniques.

---

## CONTEXTE PROJET

Nous développons un site utilitaire permettant de **partager un fichier audio via QR Code**.

### User flow (déjà fonctionnel côté backend) :

1. L’utilisateur arrive sur la page
2. Il upload un fichier audio
3. Le backend retourne :

   - une URL publique
   - un QR Code

4. Le QR permet à un tiers :

   - d’écouter l’audio
   - de télécharger le fichier

⚠️ Le backend est **terminé et hors scope**.
Tu ne dois **proposer AUCUNE modification backend**.

---

## STACK TECHNIQUE IMPOSÉE

- HTML
- CSS (Tailwind autorisé)
- JavaScript vanilla
- Aucune librairie JS lourde
- AUCUN framework JS (React, Vue, Angular interdits)

---

## INSPIRATION UI / UX

Inspiration principale : **[https://www.remove.bg/](https://www.remove.bg/)**

👉 Inspiration **conceptuelle uniquement**, pas un clone pixel-perfect.

### Principes clés à appliquer :

- Hero centré
- Action principale unique
- Drag & drop clair
- UX évidente sans explication longue
- Design minimal mais premium
- Peu de texte
- Mobile-first

---

## PAGES À CONCEVOIR

### 1️⃣ Page principale — Upload

Doit contenir :

- Un titre clair et court
- Un sous-titre explicatif (1 phrase max)
- Une zone drag & drop bien visible
- Un bouton upload (fallback)
- États UI :

  - idle
  - loading
  - success

---

### 2️⃣ Écran résultat (après upload)

À afficher **sur la même page** (pas de navigation supplémentaire) :

- QR Code généré
- Bouton “Open audio page”
- Bouton “Download audio”
- Option “Copy link” (facultatif)

---

### 3️⃣ Page publique audio

- Design très simple
- Lecteur audio mis en avant
- Bouton download
- Mobile-first
- Pas de distractions

---

## CONTRAINTES TECHNIQUES FORTES

- Le frontend doit fonctionner **strictement** avec les routes existantes :

  - `POST /upload`
  - `GET /audio/:filename`
  - `GET /files/:filename`

- Le backend retourne ce JSON :

```json
{
  "audioUrl": "string",
  "qrCode": "data:image/png;base64,..."
}
```

---

## PRIORITÉS ABSOLUES (ordre strict)

1. Clarté UX
2. Simplicité
3. Rapidité de compréhension
4. Esthétique moderne
5. Compatibilité mobile

---

## HORS SCOPE (INTERDIT)

❌ Authentification
❌ Comptes utilisateurs
❌ Historique
❌ Expiration des fichiers
❌ SEO
❌ Analytics
❌ Backend / API changes
❌ Animations complexes

---

## LIVRABLE ATTENDU

Tu dois fournir :

1. Une **structure HTML claire**
2. Une **architecture UI (sections, composants)**
3. Un **style CSS moderne** (Tailwind ou CSS custom)
4. Du **code frontend prêt à intégrer**
5. Des **commentaires courts expliquant les choix UX**

---

## FORMAT DE RÉPONSE ATTENDU

- Étapes claires
- Sections bien séparées
- Code directement exploitable
- Pas de blabla théorique inutile
- Pas de propositions hors scope

---

## OBJECTIF FINAL

Livrer une **interface frontend propre, moderne et efficace**, alignée avec les standards des **outils utilitaires premium**, tout en restant **extrêmement simple à comprendre et à utiliser**.

---

### IMPORTANT

Si une décision UX n’est pas explicitement demandée :

- choisis la solution **la plus simple**
- privilégie toujours la **lisibilité** à l’originalité
