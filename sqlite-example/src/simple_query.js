const sqlite3 = require('sqlite3').verbose();
const dbPath = 'chinook.db';

// Open DB connection.
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        return console.err(err.message);
    }
    console.log('Connected to SQLite db.');
});

// Query the DB for Playlists.
db.serialize(() => {
    const queryString = `SELECT PlaylistId as id,
                        Name as name FROM playlists`;
    db.each(queryString, (err, row) => {
        if (err) {
            console.error(err.message);
        }
        console.log(row.id + "\t" + row.name);
    });
});

// Close DB connection.
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Closed the db connection.');
});
