# Documentation Catégories - Airbnb Backend

## Vue d'ensemble

Le système de gestion des catégories permet aux administrateurs de créer, consulter, mettre à jour et supprimer des catégories de propriétés. Les catégories servent à classer les propriétés par type (Apartment, House, Villa, etc.).

---

## 1. Consulter Toutes les Catégories

### Endpoint

```
GET /categories
```

### Authentification

Non requise (endpoint public)

### Description

Récupère la liste de toutes les catégories avec les propriétés associées à chacune.

### Exemple de requête

```bash
curl -X GET http://localhost:3000/categories
```

### Réponse réussie (200)

```json
[
  {
    "id": "uuid-string",
    "name": "Apartment",
    "description": "Modern apartments in urban areas",
    "icon": "🏢",
    "createdAt": "2025-02-17T10:30:00Z",
    "updatedAt": "2025-02-17T10:30:00Z",
    "properties": [
      {
        "id": "property-uuid",
        "name": "Modern Apartment in Paris",
        "price": "250.00",
        "image": "image-filename.png"
      }
    ]
  }
]
```

---

## 2. Consulter une Catégorie Spécifique

### Endpoint

```
GET /categories/:id
```

### Authentification

Non requise (endpoint public)

### Description

Récupère les détails complets d'une catégorie avec toutes les propriétés associées.

### Paramètres

```
id: string (UUID de la catégorie)
```

### Exemple de requête

```bash
curl -X GET http://localhost:3000/categories/550e8400-e29b-41d4-a716-446655440000
```

### Réponse réussie (200)

```json
{
  "id": "uuid-string",
  "name": "Apartment",
  "description": "Modern apartments in urban areas",
  "icon": "🏢",
  "createdAt": "2025-02-17T10:30:00Z",
  "updatedAt": "2025-02-17T10:30:00Z",
  "properties": [
    {
      "id": "property-uuid",
      "name": "Modern Apartment in Paris",
      "price": "250.00",
      "image": "image-filename.png",
      "location": "75001 Paris, France"
    }
  ]
}
```

### Erreur possible

#### 404 - Catégorie non trouvée

```json
{
  "statusCode": 404,
  "message": "Category not found",
  "error": "Not Found"
}
```

---

## 3. Créer une Catégorie (ADMIN seulement)

### Endpoint

```
POST /categories
```

### Authentification requise

```
Authorization: Bearer {JWT_TOKEN}
Rôle: ADMIN
```

**Important** : Seuls les utilisateurs avec le rôle ADMIN peuvent créer des catégories.

### Description

Crée une nouvelle catégorie de propriétés.

### Caractéristiques

- ✅ Authentification JWT requise
- ✅ Rôle ADMIN obligatoire
- ✅ Validation du nom unique
- ✅ Description et icône optionnelles

### Schéma de requête

#### Champs requis

```json
{
  "name": "string (unique, requis)"
}
```

#### Champs optionnels

```json
{
  "description": "string (optionnel)",
  "icon": "string (optionnel, emoji ou texte)"
}
```

### Exemple de requête (cURL)

```bash
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Luxury Villa",
    "description": "Premium villas with exclusive amenities",
    "icon": "🏰"
  }'
```

### Réponse réussie (201)

```json
{
  "id": "uuid-string",
  "name": "Luxury Villa",
  "description": "Premium villas with exclusive amenities",
  "icon": "🏰",
  "createdAt": "2025-02-17T10:30:00Z",
  "updatedAt": "2025-02-17T10:30:00Z"
}
```

### Erreurs possibles

#### 401 - Non authentifié

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### 403 - Accès refusé (Rôle insuffisant)

```json
{
  "statusCode": 403,
  "message": "User role USER does not have access to this resource",
  "error": "Forbidden"
}
```

#### 400 - Nom de catégorie déjà existant

```json
{
  "statusCode": 400,
  "message": "Category name already exists",
  "error": "Bad Request"
}
```

#### 400 - Validation échouée

```json
{
  "statusCode": 400,
  "message": ["name est requis"],
  "error": "Bad Request"
}
```

