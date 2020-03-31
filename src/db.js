import mysql from 'mysql';

const mysqlConfiguration = {
    user: 'root',
    database: 'test',
};

class Conn {
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

function makeConnection() {
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

export async function withConn(res, fn) {
    // Create connection.
    let conn;
    try {
        conn = await makeConnection();
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
        await conn.end(conn);
    } catch (err) {
        console.error(err);
    }
}
