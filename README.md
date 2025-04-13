
# Guía de Despliegue: Docker, AWS ECR y ECS

Este archivo describe los pasos necesarios para construir, cargar y desplegar una aplicación Dockerizada en AWS utilizando Elastic Container Service (ECS).

## 1. Construir la imagen Docker

Primero, asegúrate de tener el archivo `Dockerfile` en el directorio raíz de tu proyecto.

2. Autenticación en AWS ECR
Para subir la imagen a AWS ECR, primero necesitas autenticarte.

# Autenticación en AWS ECR
aws ecr get-login-password --region tu-region | docker login --username AWS --password-stdin tu-id-de-cuenta.dkr.ecr.tu-region.amazonaws.com

3. Crear un repositorio en AWS ECR
# Crear un repositorio en AWS ECR
aws ecr create-repository --repository-name nombre-de-tu-repositorio --region tu-region
# Etiquetar la imagen Docker para ECR
docker tag nombre-de-tu-imagen:latest tu-id-de-cuenta.dkr.ecr.tu-region.amazonaws.com/nombre-de-tu-repositorio:latest
# Subir la imagen Docker a ECR
docker push tu-id-de-cuenta.dkr.ecr.tu-region.amazonaws.com/nombre-de-tu-repositorio:latest
Una vez que la imagen esté en ECR, puedes usar Amazon ECS para ejecutar el contenedor. Primero, crea una tarea en ECS con la imagen Docker cargada.

Ve a la consola de Amazon ECS.

Crea una nueva Definición de tarea:

Selecciona "Fargate" o "EC2" dependiendo de tus necesidades.

En la sección Contenedor, configura los parámetros con la URI de la imagen en ECR, por ejemplo, tu-id-de-cuenta.dkr.ecr.tu-region.amazonaws.com/nombre-de-tu-repositorio:latest.

Crea un Servicio ECS para ejecutar la tarea:

Configura el servicio de ECS para usar la definición de tarea creada.

Define el número de instancias o réplicas que deseas ejecutar.

Configura el Load Balancer (si es necesario) y las configuraciones de red.
