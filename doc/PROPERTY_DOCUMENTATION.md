# Documentation - Création de Propriété - Airbnb Backend

## Vue d'ensemble

Le système de gestion des propriétés permet aux propriétaires authentifiés de créer, consulter, mettre à jour et supprimer des annonces de location. Les propriétés incluent des informations détaillées, une image principale, et une galerie d'images supplémentaires.

---

## 1. Créer une Propriété (Create)

### Endpoint

```
POST /properties
```

### Authentification requise

```
Authorization: Bearer {JWT_TOKEN}
```

**Important** : Seuls les utilisateurs authentifiés peuvent créer une propriété. Le propriétaire est automatiquement défini à partir du token JWT.

### Description

Crée une nouvelle annonce de propriété avec image principale et galerie de 5 images obligatoires.

### Caractéristiques

- ✅ Authentification JWT requise
- ✅ Upload d'image principale (OBLIGATOIRE)
- ✅ Upload de galerie d'images (5 images OBLIGATOIRES)
- ✅ Assignation automatique du propriétaire (userId du token)
- ✅ Stockage sécurisé avec noms uniques
- ✅ Suppression automatique des fichiers en cas d'erreur
- ✅ Validation complète des données

### Schéma de requête

#### Champs requis

```json
{
  "price": "string (ex: '250.00', requis)",
  "name": "string (titre de la propriété, requis)",
  "location": "string (adresse complète, requis)",
  "categoryId": "string (ID de la catégorie, requis)",
  "description": "string (description détaillée, requis)",
  "bedrooms": "number (nombre entier, requis)",
  "bathrooms": "number (nombre entier, requis)"
}
```

#### Champs booléens (Amennités)

```json
{
  "garage": "boolean (true/false, requis)",
  "wifi": "boolean (true/false, requis)",
  "kitchen": "boolean (true/false, requis)"
}
```

#### Champs obligatoires (Images)

```json
{
  "image": "file (OBLIGATOIRE - image principale)",
  "gallery": "array of files (OBLIGATOIRE - exactement 5 images)"
}
```

### Structure de réponse réussie (201)

```json
{
  "id": "uuid-string",
  "price": "250.00",
  "name": "Modern Apartment in Paris",
  "location": "75001 Paris, France",
  "category": "Apartment",
  "description": "Spacious and modern apartment...",
  "bedrooms": 3,
  "bathrooms": 2,
  "garage": true,
  "wifi": true,
  "kitchen": true,
  "image": "image-filename.png",
  "ownerId": "user-uuid",
  "createdAt": "2025-02-17T10:30:00Z",
  "updatedAt": "2025-02-17T10:30:00Z",
  "gallery": [
    {
      "id": "uuid-string",
      "url": "gallery-image-1.png",
      "propertyId": "property-uuid"
    }
  ]
}
```

### Exemple de requête (cURL)

**Avec images (obligatoire - multipart/form-data) :**

```bash
curl -X POST http://localhost:3000/properties \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -F "price=250.00" \
  -F "name=Modern Apartment in Paris" \
  -F "location=75001 Paris, France" \
  -F "category=Apartment" \
  -F "description=Spacious and modern apartment in the heart of the city" \
  -F "bedrooms=3" \
  -F "bathrooms=2" \
  -F "garage=true" \
  -F "wifi=true" \
  -F "kitchen=true" \
  -F "image=@/path/to/main-image.jpg" \
  -F "gallery=@/path/to/image1.jpg" \
  -F "gallery=@/path/to/image2.jpg" \
  -F "gallery=@/path/to/image3.jpg" \
  -F "gallery=@/path/to/image4.jpg" \
  -F "gallery=@/path/to/image5.jpg"
```

**Note** : Les 5 images de galerie sont OBLIGATOIRES. Vous devez toujours fournir exactement 5 fichiers pour le champ `gallery`.

### Erreurs possibles

#### 401 - Non authentifié

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### 400 - Validation échouée

```json
{
  "statusCode": 400,
  "message": [
    "price est requis",
    "name est requis",
    "location est requis",
    "category est requis",
    "description est requis",
    "bedrooms doit être un nombre",
    "bathrooms doit être un nombre",
    "garage doit être un booléen",
    "wifi doit être un booléen",
    "kitchen doit être un booléen"
  ],
  "error": "Bad Request"
}
```

