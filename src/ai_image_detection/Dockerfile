# Use the official miniconda image as the base
FROM continuumio/miniconda3

# Setup the enviroment
COPY environment.yml /tmp/environment.yml

RUN conda env create -f /tmp/environment.yml

ENV PATH /opt/conda/envs/ml-ai-detect/bin:$PATH

COPY main.py .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]