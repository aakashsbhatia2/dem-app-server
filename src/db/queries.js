import { pool } from "./pool.js";

const ROUTE_COLUMNS = `"id", "name", "points", "path", "distanceMeters", "isLoop", "createdAt", "updatedAt"`;

export async function createRoute({ userId, name, points, path, distanceMeters, isLoop }) {
  const { rows } = await pool.query(
    `INSERT INTO "route" ("userId", "name", "points", "path", "distanceMeters", "isLoop")
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${ROUTE_COLUMNS}`,
    [userId, name, JSON.stringify(points), JSON.stringify(path), distanceMeters, isLoop],
  );
  return rows[0];
}

export async function listRoutes(userId) {
  const { rows } = await pool.query(
    `SELECT ${ROUTE_COLUMNS} FROM "route" WHERE "userId" = $1 ORDER BY "createdAt" DESC`,
    [userId],
  );
  return rows;
}

export async function getRoute({ id, userId }) {
  const { rows } = await pool.query(
    `SELECT ${ROUTE_COLUMNS} FROM "route" WHERE "id" = $1 AND "userId" = $2`,
    [id, userId],
  );
  return rows[0] ?? null;
}

export async function getRunnableRoute({ id, userId }) {
  const { rows } = await pool.query(
    `SELECT ${ROUTE_COLUMNS} FROM "route" r
     WHERE r."id" = $1
       AND (
         r."userId" = $2
         OR EXISTS (
           SELECT 1 FROM "group_run" g
           JOIN "group_run_member" m ON m."groupRunId" = g."id"
           WHERE g."routeId" = r."id" AND m."userId" = $2 AND m."status" = 'joined'
         )
       )`,
    [id, userId],
  );
  return rows[0] ?? null;
}

export async function updateRoute({ id, userId, name, points, path, distanceMeters, isLoop }) {
  const { rows } = await pool.query(
    `UPDATE "route"
     SET "name" = $3, "points" = $4, "path" = $5, "distanceMeters" = $6, "isLoop" = $7,
         "updatedAt" = now()
     WHERE "id" = $1 AND "userId" = $2
     RETURNING ${ROUTE_COLUMNS}`,
    [id, userId, name, JSON.stringify(points), JSON.stringify(path), distanceMeters, isLoop],
  );
  return rows[0] ?? null;
}

export async function deleteRoute({ id, userId }) {
  const { rowCount } = await pool.query(
    `DELETE FROM "route" WHERE "id" = $1 AND "userId" = $2`,
    [id, userId],
  );
  return rowCount > 0;
}

const RUN_SUMMARY_COLUMNS = `r."id", r."routeId", rt."name" AS "routeName", r."startedAt", r."finishedAt",
  r."durationMs", r."distanceMeters", r."createdAt"`;

export async function createRun({
  userId,
  routeId,
  startedAt,
  finishedAt,
  durationMs,
  distanceMeters,
  track,
}) {
  const { rows } = await pool.query(
    `INSERT INTO "run" ("userId", "routeId", "startedAt", "finishedAt", "durationMs", "distanceMeters", "track")
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING "id", "routeId", "startedAt", "finishedAt", "durationMs", "distanceMeters", "track", "createdAt"`,
    [userId, routeId, startedAt, finishedAt, durationMs, distanceMeters, JSON.stringify(track)],
  );
  return rows[0];
}

export async function listRuns(userId) {
  const { rows } = await pool.query(
    `SELECT ${RUN_SUMMARY_COLUMNS}
     FROM "run" r LEFT JOIN "route" rt ON rt."id" = r."routeId"
     WHERE r."userId" = $1
     ORDER BY r."startedAt" DESC`,
    [userId],
  );
  return rows;
}

export async function getRun({ id, userId }) {
  const { rows } = await pool.query(
    `SELECT ${RUN_SUMMARY_COLUMNS}, r."track",
       CASE WHEN rt."id" IS NULL THEN NULL ELSE json_build_object(
         'id', rt."id", 'name', rt."name", 'points', rt."points", 'path', rt."path",
         'distanceMeters', rt."distanceMeters", 'isLoop', rt."isLoop"
       ) END AS "route"
     FROM "run" r LEFT JOIN "route" rt ON rt."id" = r."routeId"
     WHERE r."id" = $1 AND r."userId" = $2`,
    [id, userId],
  );
  return rows[0] ?? null;
}

const PUBLIC_USER_COLUMNS = `u."id", u."firstName", u."lastName", u."username"`;

export async function searchUsers({ query, viewerId, limit }) {
  const { rows } = await pool.query(
    `SELECT ${PUBLIC_USER_COLUMNS}, (f."followerId" IS NOT NULL) AS "isFollowing"
     FROM "user" u
     LEFT JOIN "follow" f ON f."followerId" = $2 AND f."followingId" = u."id"
     WHERE u."id" <> $2
       AND (
         u."username" = lower($1)
         OR lower(u."firstName") = lower($1)
         OR lower(u."lastName") = lower($1)
         OR lower(u."firstName" || ' ' || u."lastName") = lower($1)
       )
     ORDER BY (u."username" = lower($1)) DESC, u."firstName", u."lastName"
     LIMIT $3`,
    [query, viewerId, limit],
  );
  return rows;
}

export async function userExists(id) {
  const { rowCount } = await pool.query(`SELECT 1 FROM "user" WHERE "id" = $1`, [id]);
  return rowCount > 0;
}