#### 400 - Erreur d'upload de fichier

```json
{
  "statusCode": 400,
  "message": "Image principale est requise",
  "error": "Bad Request"
}
```

#### 400 - Nombre d'images insuffisant

```json
{
  "statusCode": 400,
  "message": "Exactement 5 images sont requises pour la galerie",
  "error": "Bad Request"
}
```

#### 400 - Erreur lors de l'upload

```json
{
  "statusCode": 400,
  "message": "File upload failed",
  "error": "Bad Request"
}
```

#### 500 - Erreur serveur

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## 2. Consulter Toutes les Propriétés

### Endpoint

```
GET /properties
```

### Authentification

Non requise (endpoint public)

### Description

Récupère la liste de toutes les propriétés avec les URLs complètes des images.

### Réponse réussie (200)

```json
[
  {
    "id": "uuid-string",
    "price": "250.00",
    "name": "Modern Apartment in Paris",
    "location": "75001 Paris, France",
    "category": "Apartment",
    "description": "Spacious and modern apartment...",
    "bedrooms": 3,
    "bathrooms": 2,
    "garage": true,
    "wifi": true,
    "kitchen": true,
    "image": "http://localhost:3000/uploads/properties/image-filename.png",
    "ownerId": "user-uuid",
    "createdAt": "2025-02-17T10:30:00Z",
    "updatedAt": "2025-02-17T10:30:00Z"
  },
  ...
]
```

### Exemple de requête

```bash
curl -X GET http://localhost:3000/properties
```

---

## 3. Consulter une Propriété Spécifique

### Endpoint

```
GET /properties/:id
```

### Authentification

Non requise (endpoint public)

### Description

Récupère les détails complets d'une propriété avec le profil du propriétaire et les images de la galerie.

### Paramètres

```
id: string (UUID de la propriété)
```

### Réponse réussie (200)

```json
{
  "id": "uuid-string",
  "price": "250.00",
  "name": "Modern Apartment in Paris",
  "location": "75001 Paris, France",
  "category": "Apartment",
  "description": "Spacious and modern apartment...",
  "bedrooms": 3,
  "bathrooms": 2,
  "garage": true,
  "wifi": true,
  "kitchen": true,
  "image": "http://localhost:3000/uploads/properties/image-filename.png",
  "ownerId": "user-uuid",
  "createdAt": "2025-02-17T10:30:00Z",
  "updatedAt": "2025-02-17T10:30:00Z",
  "owner": {
    "id": "user-uuid",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "avatar": "http://localhost:3000/uploads/avatars/avatar-filename.png",
    "tel": "+33612345678",
    "createdAt": "2025-02-17T10:30:00Z",
    "updatedAt": "2025-02-17T10:30:00Z"
  },
  "gallery": [
    {
      "id": "uuid-string",
      "url": "http://localhost:3000/uploads/properties/gallery-image-1.png",
      "propertyId": "property-uuid"
    },
    {
      "id": "uuid-string",
      "url": "http://localhost:3000/uploads/properties/gallery-image-2.png",
      "propertyId": "property-uuid"
    }
  ]
}
```

### Exemple de requête

```bash
curl -X GET http://localhost:3000/properties/550e8400-e29b-41d4-a716-446655440000
```

### Erreur possible

#### 404 - Propriété non trouvée

```json
{
  "statusCode": 404,
  "message": "Property not found",
  "error": "Not Found"
}
```

---

## 4. Modifier une Propriété

### Endpoint

```
PATCH /properties/:id
```

### Authentification requise

```
Authorization: Bearer {JWT_TOKEN}
```

**Important** : Seul le propriétaire de l'annonce peut la modifier.

### Description

Met à jour une propriété existante avec image et galerie optionnelles.

### Paramètres

```
id: string (UUID de la propriété)
```

### Schéma de requête

Tous les champs sont optionnels, SAUF la galerie si vous voulez la modifier (5 images obligatoires).

