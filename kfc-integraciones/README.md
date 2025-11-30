# KFC Integraciones (Notificaciones por Eventos)

Este módulo implementa las **notificaciones** del sistema de pedidos usando **EventBridge** y **SNS** (correo en entorno académico). Todo el contenido está en español.

---

## ¿Qué contiene?
- `serverless.yml`: infraestructura (Reglas de EventBridge, permisos y tópico SNS).
- `notifications.py`: Lambda que recibe `ORDER.PAID` y `ORDER.READY` y publica correos vía SNS.
- Documentación: ver `README-INTEGRATION.md` (integración) y `GIT-SETUP.md` (setup del equipo).

---

## Recursos en AWS
- EventBridge Bus: `orders-bus` (eventos de pago y entrega).
- SNS Topic: `orders-notifications` (correos a suscriptores confirmados).
- CloudWatch Logs: `/aws/lambda/kfc-integraciones-dev-notification_handler`.

---

## Variables de entorno (Lambda `notification_handler`)
- `SNS_TOPIC_ARN`: inyectada por CloudFormation (`Ref` al tópico SNS).
- `TABLE_NAME`: nombre de la tabla de pedidos (exportada por `pedidos-backend`).

---

## Flujo de notificaciones
- `ORDER.PAID`: lo envía el workflow de pago (Step Functions).
- `ORDER.READY`: lo envía el endpoint `deliver` de `pedidos-backend` al asignar repartidor.
- `notifications.py`: arma el correo (en español) y publica en SNS.

---

## Uso
- Despliegue completo: `bash scripts/deploy-all.sh dev us-east-1`
- Prueba de humo: `bash scripts/smoke-test-hybrid.sh dev us-east-1`
- Suscribir email: ver pasos en `README-INTEGRATION.md`.

---

## Notas
- Este repo ya no incluye lambdas de “pago” ni “event ready”; esas funciones viven en `kfc-workflow` y `pedidos-backend` respectivamente.
- En producción (fuera de AWS Academy) se puede cambiar a SES.

---

## EventBridge

Eventos que se envían y consumen:

* `ORDER.READY` → enviado por `send_event_ready.py`.
* `ORDER.PAID` → enviado por `stripe_payment.py`.
* `notification_handler` consume ambos eventos y actualiza el historial de la orden.

Ejemplo de payload:

```json
{
  "orderId": "ORDER-001"
}
```

---

## Logs y Depuración

Todos los logs de Lambda están en **CloudWatch**:

* `/aws/lambda/kfc-integraciones-dev-get_order_status`
* `/aws/lambda/kfc-integraciones-dev-stripe_payment`
* `/aws/lambda/kfc-integraciones-dev-send_order_ready`
* `/aws/lambda/kfc-integraciones-dev-notification_handler`

Verifica los logs para entender la transición de estados y errores.

---

## Recomendaciones

* No actualizar el estado directamente desde `notification_handler` si ya se hace en las Lambdas de acción (evita redundancia).
* Usar siempre la función `/status/{id}` para consultar el estado más reciente.
* Para pruebas de integración, usar Postman o CURL con los endpoints definidos.

---

## Diagrama de Flujo Simplificado

```
Frontend/API Gateway
       |
       v
   /pay  ---> stripe_payment.py ---> EventBridge (ORDER.PAID)
       |
   /event/ready ---> send_event_ready.py ---> EventBridge (ORDER.READY)
       |
       v
notification_handler.py (historial)
       |
       v
DynamoDB Orders
```

---

## Contribución

1. Clonar el repo.
2. Configurar variables de entorno.
3. Hacer deploy con Serverless:

```bash
sls deploy
```

4. Probar endpoints siguiendo el flujo recomendado.
