import SQL from 'sql-template-strings';

export async function getProfiles(conn) {
    const sql = SQL`SELECT * FROM profile`;
    const { results } = await conn.query(sql);

    const profiles = results;
    return profiles;
}

export async function getProfileByUsername(conn, username) {
    const sql = SQL`SELECT * FROM profile WHERE username = ${username}`;
    const { results } = await conn.query(sql);

    // Check if the result is found or not.
    if (results.length !== 1) {
        return null;
    }

    const profile = results[0];
    return profile;
}
