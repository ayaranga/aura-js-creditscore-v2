# Sample Microservices App - Aura JS Credit Score
This repo contains a sample application that connects and uses an Oracle database instance.
## Clone the repo
Clone this repo
```
git clone https://github.com/ayaranga/aura-js-creditscore-v2
```
Change directory to the repo 
```
cd aura-js-creditscore-v2
```
## Build Docker image
Review the docker file and make the modifications for http proxy or /etc/hosts entry if required.
Build docker image. Example:
```
docker build -t ashayr/aura-js-creditscore-emcc .
```
Push the image. Example:
```
docker push ashayr/aura-js-creditscore-emcc
```
## Running sample application on OKE
Edit kubernetes-deployment.yml.template to specify the correct image name and the secret details required to connect to the Oracle database.
```
kubectl apply -f <(istioctl kube-inject -f kubernetes-deployment.yml.template)
```
## Verifying the application
1. Create the required table to store credit score data
 ```
curl -X POST http://<ip:port>/api/creditscore/create -i
```
2. Access credit score app http://<ip:port>/
Enter the details and click Score button
3. Verify the inserted data contents by accessing:
http://<ip:port>/api/creditscore

## Running sample application as a docker container
```
docker run -p 3000:3000 -it -e DB_CONNECT_STRING="(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=129.146.73.156)(PORT=1521)))(CONNECT_DATA=(SERVICE_NAME=ashatestpdb47)(INSTANCE_NAME=ahuprod)(UR=A)(SERVER=DEDICATED)))" -e DB_USER=foo -e DB_PASSWORD=bar ashayr/aura-js-creditscore-emcc:latest
```
## Running application locally on any machine
1. Install nodejs on your machine. See https://nodejs.org/en/download/ for more details.
2. Install Oracle database instant client. See https://docs.oracle.com/cd/E83411_01/OREAD/installing-oracle-database-instant-client.htm#OREAD348 for more details.  
3. Clone this repo (git clone https://github.com/ayaranga/aura-js-creditscore-v2) and cd to the repo (cd aura-js-creditscore-v2)
4. Run `npm install`
5. Export the following env variables
```
export DB_USER=foo
export DB_PASSWORD=bar
export DB_CONNECT_STRING=(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=129.146.73.156)(PORT=1521)))(CONNECT_DATA=(SERVICE_NAME=ashatestpdb47)(INSTANCE_NAME=ahuprod)(UR=A)(SERVER=DEDICATED)))
```
5. Run `node app.js`

## Appendix:
This is a tutorial for microservices training. In this tutorial, we will cover the following features:

* Service Mesh - Deploy a microservice with Istio enabled
* Canary deployment - Switch traffic from version V1 to version V2
* Service Brokers - Provision and use a MySQL/MongoDB instance
* API-first development
* Observability - Observe the service runtime behaviour with Vizceral, Zipkin and Grafana (Limited)
* CI/CD - Use Wercker to deploy our services

To get started go to the [aura-tutorials](https://github.com/sachin-pikle/aura-tutorials) repo.


