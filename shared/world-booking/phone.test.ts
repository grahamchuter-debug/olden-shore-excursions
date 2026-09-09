/**
 * O-12 phone normalisation / E.164 helpers.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  composeE164Phone,
  DEFAULT_PHONE_DIAL_CODE,
  isE164Phone,
  nationalPhoneDigits,
  validateInternationalPhone,
} from "./phone";
import { validateCustomer } from "./validate";

test("composeE164Phone builds UK mobile from dial + national trunk zero", () => {
  assert.equal(composeE164Phone("+44", "07700900123"), "+447700900123");
  assert.equal(nationalPhoneDigits("07700 900 123"), "7700900123");
});

test("composeE164Phone accepts pasted full international in national field", () => {
  assert.equal(composeE164Phone("+47", "+1 (212) 555-0100"), "+12125550100");
});

test("composeE164Phone rejects incomplete values", () => {
  assert.equal(composeE164Phone("+44", "77"), null);
  assert.equal(composeE164Phone("44", "7700900123"), null);
});

test("DEFAULT_PHONE_DIAL_CODE is Norway for Olden site context", () => {
  assert.equal(DEFAULT_PHONE_DIAL_CODE, "+47");
});

test("validateCustomer requires E.164 Mobile / WhatsApp", () => {
  assert.equal(
    validateCustomer({ name: "Alex Traveller", email: "alex@example.com", phone: "+447700900123" }),
    null,
  );
  assert.ok(validateCustomer({ name: "Alex Traveller", email: "alex@example.com", phone: "07700900123" }));
  assert.ok(validateInternationalPhone("7700900123"));
  assert.equal(isE164Phone("+447700900123"), true);
});
