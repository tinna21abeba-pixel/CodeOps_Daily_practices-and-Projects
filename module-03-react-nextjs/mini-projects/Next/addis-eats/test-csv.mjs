import assert from "node:assert/strict";
import { escapeCsv, ordersToCsv } from "./lib/csv.js";

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }
  result.push(current);
  return result;
}

const valueWithComma = "Bole, Addis Ababa";
const escapedComma = escapeCsv(valueWithComma);
assert.equal(escapedComma, '"Bole, Addis Ababa"');

const valueWithQuote = 'Special "Fast" Service';
const escapedQuote = escapeCsv(valueWithQuote);
assert.equal(escapedQuote, '"Special ""Fast"" Service"');

const valueWithBoth = 'Extra "hot" pepper, please';
const escapedBoth = escapeCsv(valueWithBoth);
assert.equal(escapedBoth, '"Extra ""hot"" pepper, please"');

const testOrders = [
  {
    id: "ORD-TEST-1",
    createdAt: "2026-10-13T10:00:00.000Z",
    name: 'Abebe "The Runner" Bikila',
    items: [{ quantity: 2, name: "Kitfo, Special" }],
    neighbourhood: "Bole",
    address: "Bole, Addis Ababa",
    status: "delivered",
    total: 700,
    note: 'Customer said: "Leave at door, please"',
  },
];

const csvOutput = ordersToCsv(testOrders);
const lines = csvOutput.split(/\r?\n/).filter(Boolean);

assert.equal(lines.length, 2);

const headerCols = parseCsvLine(lines[0]);
assert.equal(headerCols[0], "Order ID");

const dataCols = parseCsvLine(lines[1]);
assert.equal(dataCols[0], "ORD-TEST-1");
assert.equal(dataCols[2], 'Abebe "The Runner" Bikila');
assert.equal(dataCols[3], "2x Kitfo, Special");
assert.equal(dataCols[5], "Bole, Addis Ababa");
assert.equal(dataCols[9], 'Customer said: "Leave at door, please"');

console.log("CSV Export tests passed successfully!");
console.log("Verified comma escaping:", escapedComma);
console.log("Verified quotation mark escaping:", escapedQuote);
console.log("Verified combined awkward value escaping:", escapedBoth);
console.log("Verified round-trip CSV parsed values match exactly.");
