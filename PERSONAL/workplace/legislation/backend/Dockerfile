FROM nlecbaseimages.azurecr.io/base-images/python:3.11

ENV PYTHONUNBUFFERED=1

ARG PIPENV_OPTIONS="--deploy"

COPY Pipfile* ./
# hadolint ignore=DL3013
RUN pipenv install --system ${PIPENV_OPTIONS}

COPY Makefile ./
COPY src src
COPY conf conf
