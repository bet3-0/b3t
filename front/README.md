## Routing 

Le routing se fait dans le fichier ``src/main.js`` 

```js
import ExamplePage from 'exempleFile'

const router = new VueRouter({
  mode: 'history',
  routes: [
        {
            path: '/exemple',
            component: ExamplePage
        },
        {
            path: '/exemple/:id',
            // route avec des paramètre d'url
            // dans le composant, accessible via 
            // this.$route.query.test
            component: ExamplePage
        }
    ]
})
```

Plus d'information sur [la documentation](https://router.vuejs.org/guide/essentials/dynamic-matching.html#reacting-to-params-changes)

## Arborescence 

### Assets
Dans le dossier assets, les images en dur sont stockées dedans et peuvent
 être appelées avec :
````html
<img src="@/assets/img/clear.gif">
````
Dans cet exemple, l'image se trouve dans le dossier src/assets/img/clear.gif

### Component
Les différents composant seront stockés dans le dossier dédié dans un sous-dossier 
``includes/``

A la racine du dossier ``component``, il y a les differents composants qui contiennent 
les pages complète.


## Liste des commandes
```
# installe les dépendances
npm install
# lance le serveur de développement
npm run serve
# construit l'application pour la production
npm run build
# lance le linter pour verfier la qualité du code
npm run lint
```
