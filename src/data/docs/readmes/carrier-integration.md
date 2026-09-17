# UPS Integration Service

Carrier Integration Service for fetching shipping rate quotes through carrier-specific adapters (currently UPS) using a unified API contract.

## Local Setup

### 1. Start Infrastructure

```bash
docker compose up -d
```

Starts PostgreSQL (`5432`) and Redis (`6379`) in the background.

To reset infrastructure and clear all data later:

```bash
docker compose down -v && docker compose up -d
```

`-v` removes volumes, which clears database data and Redis queues.

### 2. Configure Environment

From `apps/server`:

```bash
cp .env.example .env
```

Update UPS-specific variables in `apps/server/.env`:

```env
UPS_CLIENT_ID=ups-client-id
UPS_CLIENT_SECRET=ups-client-secret
UPS_MERCHANT_ID=ups-merchant-id
UPS_CLIENT_CREDENTIALS_ENDPOINT=https://wwwcie.ups.com/security/v1/oauth/token
UPS_RATING_ENDPOINT=https://wwwcie.ups.com/api/rating/v2409
```

### 3. Install Dependencies

From repository root:

```bash
pnpm install
```

Installs all project dependencies.

### 4. Run Database Migrations

From repository root:

```bash
npx nx migration:deploy server
```

Creates database schemas and tables in PostgreSQL.

### 5. Start Application

From repository root:

```bash
npx nx start server
```

Server starts at `http://localhost:3000`.
Swagger docs are available at `http://localhost:3000/v1/swagger`.

<img width="1928" height="925" alt="Screenshot 2026-02-08 at 12 53 49 PM" src="https://github.com/user-attachments/assets/202b503c-ab74-4c4b-b093-00535979bfb2" />


### 6. Run Tests

Run the UPS rate service spec:

```bash
npx nx test server --testPathPatterns="ups-rate.service.spec"
```



https://github.com/user-attachments/assets/5e197c68-50d6-44bd-90cc-e2100792c8b3


## Access Points

- Application: `http://localhost:3000`
- Health Check: `http://localhost:3000/v1/health`
- Redis UI: `http://localhost:8001`


## Design Decisions

### 1. Architecture and Extensibility

- Carrier integrations are isolated per module (`UPSModule`) and registered at startup through registries.
- `RatesRegistryService` resolves rate providers by `name`, so the controller is carrier-agnostic.
- `OAuthRegistryService` does the same for OAuth providers.
- To add FedEx, implement `FedExRateService extends AbstractRateService` and `FedExOAuthService extends AbstractOAuthService`, register them in a `FedExModule`, and call `registerService` on module init. Existing UPS code does not need to be modified.

### 2. Types and Domain Modeling

- Internal API contracts use unified DTOs (`GetShippingRatesRequestDto`, `RateQuotesResponseDto`).
- Carrier-specific payloads use integration DTOs (`UPSRateRequestDto`).
- `@TransformRequestPayload(UPSRateRequestDto)` creates a clear boundary between internal domain models and UPS wire format.
- Service-code translation is centralized in mapping files (`UNIFIED_TO_UPS_SERVICE_CODE`, `UPS_TO_UNIFIED_SERVICE_CODE`), keeping mapping logic out of controller/service orchestration paths.

### 3. OAuth Implementation

- `UPSOAuthService` encapsulates the complete token lifecycle.
- It reads credentials/endpoints from config on module init.
- It reuses cached tokens when available.
- It exchanges client credentials when cache miss occurs.
- It persists token and expiry in database/cache through `CarrierService`.
- It enables Redis keyspace/keyevent notifications (`notify-keyspace-events=KEx`) and listens for token-key expiry events.
- Token cache TTL is set with a 120-second refresh buffer, so refresh is triggered around 2 minutes before real token expiry.
- `UPSRateService` only calls `getAccessToken()`, so token management remains transparent to the rate-calling flow.

### 4. Error Handling

- UPS HTTP errors are mapped to actionable framework exceptions.
- `400 -> BadRequestException`
- `401 -> UnauthorizedException`
- `403 -> ForbiddenException`
- `429 -> HttpException(TOO_MANY_REQUESTS)`
- Unknown Axios statuses, timeout/no-response Axios errors, and non-Axios errors are re-thrown as-is to avoid swallowing failures.

### 5. Integration Test Strategy

- The UPS integration spec is stubbed end-to-end at service level (no real UPS calls).
- Tests verify request transformation from unified model to UPS request body.
- Tests verify endpoint selection (`/Rate` vs `/Shop`).
- Tests verify authorization header/token usage.
- Tests verify response parsing for single and multiple `RatedShipment` shapes.
- Tests verify monetary string-to-number conversion.
- Tests verify service code mapping behavior.
- Tests verify error mapping and passthrough behavior.
- Fixture-based test data (`fixtures/*.ts`) keeps request/response/error scenarios deterministic and reusable.

### 6. Code Quality and Readability

- Responsibility is split by concern (controller, registry, OAuth service, rate service, DTOs, maps, fixtures).
- Naming follows intent-revealing conventions (`getShippingRates`, `exchangeCredentialsForToken`, `listenForTokenExpiry`).
- TypeScript types are used across request/response contracts and abstract service interfaces.
- Comments are used where intent or test scope needs clarification (especially fixtures and integration spec setup).

