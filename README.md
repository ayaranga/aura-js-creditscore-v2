# Sample Microservices App - Aura JS Credit Score
This repo contains a sample credit score application that connects and uses an Oracle database instance.
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
Review the docker file(Dockerfile) and make the modifications for http proxy or /etc/hosts entry if required.
Build docker image. Example:
```
docker build -t ashayr/aura-js-creditscore-emcc .
```
Push the image. Example:
```
docker push ashayr/aura-js-creditscore-emcc
```
## Running sample application on OKE
### Deploy database instance
If you are using aura EMCC broker, you can create the Oracle database instance as follows:
```
oms create serviceinstance ashademopdb --serviceclass oracle-pdbaas --parameters "name:ashademopdb1,zone:224C4518E3CBB69E84F5336FF5C2D53B,emcc.servicetemplate.parameters.workload_name:SAI_MEDIUM_WORKLOAD,emcc.servicetemplate.parameters.pdb_name:ashademopdb2,emcc.servicetemplate.parameters.service_name:ashademopdb3,emcc.servicetemplate.parameters.target_name:demo,emcc.servicetemplate.parameters.username:foo,emcc.servicetemplate.parameters.password:bar,emcc.servicetemplate.parameters.tablespaces:ashademotbs"
```
The above command creates a secret `secret-ashademopdb` that contains the credentials to connect to the database.

NOTE: The PDB database created by the above command will have an unlimited quota for the tablespace specified for the specified PDB user. The default tablespace associated with the PDB user is "SYSTEM" but it has "0" bytes quota to the PDB user. When you are creating a table, it is required to specify the tablespace name that is used while creating the database so that the data can be inserted into the table successfully.

If the database instance is already running somewhere else, you can create a secret using secret.yaml available as part of this repo. Review and make necessary modifications to the secret file contents before creating.
```
 kubectl apply -f secret.yaml
```
Note: See https://kubernetes.io/docs/concepts/configuration/secret/ for details on creating and decoding secrets.
### Deploy the sample app
The deployment template file `kubernetes-deployment.yml.template` is available as part of this repo.
Edit the deployment file to specify the correct image name, /etc/hosts entries if any using hostAliases, tablespace name and the secret details required to connect to the Oracle database.

If the database is deployed outside the cluster and istio sidecar is being installed, use --includeIPRanges option for not redirecting outbound database traffic to istio proxy. See https://istio.io/docs/tasks/traffic-management/egress.html for more details.  
```
kubectl apply -f <(istioctl kube-inject -f kubernetes-deployment.yml.template --includeIPRanges=10.0.0.1/24)
```
NOTE: --includeIPRanges option accepts comma separated list of IP ranges in CIDR form. If set, it redirects outbound traffic to Envoy only for IP ranges. Otherwise all outbound traffic is redirected.

You can disable sidecar injection using the annotation "sidecar.istio.io/inject" set to "false" in the deployment file. You can find the sample deployment file  `kubernetes-deployment.yml.template.disable.sidecar.inject` to do this in this repo.
```
kubectl apply -f kubernetes-deployment.yml.template.disable.sidecar.inject
```
#### Delete the sample app deployment
To delete the deployed sample app:
```
kubectl delete deployment aura-js-creditscore-v3
kubectl delete service aura-js-creditscore
kubectl delete ing aura-js-creditscore
```
## Verifying the application
1. Create the required table to store credit score data. This step is required only once to create the required table for storing the credit score data.
 ```
curl -X POST http://<ip:port>/api/creditscore/create -i
```
2. Access credit score app http://<ip:port>/
Enter the details and click Score button
3. Verify the inserted data contents by accessing:
http://<ip:port>/api/creditscore

If you have not created the table, you see the message `{"MESSAGE":"ERROR communicating with DB-Error: ORA-00942: table or view does not exist"}`. If so, create the table as specified above in the step 1.

NOTE: If you are running kubectl proxy, you can access the application using proxy url as well. Example: http://localhost:8001/api/v1/namespaces/default/services/aura-js-creditscore:http/proxy/api/creditscore
## Running sample application as a docker container
```
docker run -p 3000:3000 -it -e DB_CONNECT_STRING="(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=129.146.73.156)(PORT=1521)))(CONNECT_DATA=(SERVICE_NAME=ashatestpdb47)(INSTANCE_NAME=ahuprod)(UR=A)(SERVER=DEDICATED)))" -e DB_USER=foo -e DB_PASSWORD=bar -e DB_TABLESPACE=ashatesttbs ashayr/aura-js-creditscore-emcc:latest
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
export DB_TABLESPACE=ashatesttbs
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
