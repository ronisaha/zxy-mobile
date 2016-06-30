var WebSqlStore = function(successCallback, errorCallback) {

    function mergeObject(obj1, obj2) {
        for (var attr in obj2) {
            obj1[attr] = obj2[attr];
        }
        return obj1;
    };


    this.initializeDatabase = function(successCallback, errorCallback) {
        var self = this;
        this.db = sqlitePlugin.openDatabase("zxy.db", "1.0", "", 1);
        this.db.transaction(
                function(tx) {
                    self.createTable(tx);
                    self.addSampleData(tx);
                },
                function(error) {
                    console.log('Transaction error: ' + error);
                    if (errorCallback) errorCallback();
                },
                function() {
                    console.log('Transaction success');
                    if (successCallback) successCallback();
                }
        )
    }

    var USER_CREATE_QUERY = "INSERT OR REPLACE INTO zxy_users " +
        "(id, fullName, nickName, password, dob, gender, hobby, education, photo, cellPhone, email) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    this.createTable = function(tx) {
        var sql = "CREATE TABLE IF NOT EXISTS zxy_users ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "fullName VARCHAR(100), " +
            "nickName VARCHAR(50), " +
            "password VARCHAR(50), " +
            "dob VARCHAR(50), " +
            "gender VARCHAR(1), " +
            "hobby VARCHAR(255), " +
            "education INTEGER, " +
            "photo VARCHAR(100), " +
            "cellPhone VARCHAR(50), " +
            "email VARCHAR(50))";
        tx.executeSql(sql, null,
                function() {
                    console.log('Create table success');
                },
                function(tx, error) {
                    alert('Create table error: ' + error.message);
                });
    }

    this.addUser = function (tx, user) {
        var u = mergeObject({
            id: null,
            fullName: "",
            nickName: "",
            password: "",
            dob: "",
            gender: "",
            hobby: "",
            education: "",
            photo: "",
            cellPhone: "",
            email: ""
        }, user);

        tx.executeSql(sql, [u.id, u.fullName, u.nickName, u.password, u.dob, u.gender, u.hobby, u.education, u.photo, u.cellPhone, u.email],
            function() {
                console.log('INSERT success');
            },
            function(tx, error) {
                alert('INSERT error: ' + error.message);
            });
    };

    this.addSampleData = function(tx) {
        var users = [
                {"id":  1, "fullName": "Roni Saha", "nickName": "Roni", "password": "123456", "gender":"m", "education":1, "cellPhone":"01817087873", "email":"roni.cse@gmail.com"},
                {"id":  2,"fullName": "AKM Rashedul Islam", "nickName": "Rashed", "password": "123456", "gender":"m", "education":1, "cellPhone":"01711946780", "email":"rashed@l2nsoft.com"}
            ];
        
        var l = users.length;
        
        for (var i = 0; i < l; i++) {
            this.addUser(tx, users[i]);
        }
    }

    this.findByName = function(searchKey, callback) {
        this.db.transaction(
            function(tx) {

                var sql = "SELECT u.id, u.fullName, u.nickName, u.photo, u.cellPhone, u.email" +
                    "FROM zxy_users u" +
                    "WHERE u.fullName || ' ' || u.nickName LIKE ? " +
                    "ORDER BY u.fullName, u.nickName";

                tx.executeSql(sql, ['%' + searchKey + '%'], function(tx, results) {
                    var len = results.rows.length,
                        employees = [],
                        i = 0;
                    for (; i < len; i = i + 1) {
                        employees[i] = results.rows.item(i);
                    }
                    callback(employees);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    }

    this.findById = function(id, callback) {
        this.db.transaction(
            function(tx) {

                var sql = "SELECT u.id, u.fullName, u.nickName, u.password, u.dob, u.gender, u.hobby, u.education, u.photo, u.cellPhone, u.email" +
                    "FROM zxy_users u " +
                    "WHERE u.id=:id";

                tx.executeSql(sql, [id], function(tx, results) {
                    callback(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    };

    this.initializeDatabase(successCallback, errorCallback);

}
