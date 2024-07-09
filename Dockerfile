FROM node:22 as builder

WORKDIR /tmp

# Install dependencies
COPY package*.json ./
RUN npm clean-install --production

# Build
COPY . .
RUN npm run build


# Run the built app in a webserver
FROM nginx

COPY --from=builder /tmp/dist /usr/share/nginx/html
