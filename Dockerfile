# Imagen base
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Puerto en el que se ejecutará la app (ajústalo según el framework)
EXPOSE 3000

# Comando para desarrollo (puedes cambiarlo por build/start si es prod)
CMD ["npm", "run", "dev"]
