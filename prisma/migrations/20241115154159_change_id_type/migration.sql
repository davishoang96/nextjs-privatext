/*
  Warnings:

  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sender` on the `Message` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Message" ("content", "createdAt", "id") SELECT "content", "createdAt", "id" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
