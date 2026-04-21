<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


# Validation Questions — be-two

## Question 1
**¿Son duplicados?** No para MongoDB, pero sí para tu aplicación. MongoDB por defecto distingue entre mayúsculas y minúsculas (*case-sensitive*), por lo que "McQueen" y "mcqueen" son strings distintos en la base de datos.

**Línea en `cars.service.ts`:** `createCarDto.nombre = createCarDto.nombre.toLocaleLowerCase();` (en el método `create`).
**Función:** Esta línea normaliza el nombre a minúsculas antes de la inserción.
**Consecuencia:** Gracias a esta línea, el constraint `unique` sí se vuelve efectivo contra variaciones de mayúsculas. Si intentas crear "McQueen" y luego "mcqueen", la segunda fallará con un error 11000 porque el servicio intenta guardar ambas como "mcqueen".

---

## Question 2
**¿Por qué existen ambas?** Es una estrategia de "defensa en profundidad". El Pipe filtra en la entrada (Controller) para dar respuesta rápida, mientras que el Service asegura su propia integridad independientemente de quién lo invoque.

**Escenarios:**
- **`findOne` sin check:** Si recibe `"abc"`, Mongoose lanzará una excepción interna de casteo al intentar buscar. El cliente recibiría un **500 Internal Server Error**.
- **`remove` sin Pipe:** El ID llegaría al Service y fallaría en `deleteOne`. El cliente también recibiría un **500**.

**Diferencia:** Con las validaciones actuales, el cliente recibe un **400 Bad Request**. La diferencia es semántica: el 400 indica un error del cliente (input inválido), mientras que el 500 indica que el servidor "se rompió" por no saber manejar el dato.

---

## Question 3
**¿Por qué `create` necesita `try/catch`?** Porque `create` puede fallar por restricciones de integridad de la base de datos (como el índice único). `findAll` es una operación de lectura que, si no hay datos, simplemente devuelve un array vacío, lo cual no es un error de ejecución.
**Error específico:** `create` puede lanzar el error **11000 (Duplicate Key)**. `findAll` nunca lo lanzaría.
**Sin `try/catch`:** Si ocurre el error 11000, NestJS devolvería un **500 Internal Server Error** porque no hay un manejador que transforme ese error de base de datos en una excepción HTTP (como el `BadRequestException` que pusimos).

---

## Question 4
**Número de queries:** Realiza **1 sola consulta** (el `findOne` previo al update).
**Diferencia API vs DB:** Sí puede existir.
**Escenario concreto:** Si tienes decoradores en el Schema que modifican datos al guardar (como un `updatedAt` automático de Mongoose o un hook de `pre-save`), el objeto retornado por el *spread operator* `{ ...car.toJSON(), ...updateCarDto }` mostrará los datos viejos, mientras que en la base de datos el valor real será distinto.

---

## Question 5
**Problema de `forRoot`:** Se evalúa en el momento en que se carga el archivo. Si las variables de entorno aún no han sido procesadas por el sistema (asincronía), `process.env.MONGODB_URL` será `undefined`.
**Momento de evaluación:** Durante la fase de inicialización de módulos de Node.js.
**Solución `forRootAsync`:** Permite usar una función de fábrica (`useFactory`) que se ejecuta solo cuando el sistema de configuración de Nest ya está listo y las variables de entorno están cargadas.

---

## Question 6
**Sin `CarsModule` en `AppModule`:** La aplicación arranca, pero las rutas de `/cars` devolverán **404 Not Found**. El error se nota en la primera petición, aunque Nest no mostrará error al iniciar porque simplemente "no conoce" ese módulo.
**Sin `forFeature` en `CarsModule`:** Ocurre un error de inyección de dependencias en el **startup**. El servidor no encenderá y dirá: `Nest can't resolve dependencies of the CarsService...`.
**Archivo para diagnosticar:** El `cars.module.ts`, verificando que el modelo esté registrado en el array de `imports`.

---

## Question 7
**Ventaja:** Rendimiento. Al no llamar a `findOne`, eliminamos un viaje de ida y vuelta a la base de datos.
**Condición `deletedCount === 0`:** Ocurre cuando el ID enviado tiene un formato de ObjectId válido (pasa el Pipe), pero **no existe** ningún documento con ese ID exacto en la colección de la base de datos.

---

## Question 8
**Ventaja perdida:** La **Separación de Concernimientos** (*Separation of Concerns*). El servicio se ensucia con lógica de validación de transporte que no le corresponde.
**Momento de ejecución:** El Pipe se ejecuta en la capa de **Binding**, antes de entrar al Controller. La validación en el servicio ocurre mucho después, cuando la lógica de negocio ya se está ejecutando.
**Sin `@Injectable()`:** NestJS lanzará un error al intentar instanciar la clase si se pasa como referencia en el decorador `@Param`, ya que no podrá manejarla dentro de su contenedor de inversión de control.

---

## Question 9
**Reorden de Pipes:** **No cambia el comportamiento**. Los Global Pipes se registran en el núcleo de la aplicación y se aplican a todas las peticiones entrantes sin importar el orden de declaración respecto al prefijo.

**`enableCors` después de `listen`:** **Sí afecta negativamente**. `app.listen()` es una operación bloqueante que inicia el servidor. Si el CORS se registra después, las peticiones que lleguen en el microsegundo inicial podrían ser procesadas sin las políticas de seguridad necesarias. Debe declararse siempre **antes** de `listen`.