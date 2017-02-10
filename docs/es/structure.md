# Estructura de la aplicación

Vuex no restringe de ninguna manera la forma en la que estructuras tu código. Más bien, impone una serie de principios de alto nivel:

1. El estado a nivel de aplicación está centralizado en el _store_.

2. La única manera de modificar el estado es emitiendo **mutations**, las cuales son transacciones síncronas.

3. La lógica asíncrona debe ser encapsulada en y compuesta con **acciones**.

Mientras sigas estas reglas, es tu decisión como estructurar tu proyecto. Si tu archivo _store_ se vuelve muy grande, empieza a dividir las acciones, mutaciones y _getters_ en archivos separados.

Para cualquier aplicación de nivel medio/alto, seguramente necesitemos utilizar módulos. Aquí tienes un ejemplo de una estructura para tu aplicación:

``` bash
├── index.html
├── main.js
├── api
│   └── ... # abstracciones para realizar peticiones a la API
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # donde ensamblamos los módulos y exportamos el _store_
    ├── actions.js        # acciones principales
    ├── mutations.js      # mutaciones principales
    └── modules
        ├── cart.js       # modulo "cart"
        └── products.js   # modulo "products"
```

Como referencia, tienes el ejemplo de un [carrito de compras](https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart).
