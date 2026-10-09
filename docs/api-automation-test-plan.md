# RESTful API Comprehensive Automation Test Plan

## Application Overview

Automated contract and functional coverage for every public and authenticated API documented at https://restful-api.dev/. The PUBLIC API suite is independently runnable without an account, API key, or JWT and covers all six documented `/objects` operations (GET list and item, POST, PUT, PATCH, DELETE), including read-after-write verification and cleanup. The full plan also includes seven authenticated collection/object operations, registration and login, shared authentication/status query parameters, filtering/pagination, flexible JSON payloads, CORS, and daily request quotas. Authenticated tests target https://api.restful-api.dev using an isolated test account and secrets injected through the test runner; never hard-code or print API keys, passwords, or JWTs. Every scenario starts with an otherwise fresh isolated test state, creates its own unique records where needed, and cleans up its resources. Documented requirements are asserted directly; undocumented error/status details should be captured as contract observations rather than hard-coded guesses.

## Test Scenarios

### 1. Transport, routing, and cross-cutting API behavior

**Seed:** `tests/seed.spec.ts`

#### 1.1. Serve documented API over HTTPS and return JSON responses

**File:** `tests/api/cross-cutting/transport-routing.spec.ts`

**Steps:**
  1. Send a request to a documented GET endpoint over HTTPS without following redirects silently.
    - expect: The request succeeds over TLS without certificate errors.
    - expect: The response has the documented JSON representation and an appropriate JSON content type.
  2. Send requests from a browser-like client using an allowed Origin and issue an OPTIONS preflight for a documented method.
    - expect: CORS response headers permit cross-origin browser access, including the requesting origin and required method/headers.
    - expect: The preflight succeeds and the subsequent request can be made cross-origin.

#### 1.2. Reject unsupported methods and unknown routes cleanly

**File:** `tests/api/cross-cutting/transport-routing.spec.ts`

**Steps:**
  1. Call an unknown path and use a method not documented for a known resource.
    - expect: The API returns a client-error response rather than a success-shaped payload.
    - expect: The response remains parseable or provides a valid error body and does not expose internal details.

#### 1.3. Enforce API-key requirements on authenticated routes

**File:** `tests/api/cross-cutting/auth-headers.spec.ts`

**Steps:**
  1. Call an authenticated collections endpoint with the configured valid x-api-key, then repeat with the header omitted and with an invalid key.
    - expect: The valid key permits access subject to the route's auth-type setting.
    - expect: Requests missing or using an invalid x-api-key are rejected and do not reveal or modify another user's data.

### 2. Public API automation — object reads

This suite exercises the unauthenticated public API; do not send `x-api-key` or an Authorization/JWT header. It must be runnable without account setup or credentials.

**Seed:** `tests/seed.spec.ts`

#### 2.1. GET public object list returns documented sample objects

**File:** `tests/api/public/objects-get.spec.ts`

**Steps:**
  1. GET /objects without query parameters and without authentication headers.
    - expect: The response is a JSON array of the predefined public sample objects.
    - expect: Each item has an id, name, and data property; data may be null or a JSON object as shown in the documentation.
    - expect: The documented sample IDs are represented and the endpoint does not expose unrelated users' private collection records.

#### 2.2. GET public object list filters by repeated id query parameters

**File:** `tests/api/public/objects-get.spec.ts`

**Steps:**
  1. GET /objects?id=3&id=5&id=10 without authentication headers; repeat using one known ID, a nonexistent ID, duplicate IDs, and a mixed known/nonexistent set.
    - expect: Only requested matching objects are returned when IDs are supplied; no other sample objects leak into the result.
    - expect: Repeated query parameters are accepted as documented.
    - expect: Empty or unmatched selections return an empty result or documented client error, never unrelated objects.

#### 2.3. GET public object by ID returns the requested record

**File:** `tests/api/public/objects-get.spec.ts`

**Steps:**
  1. GET /objects/7 without authentication headers, then GET another documented sample ID.
    - expect: The response is a single object whose id matches the path parameter and whose name/data fields match the requested object.
    - expect: The documented /objects/7 example includes the MacBook Pro 16 and its expected nested properties.

#### 2.4. GET public object by invalid or unknown ID handles lookup failure

**File:** `tests/api/public/objects-get.spec.ts`

