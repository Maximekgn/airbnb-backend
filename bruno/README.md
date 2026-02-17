# Collection Bruno - Airbnb Backend API

Cette collection contient tous les endpoints de l'API Airbnb Backend, organisés par ressources.

## Installation de Bruno

Bruno est un client API open-source et rapide. Pour l'installer :

- Téléchargez Bruno depuis [https://www.usebruno.com/](https://www.usebruno.com/)
- Ou installez via package manager :

  ```bash
  # macOS
  brew install bruno

  # Windows (via Chocolatey)
  choco install bruno
  ```

## Utilisation

### Ouvrir la collection

1. Lancez Bruno
2. Cliquez sur "Open Collection"
3. Naviguez vers le dossier `bruno/airbnb`
4. La collection sera chargée automatiquement

### Structure de la collection

```
bruno/airbnb/
├── environments/
│   └── Local.bru          # Variables d'environnement locales
├── Auth/
│   ├── Register.bru       # Inscription d'un nouvel utilisateur
│   └── Login.bru          # Connexion et récupération du token JWT
├── Categories/
│   ├── Get All Categories.bru
│   ├── Get Category By ID.bru
│   ├── Create Category.bru      # ADMIN seulement
│   ├── Update Category.bru      # ADMIN seulement
│   └── Delete Category.bru      # ADMIN seulement
└── Properties/
    ├── Get All Properties.bru
    ├── Get Property By ID.bru
    ├── Create Property.bru
    ├── Update Property.bru
    └── Delete Property.bru
```

## Configuration

### Variables d'environnement

Le fichier `environments/Local.bru` contient :

```
baseUrl: http://localhost:3000
token: (sera rempli automatiquement après login)
```

Modifiez `baseUrl` si votre API tourne sur un autre port.

### Authentification automatique

La requête **Login** sauvegarde automatiquement le token JWT dans la variable `token`. Les autres requêtes authentifiées l'utiliseront automatiquement.

## Workflow recommandé

### 1. Premier démarrage

```
1. Register → Créer un compte utilisateur
2. Login → Obtenir le token JWT (sauvegardé automatiquement)
3. Get All Categories → Voir les catégories disponibles
```

### 2. Créer une propriété

```
1. Login (si pas déjà fait)
2. Get All Categories → Noter un categoryId
3. Create Property → Créer une annonce
   - Remplir tous les champs requis
   - Décommenter les lignes ~image et ~gallery pour upload de fichiers
   - Fournir 1 image principale + 5 images de galerie
```

### 3. Gestion des catégories (ADMIN uniquement)

⚠️ **Nécessite un compte ADMIN**

Pour créer un admin, connectez-vous à la base de données et exécutez :

```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'votre.email@example.com';
```

Ensuite :

```
1. Login avec le compte ADMIN
2. Create Category → Créer une nouvelle catégorie
3. Update Category → Modifier une catégorie
4. Delete Category → Supprimer une catégorie (si aucune propriété associée)
```

## Upload de fichiers

Pour les requêtes avec upload (Create/Update Property, Register avec avatar) :

1. Les champs de fichiers sont commentés avec `~` par défaut
2. Décommentez la ligne en retirant le `~`
3. Cliquez sur le champ pour sélectionner un fichier

Exemple :

```
~image:          ← Commenté, pas d'upload
image: [file]    ← Décommenté, sélectionnez un fichier
```

## Tests automatiques

Les requêtes incluent des scripts post-response pour :

- Sauvegarder automatiquement le token JWT après login
- Valider les codes de statut HTTP
- Vérifier la structure des réponses

## Documentation complète

Pour plus de détails sur chaque endpoint :

- **Authentification** : Voir `doc/AUTH_DOCUMENTATION.md`
- **Propriétés** : Voir `doc/PROPERTY_DOCUMENTATION.md`
- **Catégories** : Voir `doc/CATEGORY_DOCUMENTATION.md`

## Troubleshooting

### Le token n'est pas sauvegardé

Si le token JWT n'est pas sauvegardé automatiquement après login :

1. Vérifiez que la requête Login retourne bien un `access_token`
2. Le script post-response devrait l'extraire automatiquement
3. Vous pouvez aussi copier/coller le token manuellement dans `Environment > Local > token`

### Erreur 401 Unauthorized

- Vérifiez que vous êtes bien connecté (Login)
- Le token peut avoir expiré, reconnectez-vous
- Vérifiez que le header Authorization est bien présent dans la requête

### Erreur 403 Forbidden

- Vous essayez d'accéder à un endpoint ADMIN avec un compte USER
- Ou vous essayez de modifier/supprimer une propriété qui ne vous appartient pas

### Upload de fichiers ne fonctionne pas

- Vérifiez que vous avez bien décommenté les lignes de fichiers (`~image` → `image`)
- Pour Create Property, vous DEVEZ fournir exactement 5 images de galerie
- Les types de fichiers acceptés : jpg, jpeg, png, gif, webp

## Support

Pour toute question ou problème :

- Consultez la documentation dans le dossier `doc/`
- Vérifiez les logs du serveur backend
- Vérifiez la console de Bruno pour les erreurs détaillées
