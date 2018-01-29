FROM node:6.10

ENV http_proxy "http://www-proxy.us.oracle.com:80"
ENV https_proxy "http://www-proxy.us.oracle.com:80"

#INSTALL LIBAIO1 & UNZIP (NEEDED FOR STRONG-ORACLE)
RUN apt-get update \
 && apt-get install -y libaio1 \
 && apt-get install -y build-essential \
 && apt-get install -y unzip \
 && apt-get install -y curl

#ADD ORACLE INSTANT CLIENT
RUN mkdir -p /opt/oracle
ADD ./oracle/linux/ .

RUN unzip instantclient-basic-linux.x64-12.2.0.1.0.zip -d /opt/oracle \
 && unzip instantclient-sdk-linux.x64-12.2.0.1.0.zip -d /opt/oracle  \
 && mv /opt/oracle/instantclient_12_2 /opt/oracle/instantclient \
 && ln -s /opt/oracle/instantclient/libclntsh.so.12.2 /opt/oracle/instantclient/libclntsh.so \
 && ln -s /opt/oracle/instantclient/libocci.so.12.2 /opt/oracle/instantclient/libocci.so

ENV LD_LIBRARY_PATH="/opt/oracle/instantclient"
ENV OCI_HOME="/opt/oracle/instantclient"
ENV OCI_LIB_DIR="/opt/oracle/instantclient"
ENV OCI_INCLUDE_DIR="/opt/oracle/instantclient/sdk/include"
ENV OCI_VERSION=12

# Install node-oracledb module
RUN npm install -g oracledb ejs express

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir /nodeapp && cp -a /tmp/node_modules /nodeapp
ADD . /nodeapp
EXPOSE 3000
CMD    [ "node", "/nodeapp/app.js" ]
