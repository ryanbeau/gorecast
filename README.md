# Gorecast

This repository contains a React front-end and a node.js back-end that defines an Express API. Follow the instructions below to run the client and server.

## Requirements

* Node ([download]("https://nodejs.org/en/"))

## Get Started

### Front-end

From root, install the front-end dependencies:

```bash
cd front-end/
npm install
```

Populate the front-end `.env` as follows:

```bash
REACT_APP_AUTH0_DOMAIN=
REACT_APP_AUTH0_CLIENT_ID=
REACT_APP_AUTH0_AUDIENCE=
REACT_APP_SERVER_URL=http://localhost:6060
```

Get the values for `REACT_APP_AUTH0_DOMAIN`, `REACT_APP_AUTH0_CLIENT_ID`, and `REACT_APP_AUTH0_AUDIENCE` from Auth0.

With the `.env` configuration values set, run the API server by issuing the following command:

```bash
npm start
```

### Back-end

From root, install the back-end dependencies:

```bash
cd back-end/
npm install
```

Populate the front-end `.env` as follows:

```bash
SERVER_PORT=6060
CLIENT_ORIGIN_URL=http://localhost:4040
AUTH0_AUDIENCE=
AUTH0_DOMAIN=
```

Get the values for `AUTH0_AUDIENCE` and `AUTH0_DOMAIN` from Auth0.


With the `.env` configuration values set, run the API server by issuing the following command:

```bash
npm start
```