**Steps:**
  1. GET /objects/{id} with a nonexistent ID and with malformed or encoded path values.
    - expect: The API does not return a different object's data for an invalid lookup.
    - expect: The status and error response are consistent with the API's not-found/validation behavior and are recorded by the test.

### 3. Public API automation — object CRUD writes

These write tests also run against the public API without an account, API key, or JWT. Use unique object names/data, capture returned IDs, verify state with public GET endpoints, and always clean up created objects.

**Seed:** `tests/seed.spec.ts`

#### 3.1. POST public object accepts flexible JSON and persists the created object

**File:** `tests/api/public/objects-crud.spec.ts`

**Steps:**
  1. POST /objects without authentication headers and with Content-Type application/json, using a unique name plus nested data containing strings, numbers, booleans, arrays, and nested objects; also exercise data:null or another valid JSON shape in a separate creation.
    - expect: The request succeeds and returns a generated id, the submitted name/data, and createdAt as shown in the documented response.
    - expect: A follow-up GET /objects/{returnedId} returns the created values.
    - expect: The endpoint accepts flexible valid JSON data without coercing types or losing nested properties.
  2. Repeat POST with a missing name, missing data, wrong top-level types, malformed JSON, and a non-JSON content type.
    - expect: Invalid requests fail with a client error and a useful error response.
    - expect: No partially created record is left behind for rejected requests.

#### 3.2. PUT public object completely replaces an existing object

**File:** `tests/api/public/objects-crud.spec.ts`

**Steps:**
  1. Create a unique public object without authentication headers, then PUT /objects/{id} with a new name and a deliberately smaller data object, also without authentication headers.
    - expect: The PUT response identifies the same id and includes the submitted replacement values and updatedAt.
    - expect: A subsequent GET confirms omitted old properties were removed, verifying full replacement rather than merge.
    - expect: An update to an unknown ID follows the documented existing-object contract and does not silently create an unrelated record.
  2. Repeat PUT with missing required fields, malformed JSON, and a non-JSON content type.
    - expect: Invalid replacement payloads are rejected and the previously stored object remains unchanged.

#### 3.3. PATCH public object changes supplied fields and preserves the rest

**File:** `tests/api/public/objects-crud.spec.ts`

**Steps:**
  1. Create a unique object without authentication headers, then PATCH /objects/{id} with only a new name and verify through unauthenticated GET.
    - expect: The response contains the updated name and updatedAt.
    - expect: Fields omitted from the PATCH body, including the original data object, remain unchanged.
  2. PATCH a data property, PATCH a field to null, and send an empty object and invalid scalar/malformed bodies in separate requests.
    - expect: Only supplied fields are changed according to the API's partial-update semantics.
    - expect: Invalid bodies are rejected; empty-patch behavior is recorded without assuming undocumented semantics.

#### 3.4. DELETE public object removes it and handles repeated deletion

**File:** `tests/api/public/objects-crud.spec.ts`

**Steps:**
  1. Create a unique object without authentication headers, DELETE /objects/{id} without authentication headers, and then GET the same id; repeat DELETE for that id and try a never-existing id.
    - expect: The initial delete returns the documented deletion message referring to the deleted id.
    - expect: The deleted object is no longer retrievable.
    - expect: Repeated and unknown-ID deletes return an appropriate error/not-found result and do not delete any other record.

### 4. Registration and login APIs

**Seed:** `tests/seed.spec.ts`

#### 4.1. POST register creates a user and returns a usable JWT

**File:** `tests/api/auth/register.spec.ts`

**Steps:**
  1. With a valid x-api-key and JSON content type, POST /register using a unique valid email, password, and name; do not log credentials or token.
    - expect: The response includes token, tokenType Bearer, expiresIn (default 3600 seconds when omitted), and a user with id, email, and name.
    - expect: The token is a non-empty JWT and can be used for a protected request as Authorization: Bearer <token> when auth-type=jwt is specified.
  2. Register another unique account with expires-in set to a valid positive duration and inspect the response.
    - expect: The returned expiresIn reflects the requested lifetime and the issued token can be used during its validity period.

#### 4.2. POST register validates credentials and duplicate accounts

**File:** `tests/api/auth/register.spec.ts`

**Steps:**
  1. Try registration with a duplicate email, missing email/password/name, invalid email, empty values, wrong field types, malformed JSON, and unsupported content type.
    - expect: Invalid registrations receive an error response and do not issue a usable token or create a duplicate account.
    - expect: A valid existing account remains able to log in.

