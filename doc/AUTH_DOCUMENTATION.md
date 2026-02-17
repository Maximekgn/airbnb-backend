# Documentation d'Authentification - Airbnb Backend

## Vue d'ensemble

Le système d'authentification utilise JWT (JSON Web Token) pour sécuriser les requêtes. Les utilisateurs doivent d'abord créer un compte (register), puis se connecter (login) pour obtenir un token.

---

## 1. Register (Inscription)

### Endpoint

```
POST /auth/register
```

### Description

Crée un nouveau compte utilisateur avec avatar optionnel.

### Caractéristiques

- ✅ Validation des doublons d'email
- ✅ Validation des doublons de téléphone
- ✅ Upload d'avatar optionnel
- ✅ Hashage sécurisé du mot de passe avec bcrypt
- ✅ Suppression automatique du fichier en cas d'erreur

### Schéma de requête

#### Champs requis

```json
{
  "firstName": "string (requis)",
  "lastName": "string (requis)",
  "email": "string (email valide, requis)",
  "password": "string (minimum 6 caractères, requis)"
}
```

#### Champs optionnels

```json
{
  "tel": "string (optionnel)",
  "avatar": "file (optionnel)"
}
```

### Exemple de requête (cURL)

**Sans avatar :**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "password": "SecurePassword123",
    "tel": "+33612345678"
  }'
```

**Avec avatar :**

```bash
curl -X POST http://localhost:3000/auth/register \
  -F "firstName=Jean" \
  -F "lastName=Dupont" \
  -F "email=jean.dupont@example.com" \
  -F "password=SecurePassword123" \
  -F "tel=+33612345678" \
  -F "avatar=@/path/to/avatar.png"
```

### Réponse réussie (200)

```json
{
  "id": "uuid-string",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "avatar": "avatar-filename.png",
  "tel": "+33612345678",
  "createdAt": "2025-02-17T10:30:00Z",
  "updatedAt": "2025-02-17T10:30:00Z"
}
```

### Erreurs possibles

#### 400 - Email déjà utilisé

```json
{
  "statusCode": 400,
  "message": "Email already in use",
  "error": "Bad Request"
}
```

#### 400 - Téléphone déjà utilisé

```json
{
  "statusCode": 400,
  "message": "tel already in use",
  "error": "Bad Request"
}
```

#### 400 - Validation échouée

```json
{
  "statusCode": 400,
  "message": [
    "firstName est requis",
    "lastName est requis",
    "email est requis",
    "password doit contenir au moins 6 caractères"
  ],
  "error": "Bad Request"
}
```

---

## 2. Login (Connexion)

### Endpoint

```
POST /auth/login
```

### Description

Authentifie un utilisateur et retourne un JWT token.

### Schéma de requête

#### Champs requis

```json
{
  "email": "string (email valide, requis)",
  "password": "string (minimum 6 caractères, requis)"
}
```

### Processus d'authentification

1. **Validation des données** : Vérification que l'email et le password sont fournis
2. **Recherche de l'utilisateur** : Vérification de l'existence de l'utilisateur par email
3. **Vérification du mot de passe** : Comparaison sécurisée avec bcrypt
4. **Génération du JWT** : Création d'un token signé contenant l'email et l'id utilisateur
5. **Réponse** : Retour du token et des informations de l'utilisateur

### Exemple de requête (cURL)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@example.com",
    "password": "SecurePassword123"
  }'
```

