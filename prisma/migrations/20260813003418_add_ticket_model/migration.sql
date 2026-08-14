-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('GENERATED', 'SENT');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "participantId" INTEGER NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'GENERATED',
    "whatsappUrl" TEXT,
    "pdfBase64" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_uuid_key" ON "Ticket"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_participantId_key" ON "Ticket"("participantId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
