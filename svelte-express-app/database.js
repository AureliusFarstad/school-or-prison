var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = '../database/live/buildings.db'

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message)
        throw err
    }else{
        console.log('Connected to the SQLite database.')

        var sql = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='buildings'"
        var params = []
        db.get(sql, params, (err, row) => {
            if (err) {
                console.error(err.message)
                throw err
            }else{
                table_exists = row['count(*)']
                if (table_exists == 1) {
                    console.log('buildings table running in SQLite database.')
                }else{
                    console.error('buildings table not found in SQLite database. Seed database.')
                    throw err
                }
            }
        });
    }
});

module.exports = db