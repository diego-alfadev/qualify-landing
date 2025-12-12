
# Qualify Inmo – Contexto técnico (landing + onboarding)

## 1. Stack y principios

- Framework: **Astro**
- UI: **TailwindCSS**
- Interactividad: **React islands** donde haga falta
- Hosting: IONOS (custom domain)
- Pagos: **Stripe Checkout**
- Backend externo: servicio Python de Antonio (API REST)

Principios:

- Landing ligera, rápida y SEO-friendly.
- Pocas dependencias.
- Código orientado a componentes reutilizables.
- Flujos de alta con **baja fricción** y UX clara.

---

## 2. Rutas previstas (landing)

- `/` – Home
- `/servicios` – Página de servicios de Qualify Inmo
- `/precios` – Página base de precios (o componente principal de pricing)
- `/signup` – Flujo de alta (formulario)
- `/success` – Página de éxito post-Stripe
- `/cancel` – Página de cancelación post-Stripe

*(Los nombres pueden ajustarse, pero mantenerlos consistentes en todo el código.)*

---

## 3. Flujo de alta (resumen técnico)

1. Usuario elige un plan (desde cualquier parte de la landing).
2. Se abre un **componente de pricing/modal** para confirmar el plan.
3. Se redirige al formulario `/signup` con el plan preseleccionado.
4. El formulario captura datos mínimos (pre-alta).
5. La landing hace `POST /api/pre-signup` (endpoint propio de Astro) que:
   - Valida el payload.
   - Llama al backend de Antonio (endpoint de borrador de cliente, por definir).
   - Devuelve un `draftClientId`.
6. La landing crea una sesión de **Stripe Checkout** con:
   - Precio (priceId) del plan.
   - `client_reference_id` o metadata con `draftClientId`.
7. Stripe gestiona el pago.
8. En `/success`, la landing:
   - Obtiene los IDs de Stripe (sesión, suscripción, etc.).
   - Hace `POST /api/complete-signup` para:
     - Llamar al backend de Antonio con:
       - Datos del borrador.
       - Datos de Stripe.
       - Plan y descuento final.

*(Los nombres exactos de endpoints del backend de Antonio se definirán con él.)*

---

## 4. Integración con APIs de Antonio (nivel landing)

### 4.1 Planes y descuentos

- Endpoint futuro (ejemplo): `GET /api/planes`
- Posibles parámetros: `?activo=true`, `?duracion=mensual`, etc.
- La landing deberá:
  - Consumir estos datos para mostrar pricing.
  - No “hardcodear” precios finales en el front cuando sea posible.

### 4.2 Alta de clientes (borrador + definitiva)

- `POST /api/clientes/draft` (nombre a definir)
- `POST /api/clientes/confirm` (nombre a definir)

El contrato final se documentará aquí cuando se cierre con Antonio.

---

## 5. Convenciones de naming en código

- Entidades:
  - `Lead` → lead (inquilino).
  - `AgencyClient` o `Customer` → cliente de Qualify (agencia).
  - `Plan`, `Discount`, `Subscription`.
  - `Property` o `Listing` → inmueble.

- Variables:
  - `draftClientId`, `stripeSubscriptionId`, `stripeCustomerId`, `planId`, `discountCode`.

- Endpoints internos (Astro):
  - `/api/pre-signup` → pre-alta
  - `/api/complete-signup` → completar alta post-Stripe

---

## 6. Uso con CODEX

Mantener este archivo actualizado para que CODEX pueda:

- Inferir nombres de funciones y tipos.
- Respetar nomenclatura de rutas.
- Aplicar patrones repetibles (API handlers, React islands, etc.).

Estilo de comentarios para tareas AI:

```ts
/* AI-TASK:
 * Create a React component <SignupForm> that:
 * - Reads the selected plan from props.
 * - Collects name, email, phone, agencyName.
 * - On submit, calls /api/pre-signup and then triggers Stripe Checkout.
 * Follow naming and flow conventions from context.tech.md.
 */
```