---

## 4. Modifier une Catégorie (ADMIN seulement)

### Endpoint

```
PATCH /categories/:id
```

### Authentification requise

```
Authorization: Bearer {JWT_TOKEN}
Rôle: ADMIN
```

**Important** : Seuls les utilisateurs avec le rôle ADMIN peuvent modifier des catégories.

### Description

Met à jour une catégorie existante.

### Paramètres

```
id: string (UUID de la catégorie)
```

### Schéma de requête

Tous les champs sont optionnels.

```json
{
  "name": "string (optionnel)",
  "description": "string (optionnel)",
  "icon": "string (optionnel)"
}
```

### Exemple de requête

```bash
curl -X PATCH http://localhost:3000/categories/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description for luxury villas",
    "icon": "🏛️"
  }'
```

### Réponse réussie (200)

Identique à la réponse de création (voir section 3).

### Erreurs possibles

#### 401 - Non authentifié

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### 403 - Accès refusé

```json
{
  "statusCode": 403,
  "message": "User role USER does not have access to this resource",
  "error": "Forbidden"
}
```

#### 404 - Catégorie non trouvée

```json
{
  "statusCode": 404,
  "message": "Category not found",
  "error": "Not Found"
}
```

---

## 5. Supprimer une Catégorie (ADMIN seulement)

### Endpoint

```
DELETE /categories/:id
```

### Authentification requise

```
Authorization: Bearer {JWT_TOKEN}
Rôle: ADMIN
```

**Important** :

- Seuls les utilisateurs avec le rôle ADMIN peuvent supprimer des catégories
- Une catégorie ne peut pas être supprimée si des propriétés y sont encore associées (protection `onDelete: Restrict`)

### Description

Supprime une catégorie existante.

### Paramètres

```
id: string (UUID de la catégorie)
```

### Exemple de requête

```bash
curl -X DELETE http://localhost:3000/categories/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer {JWT_TOKEN}"
```

### Réponse réussie (200)

```json
{
  "id": "uuid-string",
  "name": "Luxury Villa",
  "description": "Premium villas with exclusive amenities",
  "icon": "🏰",
  "createdAt": "2025-02-17T10:30:00Z",
  "updatedAt": "2025-02-17T10:30:00Z"
}
```

### Erreurs possibles

#### 401 - Non authentifié

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### 403 - Accès refusé

```json
{
  "statusCode": 403,
  "message": "User role USER does not have access to this resource",
  "error": "Forbidden"
}
```

#### 404 - Catégorie non trouvée

```json
{
  "statusCode": 404,
  "message": "Category not found",
  "error": "Not Found"
}
```

#### 400 - Catégorie utilisée par des propriétés

```json
{
  "statusCode": 400,
  "message": "Cannot delete category with existing properties",
  "error": "Bad Request"
}
```

---

## 6. Flux complet de gestion des Catégories

### Diagramme

```
┌─────────────────────────────────────────────────┐
│ 1. AUTHENTIFICATION ADMIN                       │
│    - POST /auth/login (avec compte ADMIN)      │
│    - Obtenir JWT_TOKEN avec role: ADMIN       │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ 2. CRÉER UNE CATÉGORIE                         │
│    - POST /categories                          │
│    - Header: Authorization: Bearer {JWT_TOKEN} │
│    - Body: { name, description?, icon? }      │
│    → Reçoit: Category object                  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ 3. CONSULTER LES CATÉGORIES (Public)          │
│    - GET /categories (toutes)                  │
│    - GET /categories/:id (une spécifique)     │
│    → Non authentifié (accès public)           │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ 4. MODIFIER LA CATÉGORIE (ADMIN seulement)    │
│    - PATCH /categories/:id                     │
│    - Header: Authorization: Bearer {JWT_TOKEN} │
│    - Body: { champs à modifier }              │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ 5. SUPPRIMER LA CATÉGORIE (ADMIN seulement)   │
│    - DELETE /categories/:id                    │
│    - Header: Authorization: Bearer {JWT_TOKEN} │
│    → Impossible si propriétés associées        │
└─────────────────────────────────────────────────┘
```