```json
{
  "price": "string (optionnel)",
  "name": "string (optionnel)",
  "location": "string (optionnel)",
  "category": "string (optionnel)",
  "description": "string (optionnel)",
  "bedrooms": "number (optionnel)",
  "bathrooms": "number (optionnel)",
  "garage": "boolean (optionnel)",
  "wifi": "boolean (optionnel)",
  "kitchen": "boolean (optionnel)",
  "image": "file (optionnel - nouvelle image principale)",
  "gallery": "array of files (optionnel - si fourni, doit contenir exactement 5 images)"
}
```

### Exemple de requête

**Mise à jour des données seules :**

```bash
curl -X PATCH http://localhost:3000/properties/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "price": "300.00",
    "description": "Mettre à jour la description"
  }'
```

**Mise à jour avec nouvelles images :**

```bash
curl -X PATCH http://localhost:3000/properties/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -F "price=300.00" \
  -F "image=@/path/to/new-image.jpg" \
  -F "gallery=@/path/to/new-gallery-1.jpg" \
  -F "gallery=@/path/to/new-gallery-2.jpg" \
  -F "gallery=@/path/to/new-gallery-3.jpg" \
  -F "gallery=@/path/to/new-gallery-4.jpg" \
  -F "gallery=@/path/to/new-gallery-5.jpg"
```

**Note** : Si vous uploadez une nouvelle galerie, vous DEVEZ fournir exactement 5 images. Si vous modifiez juste le prix/description sans toucher aux images, vous pouvez omettre les champs image et gallery.

### Réponse réussie (200)

Identique à la réponse de création (voir section 1).

### Erreurs possibles

#### 401 - Non authentifié

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### 403 - Non propriétaire

```json
{
  "statusCode": 403,
  "message": "Forbidden - Not the property owner",
  "error": "Forbidden"
}
```

#### 404 - Propriété non trouvée

```json
{
  "statusCode": 404,
  "message": "Property not found",
  "error": "Not Found"
}
```

---

## 5. Supprimer une Propriété

### Endpoint

```
DELETE /properties/:id
```

### Authentification requise

```
Authorization: Bearer {JWT_TOKEN}
```

**Important** : Seul le propriétaire de l'annonce peut la supprimer.

### Description

Supprime une propriété et tous ses fichiers associés (image principale et galerie).

### Paramètres

```
id: string (UUID de la propriété)
```

### Exemple de requête

```bash
curl -X DELETE http://localhost:3000/properties/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer {JWT_TOKEN}"
```

### Réponse réussie (200)

```json
{
  "id": "uuid-string",
  "price": "250.00",
  "name": "Modern Apartment in Paris",
  ...
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

#### 403 - Non propriétaire

```json
{
  "statusCode": 403,
  "message": "Forbidden - Not the property owner",
  "error": "Forbidden"
}
```

#### 404 - Propriété non trouvée

```json
{
  "statusCode": 404,
  "message": "Property not found",
  "error": "Not Found"
}
```

---

## 6. Flux complet d'une Annonce

### Diagramme

```
┌─────────────────────────────────────────────────────┐
│ 1. AUTHENTIFICATION (Voir AUTH_DOCUMENTATION.md)   │
│    - POST /auth/register                           │
│    - POST /auth/login → Obtenir JWT_TOKEN         │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ 2. CRÉER UNE PROPRIÉTÉ                             │
│    - POST /properties                              │
│    - Header: Authorization: Bearer {JWT_TOKEN}    │
│    - Body: Données + Images (optionnel)           │
│    → Reçoit: Property object + gallery            │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ 3. CONSULTER LES PROPRIÉTÉS                        │
│    - GET /properties (toutes les propriétés)       │
│    - GET /properties/:id (détails + owner)        │
│    → Non authentifié (accès public)               │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ 4. MODIFIER LA PROPRIÉTÉ (si propriétaire)        │
│    - PATCH /properties/:id                         │
│    - Header: Authorization: Bearer {JWT_TOKEN}    │
│    - Body: Données partielles + Images (optionnel)│
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ 5. SUPPRIMER LA PROPRIÉTÉ (si propriétaire)       │
│    - DELETE /properties/:id                        │
│    - Header: Authorization: Bearer {JWT_TOKEN}    │
│    → Supprime aussi tous les fichiers             │
└─────────────────────────────────────────────────────┘
```

---

## 7. Architecture et Flux de Code

### Architecture globale

```
PropertiesController
    ├── @Post() → PropertiesService.create()
    │   ├── Upload fichiers (image + gallery)
    │   └── Prisma: create Property + Gallery items
    │
    ├── @Get() → PropertiesService.findAll()
    │   └── Récupère toutes les propriétés + URLs
    │
    ├── @Get(':id') → PropertiesService.findOne()
    │   ├── Récupère propriété avec owner et gallery
    │   └── Génère URLs complètes pour images
    │
    ├── @Patch(':id') → PropertiesService.update()
    │   ├── Upload nouveaux fichiers (optionnel)
    │   ├── Supprime anciens fichiers si remplacés
    │   └── Update Property + Gallery
    │
    └── @Delete(':id') → PropertiesService.remove()
        ├── Récupère propriété avec gallery
        ├── Supprime en base de données
        └── Supprime tous les fichiers associés
