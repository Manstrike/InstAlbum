import mysql from 'mysql2/promise';

export class DBConnection{
    constructor() {
        this.create();
    }

    async create () {
        if (this.connection) return;

        this.connection = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_SCHEMA,
            port: process.env.DB_PORT,
            insecureAuth : true,
        });
    }

    async execute (query) {
        if (!this.connection) await this.create();

        return await this.connection.execute(query);
    }
}