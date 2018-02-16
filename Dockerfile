FROM node:6.10
ENV http_proxy "http://www-proxy.us.oracle.com:80"
ENV https_proxy "http://www-proxy.us.oracle.com:80"

# Install the required modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir /nodeapp && cp -a /tmp/node_modules /nodeapp

ENV http_proxy ""
ENV https_proxy ""

ADD . /nodeapp
EXPOSE 3000
CMD    [ "node", "/nodeapp/app.js" ]
