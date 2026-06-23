CREATE TABLE "festivaler" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "navn" TEXT NOT NULL
);

CREATE TABLE "arrangorer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "navn" TEXT NOT NULL
);

CREATE TABLE "arrangementer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "navn" TEXT NOT NULL,
    "festivalId" INTEGER NOT NULL,
    CONSTRAINT "arrangementer_festivalId_fkey" FOREIGN KEY ("festivalId") REFERENCES "festivaler" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "avlesninger" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "festivalId" INTEGER NOT NULL,
    "arrangorId" INTEGER NOT NULL,
    "arrangementId" INTEGER NOT NULL,
    "dato" DATETIME NOT NULL,
    "klokkeslett" TEXT NOT NULL,
    "malerstand" REAL NOT NULL,
    "kommentar" TEXT,
    "opprettetDato" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "avlesninger_festivalId_fkey" FOREIGN KEY ("festivalId") REFERENCES "festivaler" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "avlesninger_arrangorId_fkey" FOREIGN KEY ("arrangorId") REFERENCES "arrangorer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "avlesninger_arrangementId_fkey" FOREIGN KEY ("arrangementId") REFERENCES "arrangementer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "festivaler_navn_key" ON "festivaler"("navn");
CREATE UNIQUE INDEX "arrangorer_navn_key" ON "arrangorer"("navn");
CREATE INDEX "arrangementer_festivalId_idx" ON "arrangementer"("festivalId");
CREATE UNIQUE INDEX "arrangementer_festivalId_navn_key" ON "arrangementer"("festivalId", "navn");
CREATE INDEX "avlesninger_festivalId_idx" ON "avlesninger"("festivalId");
CREATE INDEX "avlesninger_arrangorId_idx" ON "avlesninger"("arrangorId");
CREATE INDEX "avlesninger_arrangementId_idx" ON "avlesninger"("arrangementId");
CREATE INDEX "avlesninger_opprettetDato_idx" ON "avlesninger"("opprettetDato");
