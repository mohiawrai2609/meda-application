-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "settings" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PROCESSOR',
    "organizationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loanNumber" TEXT NOT NULL,
    "borrowerName" TEXT NOT NULL,
    "borrowerEmail" TEXT NOT NULL,
    "borrowerPhone" TEXT,
    "propertyAddress" TEXT,
    "loanAmount" REAL,
    "loanType" TEXT,
    "losReferenceId" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Loan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exception" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loanId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "exceptionType" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 4,
    "slaDeadline" DATETIME,
    "firstContactAt" DATETIME,
    "resolvedAt" DATETIME,
    "escalatedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Exception_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Exception_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Communication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exceptionId" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'EMAIL',
    "direction" TEXT NOT NULL,
    "messageType" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "metadata" TEXT,
    "sentAt" DATETIME,
    "deliveredAt" DATETIME,
    "openedAt" DATETIME,
    "clickedAt" DATETIME,
    "bouncedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Communication_exceptionId_fkey" FOREIGN KEY ("exceptionId") REFERENCES "Exception" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exceptionId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "storageUrl" TEXT NOT NULL,
    "validationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "validationResult" TEXT,
    "validationErrors" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validatedAt" DATETIME,
    CONSTRAINT "Document_exceptionId_fkey" FOREIGN KEY ("exceptionId") REFERENCES "Exception" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exceptionId" TEXT,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_exceptionId_fkey" FOREIGN KEY ("exceptionId") REFERENCES "Exception" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Loan_loanNumber_key" ON "Loan"("loanNumber");

-- CreateIndex
CREATE INDEX "Exception_status_idx" ON "Exception"("status");

-- CreateIndex
CREATE INDEX "Exception_loanId_idx" ON "Exception"("loanId");

-- CreateIndex
CREATE INDEX "Exception_slaDeadline_idx" ON "Exception"("slaDeadline");

-- CreateIndex
CREATE INDEX "Communication_exceptionId_idx" ON "Communication"("exceptionId");

-- CreateIndex
CREATE INDEX "Document_exceptionId_idx" ON "Document"("exceptionId");

-- CreateIndex
CREATE INDEX "AuditLog_exceptionId_idx" ON "AuditLog"("exceptionId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
