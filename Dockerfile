FROM node:20-alpine

ARG ENVIRONMENT=ci
ENV NODE_ENV=${ENVIRONMENT}

WORKDIR /opt/app

COPY . .

RUN npm set progress=false
RUN npm install
RUN npm run build

CMD ["npm", "start"]