```

### Détail des services

#### PropertiesService.create() (properties.service.ts:16-49)

1. Traite l'image principale (fichier ou URL fournie)
2. Traite la galerie d'images (crée des records liés)
3. Assigne le propriétaire (userId du token)
4. Crée l'enregistrement en base de données
5. Supprime les fichiers en cas d'erreur

#### PropertiesService.findAll() (properties.service.ts:51-58)

1. Récupère toutes les propriétés
2. Génère les URLs complètes pour les images principales
3. Retourne la liste

#### PropertiesService.findOne() (properties.service.ts:60-90)

1. Récupère la propriété avec relations (owner + gallery)
2. Génère les URLs complètes pour les images
3. Inclut les infos du propriétaire avec son avatar

#### PropertiesService.update() (properties.service.ts:92-150)

1. Récupère la propriété actuelle
2. Traite les nouveaux fichiers (optionnel)
3. Met à jour la base de données
4. Supprime les anciens fichiers si remplacés
5. Récupère les nouveaux fichiers en cas d'erreur

#### PropertiesService.remove() (properties.service.ts:152-170)

1. Récupère la propriété avec gallery
2. Supprime de la base de données
3. Supprime tous les fichiers associés du disque

---

## 8. Structure de la Base de Données

### Modèle Property (Prisma)

```prisma
model Property {
  id          String    @id @default(cuid())
  price       String
  name        String
  location    String
  category    String
  description String
  bedrooms    Int
  bathrooms   Int
  garage      Boolean
  wifi        Boolean
  kitchen     Boolean
  image       String?
  ownerId     String
  owner       User      @relation(fields: [ownerId], references: [id])
  gallery     Gallery[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Gallery {
  id         String   @id @default(cuid())
  url        String
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
}
```

---

## 9. Gestion des Fichiers

### Upload

- **Destination** : `./uploads/properties`
- **Noms** : Format `{fieldname}-{timestamp}-{random}.{ext}`
- **Image principale** : 1 fichier (OBLIGATOIRE)
- **Galerie** : Exactement 5 fichiers (OBLIGATOIRE)
- **Types acceptés** : Images (jpeg, jpg, png, gif, webp)

### Stockage sur disque

```
uploads/
└── properties/
    ├── image-1708162200000-123456789.jpg (image principale)
    ├── gallery-1708162200001-987654321.jpg
    ├── gallery-1708162200002-456789123.jpg
    ...
```

### Suppression

- Automatique en cas d'erreur lors de la création
- Suppression des anciens fichiers lors d'une mise à jour
- Suppression de tous les fichiers lors de la suppression de la propriété

---

## 10. Validation des Données

### Règles appliquées

```typescript
@IsString()
price: string;  // Non vide

@IsString()
name: string;   // Non vide

@IsString()
location: string;  // Non vide

@IsString()
category: string;  // Non vide

@IsString()
description: string;  // Non vide

@IsNumber()
bedrooms: number;  // Entier positif

@IsNumber()
bathrooms: number;  // Entier positif

@IsBoolean()
garage: boolean;  // true ou false

@IsBoolean()
wifi: boolean;    // true ou false

@IsBoolean()
kitchen: boolean; // true ou false

@IsOptional()
@IsString()
image?: string;   // Optionnel

@IsOptional()
@IsString()
ownerId: string;  // Optionnel (défini automatiquement)
```

---

## 11. Test avec Bruno/Postman

### Collection d'exemples

Voici les fichiers de test Bruno disponibles :

- `bruno/airbnb/Create Property.bru` - Créer une propriété
- `bruno/airbnb/Get All Properties.bru` - Lister toutes les propriétés
- `bruno/airbnb/Get Property By ID.bru` - Détails d'une propriété
- `bruno/airbnb/Update Property.bru` - Modifier une propriété
- `bruno/airbnb/Delete Property.bru` - Supprimer une propriété

### Exemple de test Bruno

```
POST http://localhost:3000/properties
Authorization: Bearer {JWT_TOKEN}
Content-Type: multipart/form-data

Champs:
- price: 250.00
- name: Modern Apartment
- location: 75001 Paris
- category: Apartment
- description: Spacious apartment
- bedrooms: 3
- bathrooms: 2
- garage: true
- wifi: true
- kitchen: true
- image: (file)
- gallery: (files)

Tests:
- Status code 201
- Réponse contient un id
- name matches "Modern Apartment"
```

---

## 12. Troubleshooting

| Problème                        | Cause                       | Solution                                          |
| ------------------------------- | --------------------------- | ------------------------------------------------- |
| 401 Unauthorized                | Token manquant ou expiré    | Vérifier le header Authorization                  |
| 403 Forbidden                   | Pas propriétaire            | Seuls les propriétaires peuvent modifier          |
| Image principale manquante      | Fichier image non fourni    | Fournir obligatoirement une image principale      |
| Galerie incomplète              | Moins de 5 images fournies  | Fournir EXACTEMENT 5 images pour la galerie       |
| Galerie trop nombreuse          | Plus de 5 images fournies   | Fournir EXACTEMENT 5 images (pas plus)            |
| Fichiers non sauvegardés        | Permissions dossier uploads | Créer le dossier et vérifier les droits           |
| Images non affichées            | URLs incorrectes            | Vérifier le chemin généré par UrlGeneratorService |
| Erreur validation               | Champs manquants/invalides  | Vérifier le type et la présence des champs requis |
| Fichiers orphelins après erreur | Upload partiel échoué       | Les fichiers sont supprimés automatiquement       |

---

## 13. Fichiers impliqués

### Propriétés

- `src/resources/properties/properties.controller.ts` - Endpoints
- `src/resources/properties/properties.service.ts` - Logique métier
- `src/resources/properties/properties.module.ts` - Configuration
- `src/resources/properties/dto/create-property.dto.ts` - Validation création
- `src/resources/properties/dto/update-property.dto.ts` - Validation modification
- `src/resources/properties/entities/property.entity.ts` - Entité

### Services utilitaires

- `src/services/prisma.service.ts` - Accès base de données
- `src/services/files.service.ts` - Gestion des fichiers
- `src/services/url-generator.service.ts` - Génération des URLs

### Configuration

- `prisma/schema.prisma` - Schéma base de données
- `src/config/multer.config.ts` - Configuration upload
- `src/main.ts` - Configuration globale

---

## 14. Variables d'environnement

Les configurations sont dans : `src/main.ts`, `properties.controller.ts` et `prisma/schema.prisma`

```
DATABASE_URL     - URL de connexion à la base de données
NODE_ENV         - Environnement (development/production)
```

---

## 15. Considérations de Sécurité

### Implémentées

✅ **Authentification JWT** : Seuls les utilisateurs associés peuvent créer/modifier/supprimer
✅ **Validation des données** : class-validator
✅ **Gestion des fichiers sécurisée** : Noms uniques, suppression en cas d'erreur
✅ **Cascades de suppression** : Galerie supprimée avec la propriété
✅ **Vérification de propriété** : Seul le propriétaire peut modifier/supprimer

### Recommandations supplémentaires

- Ajouter une limite de taille de fichier
- Valider les types MIME des fichiers uploadés
- Implémenter des rate limits sur la création de propriétés
- Ajouter une validation anti-spam
- Scanner les images pour malveillance
- Implémenter le soft delete pour les propriétés
- Ajouter des logs d'audit pour les modifications
- Chiffrer les chemins des images sensibles
