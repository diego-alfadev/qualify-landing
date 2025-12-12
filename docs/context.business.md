
# Qualify Inmo – Contexto de negocio

## 1. Resumen del producto

Qualify Inmo es un SaaS B2B para **agencias inmobiliarias** que automatiza la
**precualificación de leads de alquiler** (inquilinos potenciales).

- El **cliente de Qualify** = la agencia inmobiliaria.
- El **lead** = inquilino potencial interesado en un inmueble concreto.
- El **inmueble** = piso/local que la agencia anuncia y quiere alquilar.

Qualify ofrece:

- Un motor de precualificación (backend de Antonio).
- Canales de entrada de leads:
  - Formularios en la web/CRM de la agencia.
  - Llamadas perdidas sobre un número dedicado.
  - WhatsApp con asistente híbrido (reglas + IA).
- A futuro, un panel/dashboards para la agencia (fuera del alcance de esta landing).

La **landing de Qualify** NO es origen de leads de inquilinos.  
Su función es **vender suscripciones a agencias inmobiliarias** y darles de alta
como clientes de Qualify.

---

## 2. Actores y responsabilidades

- **Qualify Inmo (plataforma)**  
  Propietaria del SaaS y de la landing. Gestiona Stripe y relaciona las suscripciones
  con los clientes en el backend de Antonio.

- **Backend de Antonio**  
  Servicio Python que:
  - Recibe leads de inquilinos a través de APIs.
  - Mantiene lógica de negocio y scoring de precualificación.
  - Gestiona planes, descuentos y clientes (API para la landing).

- **Agencias inmobiliarias (clientes de pago)**  
  Contratan un plan de Qualify. Integran:
  - Su web o CRM con la API de creación de solicitud de cuestionario.
  - El número de WhatsApp / llamadas perdidas proporcionado por Qualify.

- **Leads (inquilinos potenciales)**  
  Personas que se interesan por un inmueble y contestan cuestionarios de
  precualificación.

---

## 3. Módulo de precualificación de leads (estado actual)

### 3.1 Alta de inmueble (por email)

Para que el sistema conozca un inmueble y pueda hablar de él:

- Se envía un email de **"Alta de Inmueble"** a Antonio con:
  - Referencia del inmueble.
  - Agente responsable.
  - Dirección (texto tipo anuncio).
  - Descripción larga (características, equipamiento, restricciones, etc.).

Este flujo no pasa por la landing de Qualify. Es parte de la operativa entre
agencias (p.ej. Nuevo Milenio) y el backend de Antonio.

### 3.2 API de creación de solicitud de cuestionario (leads)

Endpoint actual (ejemplo de agencia Nuevo Milenio):

- `POST /api/crear_solicitud` sobre un host tipo:
  `https://app-nuevo-milenio-precualif-<hash>.herokuapp.com`

Autenticación:

- Header: `Authorization: Bearer {AGENCY_TOKEN}`
- Token único por agencia, renovable periódicamente.

Body JSON:

```jsonc
{
  "canal": "web",                // origen del lead (web, crm, etc.)
  "email": "lead@ejemplo.com",   // formato email válido
  "nombre": "Nombre Apellido",   // 2–100 caracteres
  "referencia_inmueble": "1234", // debe existir y estar activa
  "mensaje": "texto opcional"    // máx. 500 caracteres
}
```

Esta API se integra en:

- Formularios de la web de la agencia.
- Formularios de su CRM.
- Potencialmente otros canales propios de la agencia.

### 3.3 Asistente WhatsApp y llamadas perdidas

Integración ya desarrollada por Antonio:

- Nuevo número para la agencia (llamadas + WhatsApp).
- Twilio + ngrok como piezas técnicas.

Comportamiento:

- **Llamadas perdidas:**
  - Si el número llamante es móvil → se cuelga y se envía el cuestionario por WhatsApp.
  - Si es fijo → mensaje de voz indicando que contacte por otros canales.

- **WhatsApp (chat):**
  - Asistente híbrido (reglas + IA) que:
    1. Responde preguntas sobre inmuebles disponibles y sus características.
    2. Detecta referencias de inmuebles o interés en uno concreto.
    3. Pide autorización RGPD antes de enviar cuestionario.

- Existe una **API interna** dentro de la app para este asistente que:
  - Se conecta con Twilio/WhatsApp.
  - A futuro podría invocarse desde otros canales.
  - De momento NO la integra la agencia directamente.

---

## 4. Módulo de planes y suscripciones (nuevo)

Este módulo da servicio a la **landing comercial** de Qualify Inmo.

### 4.1 Planes

El backend de Antonio expondrá una API para que la landing pueda **listar planes**.

Datos de un plan (conceptuales):

- `nombre` – nombre comercial del plan.
- `descripcion` – resumen para la landing.
- `precio` – importe base.
- `duracion` – mensual, trimestral, anual, etc.
- `detalles` – servicios incluidos, límites de uso, etc. (a definir).
- `plan_pago` – esquema de cobro (mensual, trimestral, etc.).

La landing usará esta información para los componentes de **pricing** y para
preconfigurar el plan antes de enviar al cliente a Stripe.

### 4.2 Descuentos y promociones

Posible modelo de descuento/promoción asociado a planes:

- `codigo` – identificador del cupón.
- `descripcion` – texto explicativo.
- `tipo` – `importe_fijo` o `porcentaje`.
- `valor` – importe o % de descuento.
- `fecha_inicio` – desde cuándo se aplica.
- `fecha_fin` – hasta cuándo se aplica.
- `uso_maximo` – nº máximo de usos (por campaña).
- `acumulable` – si se puede combinar con otras promociones.

La landing puede:

- Validar un código de descuento.
- Mostrar el ahorro asociado.
- Enviar el código al backend junto con el alta del cliente.

---

## 5. Alta de clientes de Qualify (post-pago)

Una vez una agencia **compra un plan** a través de la landing + Stripe:

- La landing debe **enviar la información del cliente** al backend de Antonio.
- Esta API es distinta de la API de leads `/api/crear_solicitud`.

Datos necesarios para el alta de cliente:

- Identificación del cliente (agencia):
  - Nombre + apellidos o razón social.
  - Tipo y nº de documento: CIF, NIF, NIE u otros.

- Dirección de facturación:
  - Tipo de vía.
  - Nombre de vía.
  - Número.
  - Código postal.
  - Población.
  - Provincia.
  - Campo libre `otra_informacion`.

- Contacto:
  - Email.
  - Teléfono.

- Información comercial:
  - `plan_seleccionado`.
  - `descuento_aplicado` (si lo hay).

- Información de pago:
  - Identificador de pago / suscripción en la pasarela (Stripe).

La landing realizará:

1. **Pre-alta (borrador)** antes de Stripe con datos mínimos.
2. **Alta definitiva** tras el pago, añadiendo:
   - Plan final aplicado.
   - Descuento.
   - IDs de Stripe.

---

## 6. Alcance de la landing de Qualify

La landing (Astro + Tailwind + React islands) se encargará de:

1. Presentar el producto (páginas de servicios, home, etc.).
2. Mostrar planes de precios (consumiendo API de planes/descuentos).
3. Gestionar el flujo de alta de una agencia:
   - Formulario de pre-alta con poca fricción.
   - Envío de borrador de cliente al backend (pre-alta).
   - Redirección a Stripe Checkout.
   - Recepción del retorno de Stripe.
   - Envío de alta definitiva de cliente al backend con datos del pago.

La landing **no gestiona leads de inquilinos** ni cuestionarios de precualificación
directamente; eso pertenece al backend y sus canales integrados.
