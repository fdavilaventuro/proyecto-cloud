# Integración y Notificaciones (EventBridge + SNS)

Este proyecto académico implementa un flujo híbrido de pedidos KFC y un sistema de notificaciones basado en eventos.

## Arquitectura (Resumen)
- Pedido backend (`pedidos-backend`): API Gateway + Lambdas + DynamoDB.
- Workflow (`kfc-workflow`): Step Functions automatiza el pago (ORDER.PAID).
- Integraciones (`kfc-integraciones`): Reglas de EventBridge escuchan eventos y disparan notificaciones por SNS.
- Frontend (`kfcfront`): Interfaz de usuario (Next.js) para autenticación y menú (opcional).

## Flujo de Estados
- PENDING → PROCESSING → PAID (automatizado por Step Functions)
- PAID → KITCHEN_READY (empleado)
- KITCHEN_READY → PACKED (empleado)
- PACKED → DELIVERING (manager, asigna repartidor) → ORDER.READY (evento)

## Notificaciones por Correo (Dev / Académico)
- Se usa Amazon SNS (no SES) por restricciones del entorno de AWS Academy.
- SNS envía correos a las direcciones suscritas y confirmadas en el tópico `orders-notifications`.
- Los correos se envían cuando ocurren:
  - `ORDER.PAID`: Confirmación de pago
  - `ORDER.READY`: Pedido listo / en reparto

### Suscribirse al tópico (una vez)
1. Obtener el ARN del tópico:
   ```bash
   aws sns list-topics --region us-east-1 --query "Topics[?contains(TopicArn, 'orders-notifications')].TopicArn" --output text
   ```
2. Suscribir el correo del tester:
   ```bash
   aws sns subscribe \
     --topic-arn arn:aws:sns:us-east-1:<ACCOUNT_ID>:orders-notifications \
     --protocol email \
     --notification-endpoint fabio.davila@utec.edu.pe \
     --region us-east-1
   ```
3. Confirmar la suscripción desde el correo.

## Deploy y Pruebas

### Despliegue completo
```bash
bash scripts/deploy-all.sh dev us-east-1
```

### Prueba de humo (flujo híbrido)
```bash
bash scripts/smoke-test-hybrid.sh dev us-east-1
```
Resultados esperados:
- Estado final: `DELIVERING`.
- 2 correos de SNS (si el email está suscrito): Pago confirmado y pedido listo.
- Logs de notificaciones:
```bash
aws logs tail /aws/lambda/kfc-integraciones-dev-notification_handler --follow --region us-east-1
```

## Variables y Permisos Clave
- `kfc-integraciones/serverless.yml` crea `OrdersNotificationsTopic` (SNS) y expone permisos `sns:Publish`.
- El Lambda `notification_handler` recibe `SNS_TOPIC_ARN` por `Ref` de CloudFormation.
- `pedidos-backend` añade `events:PutEvents` para emitir `ORDER.READY` desde `assign_delivery`.

## Producción (cuando no sea AWS Academy)
- Cambiar backend de notificaciones a **SES** (env var `NOTIFY_BACKEND=SES`).
- Verificar dominio y correos en SES, configurar DKIM/SPF.
- Usar el mismo `notifications.py` con envío por SES (código ya preparado anteriormente).

## Troubleshooting
- 502 en endpoints: revisar CloudWatch logs del Lambda, normalmente por errores de parámetros en DynamoDB.
- Error `Decimal is not JSON serializable`: ya se corrige con `common/response.py` (conversión a float).
- No llegan correos: verificar suscripción SNS y confirmar desde el correo.

## Equipo
- Este documento está en español para el equipo académico.
- Cualquier duda técnica: revisar los scripts en `scripts/` y los `serverless.yml` de cada subproyecto.


