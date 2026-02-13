# Streaming privé — costamask.dev

Plateforme de streaming **privée** (pour moi et mes proches).
- Front : Vite / Vue 3
- UI : TailwindCSS + daisyUI
- Back : Strapi
- Repo : monorepo (front + backend + infra docker)

> Déploiement prévu sur mon homelab derrière **Nginx Proxy Manager (NPM)** : aucune app ne doit exposer de ports vers l’extérieur (pas de `ports:`), seul NPM publie 80/443. 

---

## ✨ Features (V1)
- Auth privée (accès restreint)
- Catalogue (grille, recherche, filtres)
- Fiche contenu (film/série)
- Lecture vidéo (MP4 ou HLS) + reprise de lecture
- Continuer à regarder (progression)
- Ma liste (favoris)
- Admin via Strapi (CRUD contenus, médias, users/rôles)

---

## 📦 Monorepo (structure)
```
repo/
  apps/
    web/        # Vite + Vue 3 + Tailwind + daisyUI
    api/        # Strapi
  infra/        # docker-compose, scripts, docs infra du projet
  .env.example
  README.md
  AGENTS.md
```

## 🚀 Démarrage (dev local)

### Prérequis
- Node.js (LTS recommandé)
- npm (ou pnpm/yarn)
- Docker (optionnel pour DB en local)

Chaque app a ses dépendances. Installe et lance depuis son dossier.
Si tu préfères pnpm, remplace `npm` par `pnpm`.

### Lancer le front
```bash
cd apps/web
npm install
npm run dev
```

### Lancer Strapi

```bash
cd apps/api
npm install
npm run develop
```

---

## 🔐 Variables d’environnement

Un .env.example doit exister à la racine (et/ou par app), sans secrets.
Créer ensuite un .env (non versionné).

Exemples de variables attendues (à adapter) :
- VITE_API_URL=http://localhost:1337
- STRAPI_URL=http://localhost:1337
- JWT_SECRET=...
- DATABASE_*

---

## 🐳 Déploiement (homelab / production)

### ⚠️ Règles serveur (obligatoires)

- Seul Nginx Proxy Manager expose 80/443
- Les stacks applicatives n’exposent pas de ports (ports: interdit)
- Les services doivent être sur un réseau Docker externe partagé : npm
- Données persistantes via volumes (DB, uploads Strapi, etc.)

Créer le réseau npm une seule fois :
```bash
docker network create npm 2>/dev/null || true
```

### Routing recommandé via NPM

app.costamask.dev → front
api.costamask.dev → Strapi

Le proxy se fait par nom de conteneur (services sur le réseau npm).

---

### 🧩 Tech stack

- Front : Vue 3, Vite, TailwindCSS, daisyUI
- Backend : Strapi (REST ou GraphQL)
- DB : PostgreSQL (recommandé) ou SQLite (dev)
- Reverse proxy prod : Nginx Proxy Manager (NPM)

---

### 📄 Docs serveur

Les règles d’infra sont détaillées dans AGENTS.md (utile aussi pour les agents/outils type Codex).

Ce fichier sert aux agents (ex: Codex) et aux contributeurs pour produire des configs **compatibles** avec mon homelab et mon reverse proxy.

### 🧭 Workflow Git
- Ne pas coder directement sur `main`.
- Une branche par feature/fix.
- PR vers `dev`, puis merge vers `main` après validation.

## 1) Contexte infrastructure (homelab)

- Proxmox : 192.168.1.210
- VM Debian 12 (Docker) : 192.168.1.89 (hostname: `docker`, user: `costa`)
- Livebox : 192.168.1.1
- NAT public :
  - 80/tcp -> 192.168.1.89:80
  - 443/tcp -> 192.168.1.89:443
- Domaine : costamask.dev
- Cloudflare DNS + DDNS : `favonia/cloudflare-ddns`
- Reverse proxy : Nginx Proxy Manager (container `nginx-proxy-manager`)
  - Admin NPM : http://192.168.1.89:81 (LAN uniquement, ne jamais exposer)

Source infra : voir README_SERVER.md et Agents_server.md. 

---

## 2) Règles non négociables (Docker / Déploiement)

1) ✅ **NPM est le seul service exposé sur 80/443**
2) ❌ Les applications **ne doivent PAS** utiliser `ports:` dans `docker-compose.yml`
3) ✅ Les applications doivent être accessibles via un réseau Docker externe partagé : **`npm`**
4) ✅ NPM doit être connecté au réseau `npm`
5) ✅ Utiliser des **volumes** pour la persistance (DB, uploads Strapi, etc.)
6) ✅ Fournir un `.env.example` (sans secrets) + documenter `.env` (non versionné)

---

## 3) Réseau Docker (obligatoire)

- Réseau externe requis : `npm`
- Création (idempotente) :
  - `docker network create npm 2>/dev/null || true`

Tous les services devant être proxifiés doivent inclure :
```yaml
networks:
  - npm
```
Et en bas du compose :
```yaml
networks:
  npm:
    external: true
```

---

## 4) Reverse proxy (NPM) : conventions

Les apps doivent être proxyfées via NPM avec :
- app.costamask.dev -> service front (ex: web)
- api.costamask.dev -> service Strapi (ex: api)
Le proxy se fait par nom de service Docker sur le réseau npm (pas via ports exposés).

---

## 5) Notes de conception attendues
- Monorepo : apps/web (front) + apps/api (strapi)
- En prod : utiliser NODE_ENV=production
- Strapi : persister /opt/app/public/uploads (ou équivalent) via volume
- DB : PostgreSQL recommandé en prod (volume obligatoire)
- Ne jamais commiter de secrets (.env ignoré)
