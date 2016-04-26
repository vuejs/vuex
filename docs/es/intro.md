## Qué es Vuex?

Vuex es una arquitectura para el desarrollo de aplicaciones en Vue.js con manejo de estado centralizado. Está inspirado en [Flux](https://facebook.github.io/flux/) y [Redux](https://github.com/rackt/redux), pero con conceptos simplificados e implementación diseñada específicamente para tomar ventaja del sistema reactivo de Vue.js.

## Por qué lo necesito?

Si tu app es simple, quizás no necesites Vuex. No lo apliques prematuramente. Pero si estás construyendo un SPA de medio-grandes dimensiones, probablemente te hayas encontrado en situaciones que te han hecho pensar en cómo mejor estructuras las cosas fuera de tu componente Vue. Aquí es donde Vuex entra en juego.

Cuando usamos Vue.js a solas, a menudo tendemos a almacenar el estado "dentro" de nuestros componentes. Lo que significa, cada componente guarda una pieza del estado de nuestra aplicación, y como resultado el estado es dispersado por todos lados. Sin embargo, a veces una parte del estado necesita ser compartido por múltiples componentes. Una práctica común es dejar que un componente "envíe" algún estado a otros componentes usando el sistema de eventos personalizado. El problema con este patrón es que el flujo de eventos dentro de grandes ramas de componentes puede volverse complejo rápidamente, y a menudo es difícil encontrar la causa cuando algo va mal.

Para tratar mejor estados compartidos en grandes aplicaciones, necesitamos diferenciar entre **estado local del componente** y **estado a nivel de aplicación**. El estado de aplicación no pertenece a un componente específico, pero nuestros componentes pueden observarlo para actualizaciones de DOM reactivos. Centralizando su manejo en un único sitio, no necesitamos ir pasando eventos, porque todo lo que afecta a más de un componente debería pertenecer allí. En adición esto nos permite grabar e inspeccionar cada mutación para un entendimiento más fácil de los cambios de estado, e incluso poner en práctica cosas avanzadas como la depuración con viaje en el tiempo.

Vuex también pone en vigor algunas opiniones sobre cómo dividir la lógica de la administración del estado en diferentes lugares, pero aun así permite suficiente flexibilidad para la estructura del código actual.
