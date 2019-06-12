import { test, runIfMain } from "https://deno.land/x/testing/mod.ts";
import { assertEquals } from "https://deno.land/x/testing/asserts.ts";
import { md5 } from "./mod.ts";

interface TestVector {
  msg: Uint8Array;
  hash: Uint8Array;
}

function hex2buf(hex: string): Uint8Array {
  const len: number = hex.length;
  if (len % 2 || !/^[0-9a-fA-F]*$/.test(hex)) {
    throw new TypeError("Invalid hex string.");
  }
  hex = hex.toLowerCase();
  const buf: Uint8Array = new Uint8Array(Math.floor(len / 2));
  const end: number = len / 2;
  for (let i: number = 0; i < end; ++i) {
    buf[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return buf;
}

const testVectors: TestVector[] = JSON.parse(
  new TextDecoder().decode(Deno.readFileSync("./test_vectors.json"))
).map(
  ({ msg, hash }: { msg: string; hash: string }): TestVector => ({
    msg: hex2buf(msg),
    hash: hex2buf(hash)
  })
);

testVectors.forEach(
  ({ msg, hash }: TestVector, i: number): void => {
    test({
      name: `MD5 ${i}`,
      fn(): void {
        assertEquals(md5(msg), hash);
      }
    });
  }
);

runIfMain(import.meta, { parallel: true });
