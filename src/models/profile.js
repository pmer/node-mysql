import SQL from 'sql-template-strings';

export function isUsernameValid(value) {
    return typeof value === 'string' &&
        1 <= value.length && value.length <= 300;
}

// Note: function isPasswordValid can be found in password.js

export function isBodyValid(value) {
    return typeof value === 'string' &&
        0 <= value.length && value.length <= 10000;
}

export function isDescriptionValid(value) {
    return typeof value === 'string' &&
        0 <= value.length && value.length <= 3000;
}

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

export async function createProfile(conn, profile) {
    const {
        username,
        password,
        salt,
        created,
        updated,
        body,
        description
    } = profile;

    const sql = SQL`INSERT
        INTO profile
        (username, password, salt, created, updated, body, description)
        VALUES
        (${username}, ${password}, ${salt}, ${created}, ${updated}, ${body},
         ${description})`;

    await conn.query(sql);
}
