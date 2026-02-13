"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommDirection = exports.CommChannel = exports.MessageType = exports.ExceptionStatus = exports.Severity = exports.DocumentType = exports.ExceptionType = void 0;
var ExceptionType;
(function (ExceptionType) {
    ExceptionType["MISSING_DOCUMENT"] = "MISSING_DOCUMENT";
    ExceptionType["MISSING_PAGES"] = "MISSING_PAGES";
    ExceptionType["EXPIRED_DOCUMENT"] = "EXPIRED_DOCUMENT";
    ExceptionType["ILLEGIBLE_SCAN"] = "ILLEGIBLE_SCAN";
    ExceptionType["WRONG_DOCUMENT"] = "WRONG_DOCUMENT";
    ExceptionType["WRONG_ACCOUNT"] = "WRONG_ACCOUNT";
    ExceptionType["UNSIGNED_FORM"] = "UNSIGNED_FORM";
    ExceptionType["DATA_MISMATCH"] = "DATA_MISMATCH";
    ExceptionType["INCOMPLETE_DATA"] = "INCOMPLETE_DATA";
    ExceptionType["OTHER"] = "OTHER";
})(ExceptionType || (exports.ExceptionType = ExceptionType = {}));
var DocumentType;
(function (DocumentType) {
    DocumentType["BANK_STATEMENT"] = "BANK_STATEMENT";
    DocumentType["W2"] = "W2";
    DocumentType["TAX_RETURN"] = "TAX_RETURN";
    DocumentType["PAYSTUB"] = "PAYSTUB";
    DocumentType["VOE"] = "VOE";
    DocumentType["APPRAISAL"] = "APPRAISAL";
    DocumentType["TITLE_REPORT"] = "TITLE_REPORT";
    DocumentType["INSURANCE"] = "INSURANCE";
    DocumentType["ID_DOCUMENT"] = "ID_DOCUMENT";
    DocumentType["OTHER"] = "OTHER";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var Severity;
(function (Severity) {
    Severity["LOW"] = "LOW";
    Severity["MEDIUM"] = "MEDIUM";
    Severity["HIGH"] = "HIGH";
    Severity["CRITICAL"] = "CRITICAL";
})(Severity || (exports.Severity = Severity = {}));
var ExceptionStatus;
(function (ExceptionStatus) {
    ExceptionStatus["OPEN"] = "OPEN";
    ExceptionStatus["CONTACTING"] = "CONTACTING";
    ExceptionStatus["AWAITING_RESPONSE"] = "AWAITING_RESPONSE";
    ExceptionStatus["DOCUMENT_RECEIVED"] = "DOCUMENT_RECEIVED";
    ExceptionStatus["VALIDATING"] = "VALIDATING";
    ExceptionStatus["RESOLVED"] = "RESOLVED";
    ExceptionStatus["ESCALATED"] = "ESCALATED";
    ExceptionStatus["CANCELLED"] = "CANCELLED";
})(ExceptionStatus || (exports.ExceptionStatus = ExceptionStatus = {}));
var MessageType;
(function (MessageType) {
    MessageType["DOCUMENT_REQUEST"] = "DOCUMENT_REQUEST";
    MessageType["REMINDER"] = "REMINDER";
    MessageType["ESCALATION"] = "ESCALATION";
    MessageType["CONFIRMATION"] = "CONFIRMATION";
    MessageType["REJECTION"] = "REJECTION";
    MessageType["INITIAL_REQUEST"] = "INITIAL_REQUEST";
})(MessageType || (exports.MessageType = MessageType = {}));
var CommChannel;
(function (CommChannel) {
    CommChannel["EMAIL"] = "EMAIL";
    CommChannel["SMS"] = "SMS";
    CommChannel["PORTAL"] = "PORTAL";
})(CommChannel || (exports.CommChannel = CommChannel = {}));
var CommDirection;
(function (CommDirection) {
    CommDirection["OUTBOUND"] = "OUTBOUND";
    CommDirection["INBOUND"] = "INBOUND";
})(CommDirection || (exports.CommDirection = CommDirection = {}));
