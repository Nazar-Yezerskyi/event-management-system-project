-- CreateTable
CREATE TABLE "Requests" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewdAt" TIMESTAMP(3),
    "reviewdById" INTEGER,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_reviewdById_fkey" FOREIGN KEY ("reviewdById") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
