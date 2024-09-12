export class PublicError extends Error {
  constructor(message?: string) {
    super(message || "Something went wrong");
  }
}

export class AuthenticationError extends PublicError {
  constructor() {
    super("You must be logged in to view this content");
    this.name = "AuthenticationError";
  }
}

export class AccesssibilityError extends PublicError {
  constructor() {
    super("Access denied");
    this.name = "AcceessibilityError";
  }
}

export class EmailInUseError extends Error {
  constructor() {
    super("Email is already in use, please sign in");
    this.name = "EmailInUseError";
  }
}

export class NotFoundError extends PublicError {
  constructor() {
    super("Resource not found");
    this.name = "NotFoundError";
  }
}

export class VerifyCodeExpiredError extends PublicError {
  constructor() {
    super("Verify code has expired, do the sign up process again");
    this.name = "TokenExpiredError";
  }
}

export class LoginError extends PublicError {
  constructor() {
    super("Invalid email or password");
    this.name = "LoginError";
  }
}

export class TooManyRequest extends PublicError {
  constructor() {
    super("Too many requests");
    this.name = "TooManyRequest";
  }
}

export const returnError = (err: Error) => {
  if (
    err instanceof TooManyRequest ||
    err instanceof LoginError ||
    err instanceof VerifyCodeExpiredError ||
    err instanceof NotFoundError ||
    err instanceof EmailInUseError ||
    err instanceof AuthenticationError
  ) {
    throw new Error(err.message);
  }
  if (err instanceof PublicError) {
    throw new Error(err.message);
  }
  if (err instanceof Error) {
    throw new Error(err.message);
  }
};