### Réponse réussie (200)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "jean.dupont@example.com",
    "id": "uuid-string",
    "role": "USER"
  }
}
```

### Erreurs possibles

#### 401 - Identifiants invalides

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

#### 400 - Données manquantes

```json
{
  "statusCode": 400,
  "message": "Email and password are required",
  "error": "Bad Request"
}
```

---

## 3. Utilisation du Token JWT

### Inclure le token dans les requêtes sécurisées

Une fois connecté, incluez le token dans l'en-tête `Authorization` :

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Structure du JWT

Le payload du JWT contient :

```json
{
  "email": "jean.dupont@example.com",
  "sub": "uuid-string",
  "role": "USER",
  "iat": 1708162200,
  "exp": 1708248600
}
```

**Rôles disponibles :**

- `USER` (par défaut) - Utilisateur standard
- `ADMIN` - Administrateur avec accès complet

---

## 4. Flux complet d'authentification

### Diagramme

```
┌─────────────────────────────────────────────────┐
│   1. REGISTER (POST /auth/register)              │
│   - Envoyer: firstName, lastName, email,        │
│     password, avatar (optionnel), tel (optionnel)
│   - Recevoir: User object                       │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│   2. LOGIN (POST /auth/login)                   │
│   - Envoyer: email, password                    │
│   - Recevoir: access_token + user info         │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│   3. UTILISER LE TOKEN                          │
│   - Ajouter: Authorization: Bearer {token}     │
│   - Accès aux endpoints protégés               │
└─────────────────────────────────────────────────┘
```

---

## 5. Architecture et Flux de Code

### Architecture globale

```
AuthController
    ├── @Post('register') → AuthService.register()
    │   └── UsersService.create() + bcrypt
    │
    └── @Post('login') → AuthService.validateUser()
        └── AuthService.login() → JwtService.signAsync()
```

### Détail des services

#### AuthService.register() (auth.service.ts:37-55)

1. Vérifie si l'email existe déjà
2. Vérifie si le téléphone existe déjà
3. Appelle UsersService.create()

#### AuthService.validateUser() (auth.service.ts:57-75)

1. Valide la présence d'email et password
2. Recherche l'utilisateur par email
3. Compare le password avec bcrypt.compare()
4. Retourne l'utilisateur sans le password

#### AuthService.login() (auth.service.ts:77-89)

1. Valide l'email et l'id de l'utilisateur
2. Crée le payload JWT
3. Signe le token avec JwtService
4. Retourne le token et les infos utilisateur

#### UsersService.create() (users.service.ts:15-26)

1. Hash le password avec bcrypt (10 rounds)
2. Crée l'utilisateur en base de données
3. Retourne l'utilisateur sans le password

---

## 6. Sécurité

### Bonnes pratiques implémentées

✅ **Hashage des mots de passe** : bcrypt avec 10 rounds
✅ **JWT sécurisé** : Tokens signés cryptographiquement
✅ **Validation des données** : class-validator
✅ **Pas d'exposition du password** : Exclusion systématique aux réponses
✅ **Gestion des fichiers** : Suppression en cas d'erreur
✅ **Vérification des doublons** : Email et téléphone

### Points de sécurité supplémentaires à considérer

- Ajouter des rate limits sur /auth/login et /auth/register
- Implémenter une expiration de token court (actuellement non spécifiée)
- Ajouter un refresh token
- Valider les uploads de fichiers (type, taille)
- Logger les tentatives d'authentification échouées

---

## 7. Variables d'environnement

Les configurations requises sont dans `auth.module.ts` et `jwt.strategy.ts` :

```
JWT_SECRET        - Clé secrète pour signer les JWT
JWT_EXPIRES_IN    - Durée de validité du token (optionnel)
```

---

## 8. Fichiers impliqués

### Authentification

- `src/resources/auth/auth.controller.ts` - Endpoints
- `src/resources/auth/auth.service.ts` - Logique d'authentification
- `src/resources/auth/auth.module.ts` - Configuration du module
- `src/resources/auth/jwt.strategy.ts` - Stratégie JWT
- `src/resources/auth/jwt-auth.guard.ts` - Guard pour protéger les routes

### Utilisateurs

- `src/resources/users/users.service.ts` - Logique métier utilisateur
- `src/resources/users/users.controller.ts` - Endpoints utilisateurs
- `src/resources/users/dto/create-user.dto.ts` - Validation des données

### Configuration

- `src/config/multer.config.ts` - Configuration d'upload de fichiers
- `src/main.ts` - Configuration globale de l'application

---

## 9. Test avec Bruno/Postman

### Collection d'exemples

#### Register

```
POST http://localhost:3000/auth/register
Content-Type: multipart/form-data

