import { promises as fs } from 'fs';
import mysql from 'mysql';

const mysqlConfiguration = {
    user: 'root',
    database: 'test',

    multipleStatements: true,
};

class Conn {
    static makeConn() {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(mysqlConfiguration);

            connection.connect((err) => {
                if (err) {
                    reject(err);
                    return;
                }

                const conn = new Conn(connection);
                resolve(conn);
            });
        });
    }

    constructor(connection) {
        this.connection = connection;
        connection.on('error', (err) => {
            console.error(error);
        });
    }

    query(options) {
        return new Promise((resolve, reject) => {
            this.connection.query(options, (err, results, fields) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve({ results, fields });
            });
        });
    }

    end() {
        return new Promise((resolve, reject) => {
            this.connection.end((err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });

            this.connection = null;
        });
    }
}

export async function withConn(res, fn) {
    // Create connection.
    let conn;
    try {
        conn = await Conn.makeConn();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        // Do not continue.
        return;
    }

    // Execute function.
    try {
        await fn(conn);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        // Continue.
    }

    // End connection.
    try {
        await conn.end();
    } catch (err) {
        console.error(err);
    }
}

async function migrate() {
    const conn = await Conn.makeConn();

    let files = await fs.readdir('./sql/');
    files.sort();
    files = files.map((file) => `./sql/${file}`);

    for (const file of files) {
        if (file.endsWith('.sql')) {
            console.log(`Applying ${file}:`);

            const buffer = await fs.readFile(file);
            const content = buffer.toString('utf-8');

            console.log(content);

            await conn.query(content);
        }
    }
    await conn.end();
}

async function migrateAtBoot() {
    try {
        await migrate();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrateAtBoot();