---

## 7. Architecture et Flux de Code

### Architecture globale

```
CategoriesController
    ├── @Post() → CategoriesService.create()
    │   └── Prisma: create Category
    │
    ├── @Get() → CategoriesService.findAll()
    │   └── Récupère toutes les catégories avec propriétés
    │
    ├── @Get(':id') → CategoriesService.findOne()
    │   └── Récupère une catégorie avec propriétés
    │
    ├── @Patch(':id') → CategoriesService.update()
    │   └── Update Category
    │
    └── @Delete(':id') → CategoriesService.remove()
        └── Delete Category (si aucune propriété associée)
```

### Détail des services

#### CategoriesService.create() (categories.service.ts:10-14)

1. Valide les données d'entrée
2. Crée l'enregistrement en base de données
3. Retourne la catégorie créée

#### CategoriesService.findAll() (categories.service.ts:16-29)

1. Récupère toutes les catégories
2. Inclut les propriétés associées (id, name, price, image)
3. Retourne la liste complète

#### CategoriesService.findOne() (categories.service.ts:31-46)

1. Récupère la catégorie par ID
2. Inclut les propriétés associées avec plus de détails (location)
3. Retourne la catégorie ou null

#### CategoriesService.update() (categories.service.ts:48-53)

1. Localise la catégorie par ID
2. Met à jour les champs fournis
3. Retourne la catégorie mise à jour

#### CategoriesService.remove() (categories.service.ts:55-59)

1. Localise la catégorie par ID
2. Vérifie qu'aucune propriété n'y est associée (Restrict)
3. Supprime la catégorie de la base de données

---

## 8. Structure de la Base de Données

### Modèle Category (Prisma)

```prisma
model Category {
  id          String     @id @default(cuid())
  name        String     @unique
  description String?
  icon        String?
  properties  Property[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([name])
}
```

### Relations

- **Property** : Une catégorie peut avoir plusieurs propriétés
- **onDelete: Restrict** : Impossible de supprimer une catégorie si des propriétés y sont associées

---

## 9. Validation des Données

### Règles appliquées

```typescript
@IsString()
@IsNotEmpty()
name: string;  // Requis, unique

@IsString()
@IsOptional()
description?: string;  // Optionnel

@IsString()
@IsOptional()
icon?: string;  // Optionnel
```

---

## 10. Contrôle d'Accès (RBAC)

### Endpoints publics

```
GET /categories           - Consulter toutes les catégories
GET /categories/:id       - Consulter une catégorie
```

### Endpoints ADMIN seulement

```
POST /categories          - Créer une catégorie (ADMIN)
PATCH /categories/:id     - Modifier une catégorie (ADMIN)
DELETE /categories/:id    - Supprimer une catégorie (ADMIN)
```

### Comment devenir ADMIN

Par défaut, tous les nouveaux utilisateurs sont créés avec le rôle `USER`. Pour attribuer le rôle `ADMIN`, vous devez modifier directement la base de données :

```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

Voir la section **10. Rôles et Contrôle d'Accès** dans `AUTH_DOCUMENTATION.md` pour plus de détails.

---

## 11. Test avec Bruno

### Collection d'exemples

Les fichiers de test Bruno sont disponibles dans :

- `bruno/airbnb/Categories/Get All Categories.bru` - Lister toutes les catégories
- `bruno/airbnb/Categories/Get Category By ID.bru` - Détails d'une catégorie
- `bruno/airbnb/Categories/Create Category.bru` - Créer une catégorie (ADMIN)
- `bruno/airbnb/Categories/Update Category.bru` - Modifier une catégorie (ADMIN)
- `bruno/airbnb/Categories/Delete Category.bru` - Supprimer une catégorie (ADMIN)

### Exemple de workflow Bruno

```
1. POST /auth/login (avec compte ADMIN)
   → Sauvegarde automatique du token

2. POST /categories
   Authorization: Bearer {token}
   Body: { "name": "Villa", "description": "Luxury villas", "icon": "🏰" }

