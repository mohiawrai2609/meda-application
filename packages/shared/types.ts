
export interface Exception {
    id: string;
    loanId: string;
    loan?: any;
    assignedToId?: string;
    assignedTo?: any;
    exceptionType: ExceptionType;
    documentType: DocumentType;
    description: string;
    severity: Severity;
    status: ExceptionStatus;
    attemptCount: number;
    maxAttempts: number;
    slaDeadline?: Date;
    firstContactAt?: Date;
    resolvedAt?: Date;
    escalatedAt?: Date;
    communications?: Communication[];
    documents?: any[];
    auditLogs?: any[];
    createdAt: Date;
    updatedAt: Date;
}

export enum ExceptionType {
    MISSING_DOCUMENT = 'MISSING_DOCUMENT',
    MISSING_PAGES = 'MISSING_PAGES',
    EXPIRED_DOCUMENT = 'EXPIRED_DOCUMENT',
    ILLEGIBLE_SCAN = 'ILLEGIBLE_SCAN',
    WRONG_DOCUMENT = 'WRONG_DOCUMENT',
    WRONG_ACCOUNT = 'WRONG_ACCOUNT',
    UNSIGNED_FORM = 'UNSIGNED_FORM',
    DATA_MISMATCH = 'DATA_MISMATCH',
    INCOMPLETE_DATA = 'INCOMPLETE_DATA',
    OTHER = 'OTHER'
}

export enum DocumentType {
    BANK_STATEMENT = 'BANK_STATEMENT',
    W2 = 'W2',
    TAX_RETURN = 'TAX_RETURN',
    PAYSTUB = 'PAYSTUB',
    VOE = 'VOE',
    APPRAISAL = 'APPRAISAL',
    TITLE_REPORT = 'TITLE_REPORT',
    INSURANCE = 'INSURANCE',
    ID_DOCUMENT = 'ID_DOCUMENT',
    OTHER = 'OTHER'
}

export enum Severity {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export enum ExceptionStatus {
    OPEN = 'OPEN',
    CONTACTING = 'CONTACTING',
    AWAITING_RESPONSE = 'AWAITING_RESPONSE',
    DOCUMENT_RECEIVED = 'DOCUMENT_RECEIVED',
    VALIDATING = 'VALIDATING',
    RESOLVED = 'RESOLVED',
    ESCALATED = 'ESCALATED',
    CANCELLED = 'CANCELLED'
}

export enum MessageType {
    DOCUMENT_REQUEST = 'DOCUMENT_REQUEST',
    REMINDER = 'REMINDER',
    ESCALATION = 'ESCALATION',
    CONFIRMATION = 'CONFIRMATION',
    REJECTION = 'REJECTION',
    INITIAL_REQUEST = 'INITIAL_REQUEST'
}

export enum CommChannel {
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    PORTAL = 'PORTAL'
}

export enum CommDirection {
    OUTBOUND = 'OUTBOUND',
    INBOUND = 'INBOUND'
}

export interface Communication {
    id: string;
    exceptionId: string;
    channel: CommChannel;
    direction: CommDirection;
    messageType: MessageType;
    subject?: string;
    body: string;
    metadata?: any;
    sentAt?: Date;
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    bouncedAt?: Date;
    createdAt: Date;
}
