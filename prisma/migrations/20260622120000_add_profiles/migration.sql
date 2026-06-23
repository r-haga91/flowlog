CREATE TABLE "profiles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'LESER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "profiles_authUserId_key" ON "profiles"("authUserId");
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");
CREATE INDEX "profiles_role_isActive_idx" ON "profiles"("role", "isActive");
