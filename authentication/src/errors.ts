export class ErrorUnauthorizedAuthenticationHeader extends Error {
  constructor() {
    super("Unauthorized authentication header");
  }
}