export async function followUser({ followerId, followingId }) {
  await pool.query(
    `INSERT INTO "follow" ("followerId", "followingId") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [followerId, followingId],
  );
}

export async function unfollowUser({ followerId, followingId }) {
  await pool.query(`DELETE FROM "follow" WHERE "followerId" = $1 AND "followingId" = $2`, [
    followerId,
    followingId,
  ]);
}

export async function listFollowing(userId) {
  const { rows } = await pool.query(
    `SELECT ${PUBLIC_USER_COLUMNS}, true AS "isFollowing"
     FROM "follow" f JOIN "user" u ON u."id" = f."followingId"
     WHERE f."followerId" = $1
     ORDER BY f."createdAt" DESC`,
    [userId],
  );
  return rows;
}

export async function listFollowers(userId) {
  const { rows } = await pool.query(
    `SELECT ${PUBLIC_USER_COLUMNS}, (back."followerId" IS NOT NULL) AS "isFollowing"
     FROM "follow" f
     JOIN "user" u ON u."id" = f."followerId"
     LEFT JOIN "follow" back ON back."followerId" = $1 AND back."followingId" = u."id"
     WHERE f."followingId" = $1
     ORDER BY f."createdAt" DESC`,
    [userId],
  );
  return rows;
}

export async function countFollowing({ followerId, followingIds }) {
  const { rows } = await pool.query(
    `SELECT count(*)::int AS "count" FROM "follow"
     WHERE "followerId" = $1 AND "followingId" = ANY($2::text[])`,
    [followerId, followingIds],
  );
  return rows[0].count;
}

const GROUP_RUN_COLUMNS = `g."id", g."status", g."hostId", g."startedAt", g."finishedAt", g."createdAt"`;

export async function createGroupRun({ routeId, hostId, inviteeIds }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `INSERT INTO "group_run" ("routeId", "hostId") VALUES ($1, $2) RETURNING "id"`,
      [routeId, hostId],
    );
    const { id } = rows[0];
    await client.query(
      `INSERT INTO "group_run_member" ("groupRunId", "userId", "status", "joinedAt")
       VALUES ($1, $2, 'joined', now())`,
      [id, hostId],
    );
    await client.query(
      `INSERT INTO "group_run_member" ("groupRunId", "userId") SELECT $1, unnest($2::text[])`,
      [id, inviteeIds],
    );
    await client.query("COMMIT");
    return id;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getGroupRun({ id, userId }) {
  const { rows } = await pool.query(
    `SELECT ${GROUP_RUN_COLUMNS},
       json_build_object(
         'id', r."id", 'name', r."name", 'points', r."points", 'path', r."path",
         'distanceMeters', r."distanceMeters", 'isLoop', r."isLoop"
       ) AS "route"
     FROM "group_run" g
     JOIN "route" r ON r."id" = g."routeId"
     JOIN "group_run_member" me ON me."groupRunId" = g."id" AND me."userId" = $2
     WHERE g."id" = $1`,
    [id, userId],
  );
  return rows[0] ?? null;
}

export async function listGroupRunMembers(groupRunId) {
  const { rows } = await pool.query(
    `SELECT ${PUBLIC_USER_COLUMNS}, m."status"
     FROM "group_run_member" m JOIN "user" u ON u."id" = m."userId"
     WHERE m."groupRunId" = $1
     ORDER BY m."createdAt", u."firstName", u."lastName"`,
    [groupRunId],
  );
  return rows;
}

export async function listGroupRunInvites(userId) {
  const { rows } = await pool.query(
    `SELECT ${GROUP_RUN_COLUMNS}, r."name" AS "routeName", r."distanceMeters",
       json_build_object(
         'id', h."id", 'firstName', h."firstName", 'lastName', h."lastName", 'username', h."username"
       ) AS "host"
     FROM "group_run_member" m
     JOIN "group_run" g ON g."id" = m."groupRunId"
     JOIN "route" r ON r."id" = g."routeId"
     JOIN "user" h ON h."id" = g."hostId"
     WHERE m."userId" = $1 AND m."status" = 'invited' AND g."status" <> 'finished'
     ORDER BY g."createdAt" DESC`,
    [userId],
  );
  return rows;
}

export async function findActiveGroupRunId(userId) {
  const { rows } = await pool.query(
    `SELECT g."id"
     FROM "group_run_member" m JOIN "group_run" g ON g."id" = m."groupRunId"
     WHERE m."userId" = $1 AND m."status" = 'joined' AND g."status" IN ('waiting', 'running')
     ORDER BY g."createdAt" DESC
     LIMIT 1`,
    [userId],
  );
  return rows[0]?.id ?? null;
}

export async function setGroupRunMemberStatus({ groupRunId, userId, status }) {
  await pool.query(
    `UPDATE "group_run_member"
     SET "status" = $3::text,
         "joinedAt" = CASE WHEN $3::text = 'joined' THEN now() ELSE NULL END
     WHERE "groupRunId" = $1 AND "userId" = $2`,
    [groupRunId, userId, status],
  );
}

export async function setGroupRunStatus({ id, status }) {
  await pool.query(
    `UPDATE "group_run"
     SET "status" = $2::text,
         "startedAt" = CASE WHEN $2::text = 'running' THEN now() ELSE "startedAt" END,
         "finishedAt" = CASE WHEN $2::text = 'finished' THEN now() ELSE "finishedAt" END
     WHERE "id" = $1`,
    [id, status],
  );
}
