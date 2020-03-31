import SQL from 'sql-template-strings';

export async function getPeople(conn) {
    const sql = SQL`SELECT * FROM test`;
    const { results } = await conn.query(sql);

    const people = results;
    return people;
}

export async function getPerson(conn, id) {
    const sql = SQL`SELECT * FROM test WHERE id = ${id}`;
    const { results } = await conn.query(sql);

    // Check if the result is found or not.
    if (results.length !== 1) {
        return null;
    }

    const person = results[0];
    return person;
}
