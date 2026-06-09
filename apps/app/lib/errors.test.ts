import { describe, expect, it } from "vitest";
import {
  getErrorMessage,
  getErrorStatus,
  isForbiddenError,
  isUnauthenticatedError,
} from "./errors";

describe("getErrorStatus", () => {
  it("returns undefined for non-objects", () => {
    expect(getErrorStatus(null)).toBeUndefined();
    expect(getErrorStatus(undefined)).toBeUndefined();
    expect(getErrorStatus("string")).toBeUndefined();
    expect(getErrorStatus(123)).toBeUndefined();
  });

  it("extracts direct status property", () => {
    expect(getErrorStatus({ status: 401 })).toBe(401);
    expect(getErrorStatus({ status: 500 })).toBe(500);
  });

  it("ignores non-numeric status", () => {
    expect(getErrorStatus({ status: "401" })).toBeUndefined();
    expect(getErrorStatus({ status: null })).toBeUndefined();
  });

  it("extracts nested response.status (axios-style)", () => {
    expect(getErrorStatus({ response: { status: 403 } })).toBe(403);
  });

  it("follows error cause chain", () => {
    const nested = { status: 401 };
    const wrapper = { cause: nested };
    expect(getErrorStatus(wrapper)).toBe(401);
  });

  it("handles deep cause chains", () => {
    const deep = { cause: { cause: { cause: { status: 500 } } } };
    expect(getErrorStatus(deep)).toBe(500);
  });

  it("handles circular cause references without stack overflow", () => {
    const circular: Record<string, unknown> = { status: undefined };
    circular.cause = circular;
    expect(getErrorStatus(circular)).toBeUndefined();
  });

  it("prefers direct status over nested", () => {
    expect(getErrorStatus({ status: 401, response: { status: 500 } })).toBe(
      401,
    );
  });
});

describe("getErrorMessage", () => {
  it("extracts message from Error instances", () => {
    expect(getErrorMessage(new Error("Something broke"))).toBe(
      "Something broke",
    );
  });

  it("returns string errors directly", () => {
    expect(getErrorMessage("Direct error message")).toBe(
      "Direct error message",
    );
  });

  it("extracts statusText from Response-like objects", () => {
    expect(getErrorMessage({ statusText: "Not Found" })).toBe("Not Found");
  });

  it("returns fallback for unknown error shapes", () => {
    expect(getErrorMessage(null)).toBe("An unexpected error occurred");
    expect(getErrorMessage(undefined)).toBe("An unexpected error occurred");
    expect(getErrorMessage({})).toBe("An unexpected error occurred");
    expect(getErrorMessage({ statusText: "" })).toBe(
      "An unexpected error occurred",
    );
  });
});

describe("isUnauthenticatedError", () => {
  it("returns true for 401 status", () => {
    expect(isUnauthenticatedError({ status: 401 })).toBe(true);
  });

  it("returns false for 403 status (authorization, not authentication)", () => {
    expect(isUnauthenticatedError({ status: 403 })).toBe(false);
  });

  it("returns false for other status codes", () => {
    expect(isUnauthenticatedError({ status: 500 })).toBe(false);
    expect(isUnauthenticatedError({ status: 404 })).toBe(false);
  });

  it("returns false for non-error values", () => {
    expect(isUnauthenticatedError(null)).toBe(false);
    expect(isUnauthenticatedError("error")).toBe(false);
    expect(isUnauthenticatedError({})).toBe(false);
  });

  it("detects 401 in nested cause", () => {
    expect(isUnauthenticatedError({ cause: { status: 401 } })).toBe(true);
  });

  it("returns true for tRPC UNAUTHORIZED code", () => {
    expect(isUnauthenticatedError({ data: { code: "UNAUTHORIZED" } })).toBe(
      true,
    );
  });

  it("returns false for tRPC FORBIDDEN code", () => {
    expect(isUnauthenticatedError({ data: { code: "FORBIDDEN" } })).toBe(false);
  });
});

describe("isForbiddenError", () => {
  it("returns true for 403 status", () => {
    expect(isForbiddenError({ status: 403 })).toBe(true);
  });

  it("returns false for 401 status (authentication, not authorization)", () => {
    expect(isForbiddenError({ status: 401 })).toBe(false);
  });

  it("returns false for other status codes", () => {
    expect(isForbiddenError({ status: 500 })).toBe(false);
    expect(isForbiddenError({ status: 404 })).toBe(false);
  });

  it("returns false for non-error values", () => {
    expect(isForbiddenError(null)).toBe(false);
    expect(isForbiddenError("error")).toBe(false);
    expect(isForbiddenError({})).toBe(false);
  });

  it("detects 403 in nested cause", () => {
    expect(isForbiddenError({ cause: { status: 403 } })).toBe(true);
  });

  it("detects 403 in nested response (axios-style)", () => {
    expect(isForbiddenError({ response: { status: 403 } })).toBe(true);
  });

  it("returns true for tRPC FORBIDDEN code", () => {
    expect(isForbiddenError({ data: { code: "FORBIDDEN" } })).toBe(true);
  });

  it("returns false for tRPC UNAUTHORIZED code", () => {
    expect(isForbiddenError({ data: { code: "UNAUTHORIZED" } })).toBe(false);
  });
});
