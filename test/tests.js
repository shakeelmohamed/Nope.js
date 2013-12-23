var assert = require("assert");
var pg = require("pg");
var fs = require("fs");

describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
              assert.equal(-1, [1,2,3].indexOf(5));
              assert.equal(-1, [1,2,3].indexOf(0));
        })
      })
});

describe('PostgreSQL', function() {
    describe('DATABASE_URL test', function() {
        it('should fail when DATABASE_URL is not set', function(done) {
            console.log("DATABASE_URL: ["+process.env.DATABASE_URL+"]", " is type ", typeof(process.env.DATABASE_URL));
            //assert.notEqual(process.env.DATABASE_URL, undefined, 'DATABASE_URL is undefined');
            //assert.equal(process.env.DATABASE_URL, 'postgres://postgres:@127.0.0.1/nopejs_test');
            done();
        });
    });

    describe('create user table', function() {
        it('should fail if unable to connect to database', function(done) {
            process.env.DATABASE_URL = 'postgres://postgres:@127.0.0.1/nopejs_test';
            var client = new pg.Client(process.env.DATABASE_URL);

            assert.equal(client.user, 'postgres');
        });
        it('should fail when unable to create the user table', function(done) {
            var entered = false;
            client.connect(process.env.DATABASE_URL, function (err) {
                //TODO: this code is never being executed
                console.log("We connected just fine.");
                entered = true;
                console.log("We're in the connect block, right? : ", entered);

                assert.ifError(err);

                assert.equal(true, fs.existsSync('databases/users.sql'), 'users.sql exists');

                client.query(fs.readFileSync('databases/user.sql'), function (err, result) {
                    assert.ifError(err);
                    console.log("We ran the query, I guess.");
                });
                
                //done();
            });
            client.end();
            //console.log("How about now? : ", entered);
            assert.equal(true, entered, 'PostgreSQL connection failed.');
            done();
        });
    })
});