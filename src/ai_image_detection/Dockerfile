FROM mambaorg/micromamba:1.5.6

# Set env variables to avoid micromamba warnings
ENV MAMBA_ROOT_PREFIX=/opt/conda \
    PATH=/opt/conda/bin:$PATH \
    CONDA_PREFIX=/opt/conda \
    ENV_NAME=myenv

# Set working directory
WORKDIR /app

# Copy environment.yml
COPY ./src/bot_detection/environment.yml .

# Create environment
RUN micromamba create -y -n $ENV_NAME -f environment.yml && \
    micromamba clean --all --yes

# Activate env for future RUN and CMD
SHELL ["micromamba", "run", "-n", "myenv", "--"]

# Copy your project files (after env creation to keep layers clean)
COPY ./src/ai_image_detection/* .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]