docker build -t ashayr/aura-js-creditscore-mongo:latest .
docker push ashayr/aura-js-creditscore-mongo:latest
Edit kubernetes-deployment.yml.template to specify correct image and secret details.
kubectl apply -f <(istioctl kube-inject -f kubernetes-deployment.yml.template)

Access http://127.0.0.1:8001/api/v1/namespaces/default/services/aura-js-creditscore-mongo:http/proxy/api/creditscore

# Sample Microservices App - Aura JS Credit Score

This is a tutorial for microservices training. In this tutorial, we will cover the following features:

* Service Mesh - Deploy a microservice with Istio enabled
* Canary deployment - Switch traffic from version V1 to version V2
* Service Brokers - Provision and use a MySQL/MongoDB instance
* API-first development
* Observability - Observe the service runtime behaviour with Vizceral, Zipkin and Grafana (Limited)
* CI/CD - Use Wercker to deploy our services

To get started go to the [aura-tutorials](https://github.com/sachin-pikle/aura-tutorials) repo.