#### 4.3. POST register validates token lifetime and accepts documented status override

**File:** `tests/api/auth/register.spec.ts`

**Steps:**
  1. Exercise expires-in with omitted, valid positive, zero, negative, and nonnumeric values; separately request numeric status=401 and symbolic status=NOT_FOUND.
    - expect: Omitted lifetime uses the documented 3600-second default; supported valid values produce a token with the requested expiration.
    - expect: Invalid lifetime values are rejected or handled consistently without creating an unexpectedly long-lived token; record exact behavior.
    - expect: status overrides return the requested response status and a matching response format as documented.

#### 4.4. POST login authenticates a registered user and issues a JWT

**File:** `tests/api/auth/login.spec.ts`

**Steps:**
  1. Register or use an isolated existing user, then POST /login with valid email/password and the required headers.
    - expect: The response includes token, tokenType Bearer, expiresIn, and the user's id, email, and name.
    - expect: The returned JWT authorizes an auth-type=jwt request during its validity period.

#### 4.5. POST login rejects invalid credentials and malformed requests

**File:** `tests/api/auth/login.spec.ts`

**Steps:**
  1. Try an unknown email, wrong password, missing email/password, empty fields, wrong field types, malformed JSON, missing API key, and invalid API key.
    - expect: Invalid credentials and malformed or unauthorized requests do not return an authenticated token.
    - expect: Error responses do not disclose whether a password is correct or expose stored secrets.

#### 4.6. POST login supports token lifetime and status override parameters

**File:** `tests/api/auth/login.spec.ts`

**Steps:**
  1. Request login with a valid expires-in value and separately test status=401 and status=NOT_FOUND in numeric and symbolic forms.
    - expect: The valid token reports the requested lifetime.
    - expect: Each supported status override is reflected in the HTTP status and corresponding response format.

### 5. Authenticated collection and object read APIs

**Seed:** `tests/seed.spec.ts`

#### 5.1. GET collections lists collection names and object counts

**File:** `tests/api/auth/collections-get.spec.ts`

**Steps:**
  1. GET /collections with a valid x-api-key, first using default auth-type and then auth-type=jwt with a valid token.
    - expect: The response is a JSON array of collection metadata with collectionName and objectCount.
    - expect: The authenticated user's collections/counts are returned and are not shared with a different test account.
    - expect: Both documented authentication modes behave as documented.
  2. Repeat without the API key, with an invalid key, and with auth-type=jwt but no token, malformed token, or expired token.
    - expect: Unauthorized requests are rejected and do not disclose collection metadata.

#### 5.2. GET collection objects lists only the selected collection

**File:** `tests/api/auth/collections-get.spec.ts`

**Steps:**
  1. Create multiple uniquely named objects in one owned collection and at least one object in a second collection; GET /collections/{collectionName}/objects.
    - expect: The response is an array of objects with id, name, and data; only objects in the requested collection are returned.
    - expect: An automatically created collection appears in GET /collections with an updated object count.

#### 5.3. GET collection objects filters IDs and paginates with limit and offset

**File:** `tests/api/auth/collections-get.spec.ts`

**Steps:**
  1. GET a populated collection with repeated id parameters; then use limit alone, offset alone, and limit plus offset across multiple pages.
    - expect: ID filters return only requested matching objects and support repeated query parameters.
    - expect: limit bounds the result count and offset skips the expected prior records; adjacent pages do not overlap and together cover the expected records.
    - expect: Zero, negative, nonnumeric, very large, and out-of-range limit/offset values are handled safely without server errors or unintended data exposure.

#### 5.4. GET single collection object returns the requested record only

**File:** `tests/api/auth/collections-get.spec.ts`

**Steps:**
  1. GET /collections/{collectionName}/objects/{id} for a created object, an object belonging to a different collection, an unknown id, and an unknown collection.
    - expect: A valid lookup returns the matching id, name, and data only.
    - expect: Cross-collection and unknown-resource lookups do not expose unrelated objects and return appropriate not-found/validation behavior.

### 6. Authenticated collection and object write APIs

**Seed:** `tests/seed.spec.ts`

#### 6.1. POST creates an object and auto-creates a missing collection

**File:** `tests/api/auth/collections-crud.spec.ts`

