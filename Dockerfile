# =====================================================================
# STAGE 1: Build the React/Vite Frontend SPA
# =====================================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package descriptors and install dependencies
COPY package*.json ./
RUN rm -f package-lock.json && npm install --registry=https://registry.npmjs.org --legacy-peer-deps

# Copy frontend source files
COPY index.html vite.config.ts tsconfig.json tailwind.config.js ./
COPY public/ ./public/
COPY src/ ./src/

# Build the production assets (compile relative API paths)
ENV VITE_API_URL=""
RUN npm run build

# =====================================================================
# STAGE 2: Build the FastAPI Python Production Runtime Container
# =====================================================================
FROM python:3.11-slim

WORKDIR /app

# Set Python environment flags
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# No system dependencies needed for pre-compiled wheels

# Install python dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend python code
COPY backend/ ./backend/

# Copy compiled frontend static assets from Stage 1
COPY --from=frontend-builder /app/dist ./dist/

# Expose container port
EXPOSE 8080

# Run uvicorn server in private/public unified mode
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
