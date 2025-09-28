-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_gyms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT,
    "latitude" DECIMAL NOT NULL,
    "longitude" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_gyms" ("description", "id", "latitude", "longitude", "name", "phone") SELECT "description", "id", "latitude", "longitude", "name", "phone" FROM "gyms";
DROP TABLE "gyms";
ALTER TABLE "new_gyms" RENAME TO "gyms";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