firstName: Jean
lastName: Dupont
email: jean.dupont@example.com
password: SecurePassword123
tel: +33612345678
avatar: (file)
```

#### Login

```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "jean.dupont@example.com",
  "password": "SecurePassword123"
}
```

#### Utiliser le token

```
GET http://localhost:3000/users/profile
Authorization: Bearer {access_token}
```

---

## 10. Troubleshooting

| Problème                          | Cause                    | Solution                                     |
| --------------------------------- | ------------------------ | -------------------------------------------- |
| "Email already in use"            | Email existe déjà        | Utiliser un email unique                     |
| "tel already in use"              | Téléphone existe déjà    | Utiliser un téléphone unique ou laisser vide |
| "Invalid credentials"             | Email/password incorrect | Vérifier l'email et le password              |
| "Email and password are required" | Données manquantes       | Fournir email et password                    |

---

## 10. Rôles et Contrôle d'Accès (RBAC)

### Vue d'ensemble

Le système implémente un contrôle d'accès basé sur les rôles (RBAC). Les utilisateurs ont un rôle qui détermine leurs permissions.

### Rôles disponibles

#### USER (Utilisateur standard)

Permissions :

- ✅ Créer des propriétés
- ✅ Modifier ses propres propriétés
- ✅ Supprimer ses propres propriétés
- ✅ Consulter toutes les propriétés
- ❌ Accéder aux fonctions administrateurs
- ❌ Modifier une catégorie
- ❌ Créer une catégorie

#### ADMIN (Administrateur)

Permissions :

- ✅ Toutes les permissions des USER
- ✅ Créer des catégories
- ✅ Modifier les catégories
- ✅ Supprimer les catégories
- ✅ Consulter toutes les catégories
- ✅ Accès complet à tous les endpoints

**Note** : Les admins ont accès par défaut à tous les endpoints protégés, indépendamment du rôle requis.

### Attribution des rôles

Par défaut, les nouveaux utilisateurs sont créés avec le rôle `USER`. Pour attribuer le rôle `ADMIN`, vous devez modifier directement la base de données :

```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

### Contrôle d'accès par endpoint

#### Endpoints publics (pas d'authentification requise)

```
GET /properties           - Consulter toutes les propriétés
GET /properties/:id       - Consulter une propriété
GET /categories           - Consulter toutes les catégories
GET /categories/:id       - Consulter une catégorie
```

#### Endpoints protégés (USER et ADMIN)

```
POST /properties          - Créer une propriété (USER, ADMIN)
PATCH /properties/:id     - Modifier une propriété (USER, ADMIN)
DELETE /properties/:id    - Supprimer une propriété (USER, ADMIN)
```

#### Endpoints Admin seulement

```
POST /categories          - Créer une catégorie (ADMIN seulement)
PATCH /categories/:id     - Modifier une catégorie (ADMIN seulement)
DELETE /categories/:id    - Supprimer une catégorie (ADMIN seulement)
```

### Exemple : Requête protégée avec vérification de rôle

Si vous essayez d'accéder à un endpoint ADMIN avec un rôle USER :

```bash
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer {JWT_TOKEN_USER}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Luxury",
    "description": "Luxury properties"
  }'
```

Réponse (403 Forbidden) :

```json
{
  "statusCode": 403,
  "message": "User role USER does not have access to this resource",
  "error": "Forbidden"
}
```

### Flux d'authentification et autorisation

```
┌─────────────────────────────────────────┐
│ 1. AUTHENTIFICATION                     │
│    POST /auth/login                     │
│    → JWT avec rôle                      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 2. REQUÊTE PROTÉGÉE                     │
│    Header: Authorization: Bearer {JWT}  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 3. VÉRIFICATION JWT                     │
│    JwtAuthGuard valide le token         │
│    Extraction du rôle du token          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 4. VÉRIFICATION RÔLE                    │
│    RolesGuard vérifie les permissions   │
│    Admin bypass toute vérification      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 5. ACCÈS ACCORDÉ OU REFUSÉ              │
│    200 OK (accès autorisé)              │
│    403 Forbidden (accès refusé)         │
└─────────────────────────────────────────┘
```

### Fichiers impliqués

- `src/common/enums/user-role.enum.ts` - Définition des rôles
- `src/common/guards/roles.guard.ts` - Guard pour vérifier les rôles
- `src/common/decorators/roles.decorator.ts` - Décorateur pour spécifier les rôles
- `src/resources/auth/jwt.strategy.ts` - Extraction du rôle du JWT
- `prisma/schema.prisma` - Model User avec champ role
