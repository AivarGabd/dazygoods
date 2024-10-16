import { MongoClient, Db } from "mongodb";

const mongodbUri =
"mongodb://aivargab:Kaban48412356-Ars@90.156.219.41/MongoDB-3628";
//const mongodbUri = "mongodb://0.0.0.0:27017/db1";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase() {
  if (client && db) {
    return { client, db };
  }

  try {
    client = new MongoClient(mongodbUri);

    await client.connect();
    db = client.db();

    // Add event listeners for connection issues
    client.on("error", console.error.bind(console, "MongoDB connection error:"));
    client.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
      client = null;
      db = null;
    });

    //console.log("Connected to MongoDB");
    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

// Ensure the connection is closed when the application shuts down
process.on("SIGINT", async () => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
  process.exit(0);
});


