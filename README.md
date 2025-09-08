## Doubling Game

Sample game for trialing and demonstrating web frameworks, in this case, next.js.

The frontend and backend are implemented in Next.js. Frontend uses React to build the UI. Backend is implemented with Next.js App Router.

The database in use is PostgreSQL.

### Project Structure

`src/` folder contains the Next.js app, implementing both the frontend and backend.
`testdb/` folder contains a dockerized test psql database that can be used to trial the app.

To view the **API documentation,** see the readme `src/README.md`

### Installation and running development server

Prequisites:
- docker
- docker-compose
- node.js v22 or higher (comes with npm)

The current installed node version can be checked by running `node --version`.

The project requires a database to connect to. A dockerized db for testing purposes can be found in the `db/` folder.

To run a local postgres database, run the following:
```sh
cd testdb
docker-compose up -d
```
This start a local psql database in the port 5432. The local test database fills itself with two game users with usernames `adelvey` and `ok`, both with the password `123`. More users can be created through the app UI.

To tear down the database, run the following:
```sh
docker-compose down -v
```

To start a development server of the next.js app (both the frontend and backend with the game engine) for local usage, run the following (from root):
```sh
cd src
npm install
npm run dev
```
This starts the Next.js app in development mode at [http://localhost:3000](http://localhost:3000).  
The main game page is available at the root URL [http://localhost:3000/](http://localhost:3000/) and embeds the game client in an `<iframe>`.  
The game client itself is served at [http://localhost:3000/client](http://localhost:3000/client), but navigating to it directly is usually unnecessary.

The game client can also be built and exported for deployment with
```sh
next build && next export
```
The resulting client will be built and exported into the `out/` folder. Note that this only builds the client and the backend HTTP API still needs to deployed elsewhere. Building the app also requires setting the correct environment variable `NEXT_PUBLIC_API_URL` so the client knows which backend to connect to.

### Tests
Some tests for the HTTP API are located in the `src/tests/` folder, implemented with node's test framework.
To run these tests, navigate to `src/`folder and run:
```sh
node --test tests/test.js
```
A few .rest request files are located in the `src/requests/` folder. These are simple development-time tests that can be run directly in VS Code using the REST Client extension.