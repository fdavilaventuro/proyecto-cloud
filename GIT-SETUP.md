# Guía de Configuración de Git (Equipo)

Esta guía ayuda a clonar, configurar y colaborar en el proyecto en equipo.

## Prerrequisitos
- Git instalado
- Node.js 18+ y npm (o pnpm)
- AWS CLI configurado con credenciales de AWS Academy (LabRole)
- Python 3.9+ (para lambdas de backend)

## Clonar el repositorio
```bash
git clone https://github.com/fdavilaventuro/proyecto-cloud.git
cd proyecto-cloud
```

## Estructura de carpetas
- `pedidos-backend/`: API de pedidos (Serverless + Python + DynamoDB)
- `kfc-workflow/`: Step Functions del flujo de pago
- `kfc-integraciones/`: EventBridge + SNS para notificaciones
- `kfcfront/`: Frontend (Next.js)
- `scripts/`: Scripts para despliegue y pruebas

## Configuración inicial
1. Revisar `serverless.vars.yml` (cuenta y rol):
   ```yaml
   org: <org>
   accountId: 282163831899
   labRole: LabRole
   ```
2. Instalar dependencias donde aplique:
   ```bash
   cd pedidos-backend && npm install && cd ..
   cd kfc-workflow && npm install && cd ..
   cd kfc-integraciones && npm install && cd ..
   ```

## Despliegue
```bash
bash scripts/deploy-all.sh dev us-east-1
```
- Despliega backend, workflow y integraciones.
- Crea el tópico SNS `orders-notifications`.

## Prueba del flujo
```bash
bash scripts/smoke-test-hybrid.sh dev us-east-1
```
- Crea un pedido, procesa pago, simula estados de empleado y manager.
- Al final, el estado debe ser `DELIVERING`.

## Notificaciones por correo (dev)
- Suscribir correo al tópico SNS una sola vez:
```bash
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:282163831899:orders-notifications \
  --protocol email \
  --notification-endpoint fabio.davila@utec.edu.pe \
  --region us-east-1
```
- Confirmar la suscripción desde el email.

## Buenas prácticas de Git
- Crear ramas por feature/bugfix: `feat/notificaciones-sns`, `fix/decimal-json`.
- Commits descriptivos: `feat(notifications): enviar correo via SNS en ORDER.READY`.
- Pull Requests y revisión por pares.

## Problemas comunes
- `AccessDenied` en SES: usar SNS en dev (AWS Academy no permite SES).
- 502 en API: revisar logs en CloudWatch del lambda correspondiente.
- JSON con `Decimal`: solucionado vía `common/response.py`.
## Cómo trabajar con GitHub y EC2

### 1) Crear un repositorio en GitHub
1. Entra a [github.com](https://github.com).
2. Crea un nuevo repositorio (ej. `proyecto-cloud`).
3. No inicialices con README/.gitignore/licencia.
4. Copia la URL HTTPS o SSH.

### 2) Hacer push desde tu máquina
```powershell
cd 'c:\Users\fdavi\Documents\proyecto cloud'
git remote add origin <URL_GITHUB>
git branch -M main
git push -u origin main
```

### 3) Clonar en una instancia EC2
1. Conéctate por SSH (`ssh -i <tu-key.pem> ec2-user@<ip>`).
2. Instala git si hace falta:
   ```bash
   sudo yum install git -y
   ```
3. Clona el repo:
   ```bash
   git clone <URL_GITHUB>
   cd proyecto-cloud
   ```

### 4) Desplegar desde EC2
Usa los scripts en bash:
```bash
chmod +x scripts/deploy-all.sh scripts/smoke-test-hybrid.sh
bash scripts/deploy-all.sh dev us-east-1
bash scripts/smoke-test-hybrid.sh dev us-east-1
```

Si estás en Windows EC2 y prefieres PowerShell:
```powershell
.\scripts\build-and-deploy.ps1 -Stage dev -Region us-east-1
```

### Antes del deploy, asegúrate:
- AWS CLI configurado para usar `LabRole`.
- Node.js y Python 3.9+ instalados.
- Serverless: `npm install -g serverless`.

### Notas
- Edita `serverless.vars.yml` si tu `accountId` o `labRole` difieren.
- No subas `.env` al repositorio (mantener secretos fuera de git).
- Usa `git pull` para bajar cambios del branch `main`.
