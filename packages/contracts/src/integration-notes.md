# Integration note

`@pika/contracts` is the canonical shared import path for Sprint 1 client/server contract types.

Backend is the owner of endpoint semantics, runtime validation, status code behavior, and authoritative request-processing rules. Frontend and mocks should consume these shared shapes without assuming transport-specific implementation details beyond what backend documents.