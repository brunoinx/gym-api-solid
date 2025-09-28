export class PermissionsInvalidError extends Error {
  constructor() {
    super('Administrators cannot create check-ins.');
  }
}

export class PermissionsRestrictedError extends Error {
  constructor() {
    super('Only administrators can access this resource.');
  }
}
