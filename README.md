# Orbite

Un jeu d'adresse à une touche : ton vaisseau tourne tout seul autour d'un soleil, sur l'une de trois orbites. Tu choisis seulement l'orbite, pour éviter les astéroïdes, ramasser les cristaux et fuir les éruptions du soleil.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Espace**, **clic** ou **↑** : passer à l'orbite extérieure suivante (depuis la plus éloignée, on revient à la plus proche du soleil).
- **↓** ou **clic droit** : passer à l'orbite intérieure.
- **P** : pause.
- **Espace** ou **clic** : partir, puis rejouer après une collision.

## Les dangers

- **Astéroïdes** : de trois tailles, ils entrent par un bord de l'écran et traversent en visant près du soleil. Ils arrivent de plus en plus souvent. Un seul contact et la partie est finie.
- **Éruptions** : toutes les 15 à 25 secondes, le soleil clignote et l'orbite intérieure rougit pendant 2 secondes ; ensuite elle brûle pendant 2 secondes. Il faut l'avoir quittée à temps.
- La vitesse du vaisseau augmente avec le temps, jusqu'à plus du double de celle du départ.

## Cristaux et score

Trois cristaux sont toujours répartis sur les orbites ; chaque cristal ramassé est remplacé par un autre. Les cristaux pris à la suite font monter le multiplicateur, jusqu'à ×5 ; il retombe à ×1 toutes les 10 secondes.

Le score vaut 2 points par seconde de survie, plus 10 points par cristal multipliés par le multiplicateur du moment.

## Statistiques

Meilleur score, parties jouées, cristaux ramassés au total et éruptions évitées.

## Données et synchronisation

Ton record et tes statistiques sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Orbite → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
