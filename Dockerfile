FROM node:24 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm clean-install

# Build
COPY . .

ARG env="production"
RUN if [ "$env" = "production" ]; then \
  npm run build; \
fi

# These lines are only required to use this stage of the build to run a dev
# server (see compose.dev.yml).
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


# Run the built app in a webserver
FROM nginx

COPY --from=builder /app/dist /usr/share/nginx/html

