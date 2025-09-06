import postgres from 'postgres';

export const sql = postgres(process.env.PSQL_CONNECTION_STR!, {
  no_prepare: true,
  transform: postgres.camel,
  ssl: false
});
