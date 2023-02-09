FROM bcgovimages/alpine-node-libreoffice

WORKDIR /workspace

COPY package*.json /workspace/

RUN npm i

COPY . .

RUN npm run build

CMD ["npm","run", "start"]