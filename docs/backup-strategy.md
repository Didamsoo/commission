# Stratégie de sauvegarde - Base de données

## Sauvegardes automatiques (Supabase)

### Plan Free
- Sauvegardes quotidiennes automatiques
- Rétention de 7 jours
- Restauration via le dashboard Supabase

### Plan Pro (recommandé pour la production)
- **PITR** (Point-in-Time Recovery) : restauration à n'importe quel moment des 7 derniers jours
- Sauvegardes quotidiennes avec rétention de 30 jours
- Restauration granulaire

## Export manuel (pg_dump)

Pour créer une sauvegarde manuelle de la base de données :

```bash
# Prérequis : PostgreSQL client installé
# brew install postgresql (macOS)

# Récupérer l'URL de connexion depuis Supabase Dashboard > Settings > Database

# Export complet
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  --format=custom \
  --no-owner \
  --no-privileges \
  -f backup_$(date +%Y%m%d_%H%M%S).dump

# Export SQL (lisible)
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  --no-owner \
  --no-privileges \
  -f backup_$(date +%Y%m%d_%H%M%S).sql
```

## Restauration

```bash
# Depuis un fichier .dump
pg_restore --clean --no-owner --no-privileges \
  -d "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  backup_XXXXXXXX_XXXXXX.dump

# Depuis un fichier .sql
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  < backup_XXXXXXXX_XXXXXX.sql
```

## Recommandations

1. **Automatiser les exports** : configurer un cron job hebdomadaire pour `pg_dump`
2. **Stocker les sauvegardes hors site** : S3, Google Cloud Storage, ou similaire
3. **Tester les restaurations** régulièrement sur un environnement de staging
4. **Migrer vers le plan Pro** dès la mise en production pour bénéficier du PITR