## Improvements (Next Iterations)

- **Token refresh concurrency control**: if a token expires during high traffic, multiple requests can trigger parallel token exchanges. We should add a lock/single-flight strategy (for example, Redis distributed lock per `provider + clientId`) so only one request performs token exchange while others wait and reuse the refreshed token.
- **Access token storage hardening**: access tokens are currently stored as plain text in persistence/cache. This should be changed to stored encrypt version.
- **Tenant-provided carrier credentials (real-world onboarding)**: currently `UPS_CLIENT_ID` and `UPS_CLIENT_SECRET` are static app-level env vars, but in production customer can have their own credentials. This requires tenant-scoped credential storage (encrypted), APIs/UI for customers to connect their carrier account, runtime credential resolution by tenant/company, token/cache keys scoped by `provider + tenant + clientId`, and OAuth/rate services updated to fetch credentials dynamically per request instead of from global env.
- **Centralized integration HTTP error handling**: status-to-exception mapping is currently repeated in each integration service. We should extract a shared HTTP error mapper/wrapper so all carriers use one consistent mapping strategy for Axios/network/upstream errors.
- **UPS response defensive validation before mapping**: validate UPS response shape (for example, `RateResponse`, `RatedShipment`, `TotalCharges`, `TransportationCharges`) before mapping to unified DTOs in `ups-rate.service.ts`. `App` response interceptors validate our outbound unified schema, but they do not protect the inbound external carrier payload parsing path.

## Adding a New Carrier (Boilerplate)

Use UPS as the reference pattern. The goal is to plug in a new carrier without modifying existing UPS logic.

### 1. Create module structure

Create:

- `apps/server/src/modules/integration/fedex/fedex.module.ts`
- `apps/server/src/modules/integration/fedex/services/fedex-rate.service.ts`
- `apps/server/src/modules/integration/fedex/services/fedex-oauth.service.ts`
- `apps/server/src/modules/integration/fedex/dtos/fedex-rate-request.dto.ts`
- `apps/server/src/modules/integration/fedex/maps/fedex-service-code.map.ts`

### 2. Implement carrier module and registry registration

```ts
@Module({
  imports: [HttpModule, RedisModule, CarrierModule],
  providers: [FedExOAuthService, FedExRateService],
  exports: [FedExRateService],
})
export class FedExModule implements OnModuleInit {
  constructor(
    private readonly oauthRegistryService: OAuthRegistryService,
    private readonly ratesRegistryService: RatesRegistryService,
    private readonly fedExOAuthService: FedExOAuthService,
    private readonly fedExRateService: FedExRateService
  ) {}

  async onModuleInit() {
    this.oauthRegistryService.registerService(this.fedExOAuthService);
    this.ratesRegistryService.registerService(this.fedExRateService);
  }
}
```

### 3. Implement OAuth service (token lifecycle)

```ts
@Injectable()
export class FedExOAuthService
  extends AbstractOAuthService<FedExOAuthResponseDto>
  implements OnModuleInit
{
  readonly name = 'fedex';

  async onModuleInit() {
    // Load config values here.
    await this.listenForTokenExpiry();
  }

  protected async getClientCredentialsEndpoint(): Promise<string> {
    return 'https://example-fedex/oauth/token';
  }

  protected async exchangeCredentialsForToken(): Promise<FedExOAuthResponseDto> {
    // Call provider OAuth endpoint and return token payload.
    return new FedExOAuthResponseDto();
  }

  protected async listenForTokenExpiry(): Promise<void> {
    // Subscribe to expiry events and refresh token.
  }

  async getAccessToken(): Promise<string> {
    // Cache-first: if miss, fetch token and persist with expiry.
    return 'token';
  }
}
```

### 4. Implement rate service with request transformation

```ts
@Injectable()
export class FedExRateService extends AbstractRateService<FedExRateRequestDto> {
  readonly name = 'fedex';

  constructor(private readonly fedExOAuthService: FedExOAuthService) {
    super();
  }

  @TransformRequestPayload(FedExRateRequestDto)
  async getShippingRates(
    shipment: FedExRateRequestDto
  ): Promise<RateQuotesResponseDto> {
    const token = await this.fedExOAuthService.getAccessToken();
    // Call FedEx API and map response to unified quote format.
    return { quotes: [] };
  }
}
```

### 5. Wire integration module

Add `FedExModule` to `apps/server/src/modules/integration/integration.module.ts` imports/exports.

### 6. Add environment variables

Add carrier-specific keys to `apps/server/.env.example`. Example:

```env
FEDEX_CLIENT_ID=fedex-client-id
FEDEX_CLIENT_SECRET=fedex-client-secret
FEDEX_CLIENT_CREDENTIALS_ENDPOINT=https://apis.fedex.com/oauth/token
FEDEX_RATING_ENDPOINT=https://apis.fedex.com/rate/v1/rates/quotes
```

### 7. Add test fixtures and integration spec

Mirror the UPS pattern:

- `services/__tests__/fixtures/fedex-rate-request.fixture.ts`
- `services/__tests__/fixtures/fedex-rate-response.fixture.ts`
- `services/__tests__/fixtures/fedex-error.fixture.ts`
- `services/__tests__/fedex-rate.service.spec.ts`

Run:

```bash
npx nx test server --testPathPatterns="fedex-rate.service.spec"
```

