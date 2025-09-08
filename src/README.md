# HTTP API Documentation

## Env files
One .env file exists, .env.development. A .env.local file can be created next to the src/ folder next to .env.development to override these values.

## Base URL
BASE_URL should be set in an .env file. For development, this is `http://localhost:3000`.

---

## Endpoints

**Required Headers:**
* `Content-Type: application/json`
* `Àuthorization: Bearer <token>` (If auth is required)

---

### [POST] /api/register
**Description:** Login a new user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response 200 OK: UserResponse**

```ts
type UserResponse = {
  username: string,
  id: number,
  balance: number
}
```

---

### [POST] /api/login
**Description:** Login an user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response 200 OK: LoginResponse**

```ts
type LoginResponse = {
  username: string,
  id: number,
  balance: number,
  token: string // login token to be used in Authorization header
}
```

---

### [GET] /api/balance
**Description:** Get a user's balance.

**Response 200 OK: UserResponse**

```ts
type UserResponse = {
  username: string,
  id: number,
  balance: number,
}
```

---

### [GET] /api/rounds
**Description:** Fetch a list of open (playable) rounds.

Auth: required

**Response 200 OK: RoundResponse[]**
```ts
type RoundResponse = {
  id: string,
  userId: number,
  stateOpen: boolean,
  initialBet: number,
  win: number,
  createdAt: string
}
```

---

### [GET] /api/rounds/{id}
**Description:** Fetches the status of a specific round

Auth: required

**Response 200 OK: RoundResponse**

Same as GET `/api/rounds`

---


### [POST] /api/rounds
**Description:** Open a new round.

Auth: required

**Request Body:**
```json
{
  "initialBet": "number"
}
```

**Response 201 Created: OpenRoundResponse**
```ts
type OpenRoundResponse = {
  "round": RoundResponse,
  "user": UserResponse
}
```

---

### [POST] /api/rounds/{id}/bet
**Description:** Bet on an open round.

Auth: required

**Request Body:**
```json
{
  "betSymbol": "string" // Either "HIGH" or "LOW"
}
```

**Response 201 Created: BetResponse**

```ts
type BetResponse = {
  bet: Bet,
  card: { rank: number, suit: string },
  betSymbol: string
}
```

---

### [POST] /api/rounds/{id}/claim
**Description:** Claim an open (winning) round.

Auth: required

**Request Body:**
```json
{
  "betSymbol": "string" // Either "HIGH" or "LOW"
}
```

**Response 201 Created: BetResponse**

```ts
type ClaimResponse = {
  roundWin: number // amount won
}
```

---
