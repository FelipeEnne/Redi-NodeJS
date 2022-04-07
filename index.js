import { createClient } from "redis";

(async () => {
  const client = createClient();

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  //const result = await client.set('key', 'value', { EX: 1, NX: true})
  //console.log(result)

  const value = await client.get("key");
  console.log(value);

  await client.disconnect();
})();
