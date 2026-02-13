# AGENTS.md — Streaming privé (Monorepo)

Ce fichier guide les agents (Codex) et contributeurs pour travailler sur ce repo **sans casser la structure**, et surtout pour générer des configs **compatibles avec mon homelab** (Nginx Proxy Manager).

---

## 1) Objectif du projet

Plateforme de streaming **privée** (moi + proches) :
- Front : Vite + Vue 3
- UI : TailwindCSS + daisyUI
- Backend : Strapi
- Déploiement : Docker sur VM Debian 12 derrière Nginx Proxy Manager (NPM)

---

## 2) Architecture du repo (monorepo)

Structure attendue :

repo/
  apps/
    web/        # Frontend Vue3/Vite
    api/        # Backend Strapi
  infra/        # docker-compose, scripts, docs infra du projet
  .env.example
  README.md
  AGENTS.md

Règles :
- Ne pas mélanger front et back dans le même dossier.
- Les fichiers Docker/compose du projet doivent être dans `infra/` (ou à la racine si décidé, mais rester cohérent).
- Toujours fournir des `.env.example` sans secrets.

---

## 3) Contrainte serveur (HOMELAB) — NON NÉGOCIABLE

Le serveur est exposé sur Internet uniquement via NPM :
- Livebox NAT :
  - 80/tcp -> VM Docker:80
  - 443/tcp -> VM Docker:443
- NPM admin : http://192.168.1.89:81 (LAN uniquement, ne jamais exposer)
- Domaine : costamask.dev
- DNS Cloudflare + DDNS (favonia/cloudflare-ddns)

Conséquence :
✅ NPM est le seul point d’entrée public  
❌ Les applications du projet ne doivent jamais exposer de ports (pas de `ports:`)

Sources : README_SERVER.md + Agents_server.md. 

---

## 4) Règles Docker-compose du projet

### 4.1 Interdictions / obligations
- ❌ Interdit : `ports:` dans les services applicatifs (web, api, db, etc.)
- ✅ Obligatoire : connecter les services à un réseau Docker externe partagé : `npm`
- ✅ Obligatoire : volumes pour persister la DB et les uploads Strapi
- ✅ Obligatoire : healthchecks (au moins DB) si possible
- ✅ Les services doivent être accessibles à NPM via leur **nom de service Docker**

### 4.2 Réseau Docker requis
Le réseau externe doit exister sur l’hôte :

docker network create npm 2>/dev/null || true

Dans les compose :
```yaml
networks:
  npm:
    external: true
```
Et pour chaque service proxifié :
```yaml
networks:
  - npm
```

--- 

## 5) Routing NPM attendu (prod)

Conventions recommandées :
- app.costamask.dev -> Frontend (web)
- api.costamask.dev -> Strapi (api)
Le proxy se fait via :
- Scheme: http
- Forward Hostname/IP: nom du service docker (ex: web ou api)
- Forward Port: port interne du container (ex: 80 pour web, 1337 pour strapi)

--- 

## 6) Backend (Strapi) — conventions

### 6.1 Données persistantes
- Persister les uploads Strapi (ex: /opt/app/public/uploads ou équivalent) via volume.
- DB : PostgreSQL recommandé en prod (volume obligatoire).

### 6.2 Permissions
- Public : rien
- Authenticated : lecture catalogue + écriture progression + favoris
- Admin : full (panel Strapi)

--- 

## 7) Front (Vue3) — conventions
- Le front consomme l’API Strapi via VITE_API_URL.
- Les routes sensibles doivent être protégées (auth guard).
- La page lecture (/watch/:id) doit sauvegarder la progression régulièrement (ex: toutes les X secondes).

--- 

## 8) Variables d’environnement

Toujours fournir :
- .env.example (sans secrets)
- .env ignoré par git

Variables typiques :
- Front :
    - VITE_API_URL=...
- Strapi :
    - HOST=0.0.0.0
    - PORT=1337
    - APP_KEYS=...
    - API_TOKEN_SALT=...
    - ADMIN_JWT_SECRET=...
    - JWT_SECRET=...
- DB :
    - DATABASE_CLIENT=postgres
    - DATABASE_HOST=db
    - DATABASE_PORT=5432
    - DATABASE_NAME=...
    - DATABASE_USERNAME=...
    - DATABASE_PASSWORD=...

---

## 9) DoD (Definition of Done)

Une PR est acceptée si :
- build OK (web + api)
- aucune app n’expose de ports: en prod
- compose utilise le réseau npm
- volumes de persistance présents
- README mis à jour si la PR change les commandes ou l’archi

---

## 10) Workflow Git (obligatoire)

- Ne pas coder directement sur `main`.
- Créer une branche par feature/fix (ex: `feat/auth`, `fix/watch-progress`).
- Ouvrir une PR vers la branche `dev`.
- La branche `dev` est fusionnée vers `main` uniquement après ta validation.
