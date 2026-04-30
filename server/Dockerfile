FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

ENV NODE_ENV=production
ENV PORT=8800

EXPOSE 8800

CMD ["npm", "start"]