3. GET /categories
   → Liste toutes les catégories

4. PATCH /categories/:id
   Authorization: Bearer {token}
   Body: { "description": "Updated description" }

5. DELETE /categories/:id
   Authorization: Bearer {token}
```

---

## 12. Catégories Suggérées (Seeders)

Voici une liste de catégories recommandées pour démarrer :

| Nom            | Description                             | Icône |
| -------------- | --------------------------------------- | ----- |
| Apartment      | Modern apartments in urban areas        | 🏢    |
| House          | Family houses with gardens              | 🏠    |
| Villa          | Luxury villas with premium amenities    | 🏰    |
| Studio         | Compact studio apartments               | 🏡    |
| Loft           | Industrial loft spaces                  | 🏭    |
| Penthouse      | Top-floor luxury apartments             | 🌟    |
| Cottage        | Cozy countryside cottages               | 🏚️    |
| Mansion        | Grand mansions with extensive grounds   | 🏛️    |
| Townhouse      | Multi-story urban townhouses            | 🏘️    |
| Bungalow       | Single-story bungalows                  | 🏚️    |
| Tiny House     | Minimalist tiny houses                  | 🏠    |
| Beach House    | Beachfront properties                   | 🏖️    |
| Mountain Cabin | Mountain retreat cabins                 | ⛰️    |
| Eco-Lodge      | Sustainable eco-friendly accommodations | 🌿    |
| Castle         | Historic castles and manor houses       | 🏰    |

---

## 13. Troubleshooting

| Problème                       | Cause                         | Solution                                       |
| ------------------------------ | ----------------------------- | ---------------------------------------------- |
| 401 Unauthorized               | Token manquant ou expiré      | Vérifier le header Authorization               |
| 403 Forbidden                  | Rôle USER au lieu de ADMIN    | Se connecter avec un compte ADMIN              |
| Nom de catégorie déjà existant | Le nom doit être unique       | Utiliser un nom différent                      |
| Impossible de supprimer        | Propriétés associées existent | Supprimer ou réassigner les propriétés d'abord |
| Catégorie non trouvée          | ID invalide ou inexistant     | Vérifier l'UUID de la catégorie                |

---

## 14. Fichiers impliqués

### Catégories

- `src/resources/categories/categories.controller.ts` - Endpoints
- `src/resources/categories/categories.service.ts` - Logique métier
- `src/resources/categories/categories.module.ts` - Configuration
- `src/resources/categories/dto/create-category.dto.ts` - Validation création
- `src/resources/categories/dto/update-category.dto.ts` - Validation modification

### Guards et Décorateurs

- `src/common/guards/roles.guard.ts` - Guard RBAC
- `src/common/decorators/roles.decorator.ts` - Décorateur @Roles
- `src/common/enums/user-role.enum.ts` - Énumération des rôles

### Services

- `src/services/prisma.service.ts` - Accès base de données

### Configuration

- `prisma/schema.prisma` - Schéma base de données

---

## 15. Sécurité

### Bonnes pratiques implémentées

✅ **Contrôle d'accès RBAC** : Seuls les ADMIN peuvent gérer les catégories
✅ **Authentification JWT** : Requise pour les opérations sensibles
✅ **Validation des données** : class-validator
✅ **Protection des relations** : onDelete: Restrict empêche la suppression accidentelle
✅ **Nom unique** : Évite les doublons de catégories

### Recommandations supplémentaires

- Ajouter un soft delete pour les catégories
- Implémenter une pagination pour GET /categories
- Ajouter des rate limits sur les endpoints ADMIN
- Logger les modifications de catégories (audit trail)
- Implémenter un système de tri/ordre pour affichage

---

## 16. Variables d'environnement

Les configurations sont dans : `prisma/schema.prisma` et les modules NestJS

```
DATABASE_URL     - URL de connexion à la base de données
JWT_SECRET       - Clé secrète pour signer les JWT
```

Voir `AUTH_DOCUMENTATION.md` pour plus de détails sur la configuration JWT.
