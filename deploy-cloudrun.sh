#!/bin/bash
# =====================================================================
# Google Cloud Run Deployment Script: GenMedia 2.0
# =====================================================================
# This script automates building the multi-stage container image using
# Cloud Build, pushing it to Artifact Registry, and deploying to Cloud Run.
# Run from the project root directory.

# Exit immediately if any command fails
set -e

# Configuration variables (Customizable)
PROJECT_ID="nitinagga-ge-2"
REGION="us-central1"
SERVICE_NAME="genmedia20-service"
IMAGE_NAME="genmedia20-app"

echo "☁️ Starting Google Cloud Run deployment pipeline..."
echo "👉 Active GCP Project: $PROJECT_ID"
echo "👉 Target Region: $REGION"
echo "👉 Target Service: $SERVICE_NAME"

# 1. Ensure gcloud is configured to the target project
echo -e "\n🔒 Step 1: Configuring gcloud project context..."
gcloud config set project $PROJECT_ID

# 2. Enable required Google Cloud APIs
echo -e "\n🔌 Step 2: Enabling Cloud Build and Cloud Run APIs..."
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com

# 3. Create Artifact Registry repository if it does not exist
REPO_NAME="genmedia20-repo"
echo -e "\n📦 Step 3: Checking Artifact Registry repository..."
if ! gcloud artifacts repositories describe $REPO_NAME --location=$REGION &>/dev/null; then
    echo "Creating Artifact Registry repository '$REPO_NAME'..."
    gcloud artifacts repositories create $REPO_NAME \
        --repository-format=docker \
        --location=$REGION \
        --description="Docker repository for GenMedia 2.0"
else
    echo "Repository '$REPO_NAME' already exists."
fi

# 4. Build and push image to Artifact Registry using Google Cloud Build
IMAGE_TAG="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME:latest"
echo -e "\n🔨 Step 4: Compiling container image in the cloud via Cloud Build..."
echo "Submitting build to: $IMAGE_TAG"
gcloud builds submit --tag $IMAGE_TAG .

# 5. Deploy to Google Cloud Run
echo -e "\n🚀 Step 5: Deploying image to Google Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_TAG \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --min-instances 0 \
    --max-instances 2 \
    --cpu 1 \
    --memory 512Mi \
    --set-env-vars="VITE_API_URL=" \
    --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest"

# 6. Retrieve and display service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

echo -e "\n🏆 Deployment completed successfully!"
echo "📍 Live Google Cloud Run URL: $SERVICE_URL"
echo "🧬 GenMedia 2.0 (Maestro ContentStudio) is now fully live and secure!"
