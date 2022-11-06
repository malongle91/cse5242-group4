const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('chinook.db');

console.log('Query 1: List of playlists.\n');

let sqlQuery = `SELECT DISTINCT Name name
                FROM playlists ORDER BY name`;

// Retrieve all rows of the query.
db.all(sqlQuery, [], (err, rows) => {
    if (err) { throw err; }
    rows.forEach((row) => {
        console.log(row.name);
    });
});

console.log('Query 2: Playlist with Id = 1.\n');

sqlQuery = `SELECT PlaylistId id, Name name
            FROM playlists WHERE PlaylistId = ?`;

// This is a parameter that will be interpolated into
// the query string, in place of the '?'.
let playlistId = 1;

// Retrieve the first row of the query.
db.get(sqlQuery, [playlistId], (err, row) => {
    if (err) { return console.error(err.message); }
    return row
        ? console.log(row.id, row.name)
        : console.log(`No playlist found with id ${playlistId}.`);
});

console.log('Query 3: USA customers ordered by FirstName.\n');

sqlQuery = `SELECT FirstName firstName,
                  LastName lastName,
                  Email email
           FROM customers WHERE country = ?
           ORDER BY FirstName`;
let country = 'USA';

// Retrieve all rows of the query with a callback on each row.
db.each(sqlQuery, [country], (err, row) => {
    if (err) { throw err; }
    console.log(`${row.firstName} ${row.lastName} - ${row.email}`);
});

db.close();