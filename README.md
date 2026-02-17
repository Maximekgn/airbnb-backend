# Airbnb Backend API

Backend API pour une application de type Airbnb, construite avec NestJS, Prisma et SQLite.

## Description

Cette API permet de gérer :

- **Authentification** : Inscription, connexion, JWT
- **Utilisateurs** : Gestion des profils avec avatars
- **Catégories** : Classification des propriétés (Apartment, House, Villa, etc.)
- **Propriétés** : Annonces de location avec images et galerie
- **Contrôle d'accès** : Système RBAC avec rôles USER et ADMIN

## Fonctionnalités principales

- ✅ Authentification JWT sécurisée
- ✅ Upload de fichiers (avatars, images de propriétés)
- ✅ Gestion de galerie d'images (5 images par propriété)
- ✅ Système de catégorisation des propriétés
- ✅ Contrôle d'accès basé sur les rôles (RBAC)
- ✅ Validation des données avec class-validator
- ✅ Base de données Prisma avec SQLite
- ✅ Seeding automatique des catégories

## Technologies

- **Framework** : NestJS 11
- **ORM** : Prisma 7
- **Base de données** : SQLite
- **Authentification** : JWT (passport-jwt)
- **Validation** : class-validator
- **Upload** : Multer
- **Langage** : TypeScript

## Installation

```bash
# Installation des dépendances
npm install

# Configuration de la base de données
npx prisma generate
npx prisma migrate dev

# Seeding des catégories
npm run seed
```

## Configuration

Créez un fichier `.env` à la racine du projet :

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="votre_secret_jwt_tres_securise"
```

## Démarrage du projet

```bash
# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

L'API sera accessible sur `http://localhost:3000`

## Seeding de la base de données

Pour peupler la base de données avec 15 catégories par défaut :

```bash
npm run seed
```

Catégories créées : Apartment, House, Villa, Studio, Loft, Penthouse, Cottage, Mansion, Townhouse, Bungalow, Tiny House, Beach House, Mountain Cabin, Eco-Lodge, Castle.

## Structure du projet

```
src/
├── resources/
│   ├── auth/           # Authentification JWT
│   ├── users/          # Gestion des utilisateurs
│   ├── categories/     # Catégories de propriétés
│   └── properties/     # Propriétés (annonces)
├── services/
│   ├── prisma.service.ts
│   ├── seed.service.ts
│   └── files.service.ts
├── common/
│   ├── guards/         # Guards RBAC
│   ├── decorators/     # Décorateurs personnalisés
│   └── enums/          # Énumérations (rôles)
├── config/
│   └── multer.config.ts
└── scripts/
    └── seed.ts         # Script de seeding

doc/
├── AUTH_DOCUMENTATION.md        # Documentation authentification
├── PROPERTY_DOCUMENTATION.md    # Documentation propriétés
└── CATEGORY_DOCUMENTATION.md    # Documentation catégories

bruno/
└── airbnb/             # Collection Bruno API
    ├── Auth/
    ├── Categories/
    └── Properties/
```

## API Endpoints

### Publics (sans authentification)

- `GET /categories` - Liste des catégories
- `GET /categories/:id` - Détails d'une catégorie
- `GET /properties` - Liste des propriétés
- `GET /properties/:id` - Détails d'une propriété

### Authentifiés (USER et ADMIN)

- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `POST /properties` - Créer une propriété
- `PATCH /properties/:id` - Modifier sa propriété
- `DELETE /properties/:id` - Supprimer sa propriété

### Admin uniquement

- `POST /categories` - Créer une catégorie
- `PATCH /categories/:id` - Modifier une catégorie
- `DELETE /categories/:id` - Supprimer une catégorie

## Tests avec Bruno

Une collection complète Bruno est disponible dans `/bruno`:

1. Installez [Bruno](https://www.usebruno.com/)
2. Ouvrez la collection `bruno/airbnb`
3. Configurez l'environnement Local (baseUrl)
4. Exécutez les requêtes

Voir `bruno/README.md` pour plus de détails.

## Documentation complète

Documentation détaillée disponible dans le dossier `/doc` :

- **[AUTH_DOCUMENTATION.md](doc/AUTH_DOCUMENTATION.md)** - Authentification, JWT, rôles RBAC
- **[PROPERTY_DOCUMENTATION.md](doc/PROPERTY_DOCUMENTATION.md)** - Gestion des propriétés, upload d'images
- **[CATEGORY_DOCUMENTATION.md](doc/CATEGORY_DOCUMENTATION.md)** - Gestion des catégories (ADMIN)

## Créer un compte ADMIN

Par défaut, tous les utilisateurs sont créés avec le rôle `USER`. Pour promouvoir un utilisateur en `ADMIN` :

```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

Ou via Prisma Studio :

```bash
npx prisma studio
```

## Scripts disponibles

```bash
npm run start          # Démarrage normal
npm run start:dev      # Mode watch (développement)
npm run start:prod     # Mode production
npm run build          # Compilation TypeScript
npm run seed           # Seeding de la base de données
npm run lint           # Linter ESLint
npm run format         # Formattage Prettier

npm run test           # Tests unitaires
npm run test:watch     # Tests en mode watch
npm run test:cov       # Couverture de tests
npm run test:e2e       # Tests end-to-end
```

## Sécurité

- Hash des mots de passe avec bcrypt (10 rounds)
- JWT sécurisé pour l'authentification
- Validation des données avec class-validator
- Contrôle d'accès RBAC (USER/ADMIN)
- Protection des relations en base de données
- Gestion sécurisée des fichiers uploadés

## Bases de données

Le projet utilise Prisma ORM avec SQLite. Pour d'autres bases de données :

1. Modifiez `datasource db` dans `prisma/schema.prisma`
2. Installez l'adaptateur correspondant
3. Mettez à jour `DATABASE_URL` dans `.env`

## Troubleshooting

### Erreur Prisma

```bash
npx prisma generate
npx prisma migrate reset
npm run seed
```

### Fichiers uploads manquants

Créez les dossiers :

```bash
mkdir -p uploads/avatars uploads/properties
```

### Token expiré

Reconnectez-vous via `POST /auth/login`

## Contribution

Ce projet est un exemple éducatif. Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence

[MIT licensed](LICENSE)
