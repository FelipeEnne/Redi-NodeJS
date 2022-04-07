import mysql from "mysql2/promise";
import "dotenv/config";
import { createClient } from "redis";

(async () => {
  const client = createClient();
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();

  console.time("mysql");
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
  });
  const id = 1;

  for (let x = 0; x < 1000; x++) {
    let clientCache = await client.get(`${id}`);

    if (!clientCache) {
      const [rows] = await conn.query(
        "select * from tests where id=? limit 1",
        [1]
      );

      client.set(`${id}`, JSON.stringify(rows[0]));
      clientCache = rows[0];
    } else {
      clientCache = JSON.parse(clientCache);
    }

    console.log(clientCache.name);
  }

  console.timeEnd("mysql"); //363.812ms without redis x 139.783ms with redis
})();
