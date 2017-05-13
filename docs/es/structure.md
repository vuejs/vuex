# Estructura en aplicaciones

Vuex no impone restricciones a la hora de estructurar tu código sino que se acoge a un conjunto de principios de alto nivel:

1. El estado a nivel de Aplicación se encuentra centralizado en el almacén.

2. La única manera de modificar el estado es por medio del uso de **mutaciones** commiteadas, las cuales son transaciones síncronas.

3. Toda lógica asíncrona debe estar encapsulada en, o ser compuesta con, **acciones**.

Siempre y cuando sigas estas reglas, la estructura que le des a tu proyecto es cosa tuya. Si el archivo en el que defines tu almacén se vuelve demasiado grande puedes empezar por separar acciones, mutaciones y getters en archivos separados.

En applicaciones complejas o de gran escala, es muy probable que hagas uso de módulos. Aquí dejamos un ejemplo de como estructurar un proyecto:

``` bash
├── index.html
├── main.js
├── api
│   └── ... # Abstracciones para generar llamadas a APIs
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # Donde unimos nuestro módulos y exportamos el almacén
    ├── actions.js        # Acciones de raiz
    ├── mutations.js      # Mutaciones de raiz
    └── modules
        ├── cart.js       # Módulo Cart
        └── products.js   # Módulo productos
```

Como referencia, puedes echarle un vistazo al [ejemplo 'Shopping Cart'](https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart).
