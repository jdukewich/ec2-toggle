FROM python:3.8.7 as base

# - - -
# FRONTEND
FROM node:lts AS frontend

RUN mkdir /frontend

WORKDIR /frontend

COPY ./frontend/package.json /frontend/package.json
RUN npm install -g @angular/cli
RUN npm install

COPY ./frontend /frontend

# TO ONLY BUILD THE FRONTEND, USE --target frontend

# - - -
# BACKEND
FROM base AS backend

ENV PYTHONUNBUFFERED 1

RUN mkdir /backend

WORKDIR /backend

COPY ./backend/requirements/* /tmp/
RUN pip install -r /tmp/development.txt

COPY ./backend /backend
