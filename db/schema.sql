CREATE TABLE "user" (
  "id"            text        PRIMARY KEY,
  "name"          text        NOT NULL,
  "email"         text        NOT NULL UNIQUE,
  "emailVerified" boolean     NOT NULL DEFAULT false,
  "image"         text,
  "firstName"     text        NOT NULL,
  "lastName"      text        NOT NULL,
  "username"      text        NOT NULL UNIQUE,
  "createdAt"     timestamptz NOT NULL DEFAULT now(),
  "updatedAt"     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "session" (
  "id"        text        PRIMARY KEY,
  "userId"    text        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "token"     text        NOT NULL UNIQUE,
  "expiresAt" timestamptz NOT NULL,
  "ipAddress" text,
  "userAgent" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX "session_userId_idx" ON "session" ("userId");

CREATE TABLE "account" (
  "id"                    text        PRIMARY KEY,
  "userId"                text        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accountId"             text        NOT NULL,
  "providerId"            text        NOT NULL,
  "password"              text,
  "accessToken"           text,
  "refreshToken"          text,
  "idToken"               text,
  "accessTokenExpiresAt"  timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  "scope"                 text,
  "createdAt"             timestamptz NOT NULL DEFAULT now(),
  "updatedAt"             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX "account_userId_idx" ON "account" ("userId");

CREATE TABLE "verification" (
  "id"         text        PRIMARY KEY,
  "identifier" text        NOT NULL,
  "value"      text        NOT NULL,
  "expiresAt"  timestamptz NOT NULL,
  "createdAt"  timestamptz NOT NULL DEFAULT now(),
  "updatedAt"  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");

CREATE TABLE "route" (
  "id"             text        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"         text        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "name"           text        NOT NULL,
  "points"         jsonb       NOT NULL,
  "path"           jsonb       NOT NULL,
  "distanceMeters" integer     NOT NULL,
  "isLoop"         boolean     NOT NULL DEFAULT false,
  "createdAt"      timestamptz NOT NULL DEFAULT now(),
  "updatedAt"      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX "route_userId_idx" ON "route" ("userId");

CREATE TABLE "run" (
  "id"             text        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"         text        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "routeId"        text        REFERENCES "route"("id") ON DELETE SET NULL,
  "startedAt"      timestamptz NOT NULL,
  "finishedAt"     timestamptz NOT NULL,
  "durationMs"     integer     NOT NULL,
  "distanceMeters" integer     NOT NULL,
  "track"          jsonb       NOT NULL,
  "createdAt"      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX "run_userId_startedAt_idx" ON "run" ("userId", "startedAt" DESC);

CREATE TABLE "follow" (
  "followerId"  text        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "followingId" text        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "createdAt"   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("followerId", "followingId"),
  CHECK ("followerId" <> "followingId")
);

CREATE INDEX "follow_followingId_idx" ON "follow" ("followingId");

CREATE TABLE "group_run" (
  "id"         text        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "routeId"    text        NOT NULL REFERENCES "route"("id") ON DELETE CASCADE,
  "hostId"     text        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "status"     text        NOT NULL DEFAULT 'waiting' CHECK ("status" IN ('waiting', 'running', 'finished')),
  "startedAt"  timestamptz,
  "finishedAt" timestamptz,
  "createdAt"  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX "group_run_hostId_idx" ON "group_run" ("hostId");

CREATE TABLE "group_run_member" (
  "groupRunId" text        NOT NULL REFERENCES "group_run"("id") ON DELETE CASCADE,
  "userId"     text        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "status"     text        NOT NULL DEFAULT 'invited' CHECK ("status" IN ('invited', 'joined', 'declined')),
  "joinedAt"   timestamptz,
  "createdAt"  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("groupRunId", "userId")
);

CREATE INDEX "group_run_member_userId_idx" ON "group_run_member" ("userId");