**Steps:**
  1. POST /collections/{uniqueCollection}/objects with required x-api-key, JSON content type, and name/data fields; use flexible nested JSON data.
    - expect: The response includes generated id, submitted name/data, and createdAt.
    - expect: The object is retrievable by its collection and id.
    - expect: The previously absent collection is created automatically and appears in GET /collections.
  2. Repeat POST with missing required fields, malformed JSON, invalid content type, missing/invalid API key, and an explicit auth-type=jwt request with missing/invalid credentials.
    - expect: Rejected requests do not create a record or collection.
    - expect: JWT-protected access requires a valid token, while default auth-type behavior matches the documentation.

#### 6.2. PUT replaces an authenticated collection object completely

**File:** `tests/api/auth/collections-crud.spec.ts`

**Steps:**
  1. Create an object with multiple fields and PUT its collection/id route with a smaller replacement body.
    - expect: The response has the same id, replacement name/data, and updatedAt.
    - expect: A subsequent GET verifies omitted properties were removed.
    - expect: The replacement affects only the caller's collection.
  2. Try an unknown id, a different user's collection, missing required body fields, malformed JSON, and invalid API/JWT credentials.
    - expect: The API does not create or alter unrelated resources and rejects invalid or unauthorized attempts.

#### 6.3. PATCH partially updates an authenticated collection object

**File:** `tests/api/auth/collections-crud.spec.ts`

**Steps:**
  1. Create an object with multiple fields and PATCH only its name, then GET the object.
    - expect: The response contains updatedAt and the new name.
    - expect: Unspecified fields and nested data remain unchanged.
  2. Patch a nested data value and test null values, an empty object, unknown id/collection, invalid body, missing API key, and invalid JWT when auth-type=jwt.
    - expect: Valid supplied values are applied without replacing unrelated fields.
    - expect: Invalid and unauthorized requests do not mutate data; undocumented empty/null semantics are recorded.

#### 6.4. DELETE removes an authenticated object from its collection

**File:** `tests/api/auth/collections-crud.spec.ts`

**Steps:**
  1. Create an object, DELETE its collection/id route, and then GET it and list the collection.
    - expect: The response includes the documented deletion message and correct id.
    - expect: The object is absent from subsequent reads and the collection count is decremented.
    - expect: Repeating delete, deleting an unknown id, and attempting to delete another user's object cannot remove unrelated data.

#### 6.5. Keep two authenticated users' collections isolated

**File:** `tests/api/auth/collections-crud.spec.ts`

**Steps:**
  1. Using two isolated API-key/account fixtures, create objects with the same collection name in each account, then list, read, update, and delete using each account in turn.
    - expect: Each account sees and mutates only its own collection records.
    - expect: IDs and matching collection names do not bypass account ownership boundaries.

### 7. Authenticated status overrides, token expiry, and quotas

**Seed:** `tests/seed.spec.ts`

#### 7.1. Apply documented status overrides across authenticated endpoint methods

**File:** `tests/api/auth/status-override.spec.ts`

**Steps:**
  1. On safe GET requests and isolated disposable resources, try status as a numeric code and standard symbolic name, including 401 and NOT_FOUND; test a representative 2xx override and invalid/unrecognized values.
    - expect: Supported override values set the HTTP status and matching body format as documented.
    - expect: Invalid override values are rejected or safely ignored; exact behavior is captured.
    - expect: For POST/PUT/PATCH/DELETE, compare resource state before and after an override so simulated responses do not cause unobserved test data changes; clean up regardless of response.

#### 7.2. Honor JWT expiration and authentication mode

**File:** `tests/api/auth/status-override.spec.ts`

**Steps:**
  1. Use a token with a short expires-in duration for an auth-type=jwt request before expiry and again after expiry; compare with auth-type=none and invalid auth-type values.
    - expect: A valid unexpired JWT permits the documented protected request.
    - expect: Expired or invalid JWTs are rejected for auth-type=jwt.
    - expect: auth-type=none remains unauthenticated as documented; invalid parameter behavior is recorded without granting extra access.

#### 7.3. Respect documented daily API request quotas without exhausting shared accounts

**File:** `tests/api/limits/request-quotas.spec.ts`

**Steps:**
  1. In a controlled environment, observe available quota/rate-limit headers or use a dedicated account to test the documented 50 daily public and 100 daily authenticated request allowances; avoid consuming shared production quota.
    - expect: Quota behavior is consistent with the documented daily limits/reset period, or the absence of quota metadata is recorded for clarification.
    - expect: Rate-limited requests return a clear failure and do not appear as successful API responses.
