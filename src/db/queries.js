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
    `SELECT ${RUN_SUMMARY_COLUMNS}, r."track"
     FROM "run" r LEFT JOIN "route" rt ON rt."id" = r."routeId"
     WHERE r."id" = $1 AND r."userId" = $2`,
    [id, userId],
  );
  return rows[0] ?? null;
}
