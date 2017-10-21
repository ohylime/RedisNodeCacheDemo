const file = "db/imdb-large.sqlite3.db";

/* ---- My database sqlite3 db ---- */
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(file);

/* ---- Redis Database ---- */
const redis = require("redis");

/* ---- automatically connects to localhost:6379 ---- */
const client = redis.createClient();

const bigQuery = "select first_name as name from actors where gender='M'";

/* ---- Creating Timer ---- */
console.time("Query_Time");


/* ---- check to see if query result is in cache ---- */
client.get(bigQuery, function(err, value) {

    if (err) {
        return console.log(err);
    }

    if(value) { // ---- return value if value exists

        console.log("Redis Cache : Number of actors who are male : " + value);
        return console.timeEnd("Query_Time");

    } else {

        db.serialize(function() {
            db.all(bigQuery, function(err, value) {

                if (err) {
                    return console.log(err);
                }

                if(value){
                console.timeEnd("Query_Time");
                console.log("Sqlite Query: Number of actors who are male :" + value.length);
              }

              // HOW To Set Redis Key, Value
                client.set(bigQuery, value.length , function(err) {

                    if (err) {
                      return console.error(err);
                    }

                  // Redis can set expiration time.

                  client.expire(bigQuery, 20);

                });
              // End of redis Set

                return db.close();

            });
        });

    }
});
