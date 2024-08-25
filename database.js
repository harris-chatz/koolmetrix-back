const sqlite3 = require ('sqlite3').verbose()
const dbName = 'NodeSql.db'
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbName, (err) => {
    if(err){
        console.error(err.message)
    }
    else{
        console.log("Connected to the Database")
    db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT)', (err) => {}) 
        if (err) {
        console.error(err.message)
             }
        else   {
            console.log("Table created or existed")
        }
    }
    });

module.exports = db;
