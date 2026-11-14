import { describe, expect, it } from "vitest";
import { findEmailProblem, findPasswordProblem, findSignInCodeProblem } from "./auth-rules";

describe("email address", () => {
  it("accepts any valid address, not only practice addresses", () => {
    expect(findEmailProblem("thabo.nkosi@gmail.com")).toBeNull();
    expect(findEmailProblem("reception@dlaminipractice.co.za")).toBeNull();
  });

  it("rejects an empty or malformed address", () => {
    expect(findEmailProblem("")).toContain("Enter your email");
    expect(findEmailProblem("thabo@")).toContain("valid email");
  });
});

describe("password", () => {
  it("only has to be present when signing in", () => {
    expect(findPasswordProblem("short", "sign-in")).toBeNull();
    expect(findPasswordProblem("", "sign-in")).toContain("Enter your password");
  });

  it("must be at least 8 characters when creating an account", () => {
    expect(findPasswordProblem("short", "create-account")).toContain("at least 8");
    expect(findPasswordProblem("long-enough-1", "create-account")).toBeNull();
  });
});

describe("sign-in code", () => {
  it("accepts 6 digits, with or without a space", () => {
    expect(findSignInCodeProblem("123456")).toBeNull();
    expect(findSignInCodeProblem("123 456")).toBeNull();
  });

  it("rejects anything else", () => {
    expect(findSignInCodeProblem("12345")).toContain("6-digit");
    expect(findSignInCodeProblem("12345a")).toContain("6-digit");
  });
});
