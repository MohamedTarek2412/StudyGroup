# ─── Stage 1: Build ───────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install --frozen-lockfile

COPY . ./

ARG REACT_APP_API_URL
ARG REACT_APP_SIGNALR_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_SIGNALR_URL=$REACT_APP_SIGNALR_URL

RUN npm run build

# ─── Stage 2: Serve with Nginx ────────────────────────────────
FROM nginx:alpine AS runtime

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
 
