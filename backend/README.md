# LienUrbain Project Ready

## Backend

```bash
cd backend
composer install
php bin/console doctrine:database:create --if-not-exists
php bin/console doctrine:schema:update --force
php bin/console lexik:jwt:generate-keypair
symfony server:start
```

Ou importe directement le fichier `backend/sql/lienurbainproject.sql` dans MySQL / phpMyAdmin.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Routes API disponibles

- POST `/api/register`
- POST `/api/login`
- GET `/api/users`
- GET `/api/users/{id}`
- GET `/api/me`
- GET `/api/categories`
- POST `/api/categories`
- GET `/api/annonces`
- POST `/api/annonces`
- PATCH `/api/annonces/{id}`
- DELETE `/api/annonces/{id}`
- GET `/api/my-announcements`

## Identifiants de test

Crée un utilisateur avec `/api/register`, puis connecte-toi avec `/api/login`.
