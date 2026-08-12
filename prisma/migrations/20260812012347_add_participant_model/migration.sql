-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_uuid_key" ON "Participant"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_key" ON "Participant"("email");
