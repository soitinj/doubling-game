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
- node.js v22 or higher

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

To start a development server of the next.js app (both the frontend and backend with the game engine), run the following (from root):
```sh
cd src
npm install
npm run dev
```
This starts the Next.js app in development mode at [http://localhost:3000](http://localhost:3000).  
The main game page is available at the root URL [http://localhost:3000/](http://localhost:3000/) and embeds the game client in an `<iframe>`.  
The game client itself is served at [http://localhost:3000/client](http://localhost:3000/client), but navigating to it directly is usually unnecessary.
