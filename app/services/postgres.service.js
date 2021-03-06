const pg = require("pg");

class PostgresService {
    constructor() {
        this.connectionString = 'postgresql://postgres:postgres@localhost:5432/areaVerde'
        this.pool = new pg.Pool(
            { connectionString: this.connectionString }
        );
    };

    async executeSql(sql) {
        try {
             return await this.pool.query(sql);
        } catch (error) {
        };
    };

};
module.exports = PostgresService;