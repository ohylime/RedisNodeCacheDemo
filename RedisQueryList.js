const file = "db/imdb-large.sqlite3.db";
/* ---- My database sqlite3 db ---- */
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(file);

/* ---- Redis Database ---- */
const redis = require("redis");

/* ---- automatically connects to localhost:6379 ---- */
const client = redis.createClient();

const bigQuery = "select first_name as name from actors where last_name='Smith'";

/* ---- Creating Timer ---- */
console.time("Query_Time");
/*--------------------------*/


/* ---- check to see if query result is in cache ---- */
client.lrange(bigQuery,0,-1, function(err, value) {

    if (err) { // error handler
        return console.log(err);
    }

    if(value.length>0) { // ---- return value if value exists
        console.timeEnd("Query_Time");
        console.log(`Redis Number of actors in movie :  ${value.length}`);
        return console.log(`Index 0 : ${value[0]}  LastIndex : ${value[2424]}`);
    } else {

        db.serialize(function() {
            db.all(bigQuery, function(err, value) {

                if (err) {
                    return console.log(err);
                }

                console.timeEnd("Query_Time");
                console.log("Number of actors with last name Smith :" + value.length);
                console.log(`Index 0 : ${value[0].name}  LastIndex : ${value[2424].name}`);

                //console.time("PUSH");
                /* ---- sets Redis Key - Value ---- */
                value.forEach((actor)=> {

                  client.rpush(bigQuery, actor.name , function(err) {
                    if (err) {
                      return console.error(err);
                    }
                    });

                });
                    
                // Redis can set expiration time.
                 client.expire(bigQuery, 20);
                 //console.timeEnd("PUSH");

                return db.close();

            });
        });

    }
});
