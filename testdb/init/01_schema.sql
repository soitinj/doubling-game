CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  balance INTEGER
);

CREATE TABLE rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL,
  state_open BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  initial_bet INTEGER,
  win INTEGER,

  CONSTRAINT fk_round_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL,
  user_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  correct BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_bet_round
    FOREIGN KEY (round_id)
    REFERENCES rounds(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_bet_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);