### Krishisetu

Krishisetu is a simple application build on the idea of loosely coupled micro-services which uses NATS Streaming as a message broker to communicate between different services.

Prerequisite to run the application

[Docker](https://docs.docker.com/engine/install/), [Kubernetes](https://kubernetes.io/docs/tasks/tools/), [Skaffold](https://skaffold.dev/docs/install/), [IngressController](https://kubernetes.github.io/ingress-nginx/) must be installed

#### Steps to run the project

##### git clone https://github.com/Shreyaschorge/krishisetu-backend-api.git

cd krishisetu-backend-api

create generic secrets for JWT_KEY, STRIPE_KEY, AWS_ACCESS_KEY_ID,
AWS_SECRET_ACCESS_KEY

skaffold dev

#### Architecture

<img src="snapshot/Arch.png"/>
