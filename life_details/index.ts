const { Surreal } = await import("surrealdb.js");

const db = new Surreal();

async function main() {
  try {
    // Connect to the database
    await db.connect('http://127.0.0.1:8000/rpc', {
      // Set the namespace and database for the connection
      namespace: 'test',
      database: 'test',

      // Set the authentication details for the connection
      auth: {
        namespace: 'test',
        database: 'test',
        scope: 'user',
        username: 'info@surrealdb.com',
        password: 'my-secret-password',
      },
    });

    // Create a new person with a random id
    const created = await db.create('person', {
      title: 'Founder & CEO',
      name: {
        first: 'Tobie',
        last: 'Morgan Hitchcock',
      },
      marketing: true,
      identifier: Math.random().toString(36).substr(2, 10),
    });

    // Update a person record with a specific id
    const updated = await db.merge('person:jaime', {
      marketing: true,
    });

    // Select all people records
    const people = await db.select('person');

    // Perform a custom advanced query
    const groups = await db.query(
      'SELECT marketing, count() FROM type::table($tb) GROUP BY marketing',
      {
        tb: 'person',
      }
    );

    console.log(created);
    console.log(groups);
    console.log(updated);
    console.log(people);
  } catch (e) {
    console.error('ERROR', e);
  }
}

await main();

export { }
