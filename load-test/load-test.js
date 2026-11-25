import { randomUUID } from "node:crypto";

const API_URL = "http://localhost:5000/api/submissions";

const TOTAL_REQUESTS = 100000;
const UNIQUE_REQUESTS = 80000;
const DUPLICATE_REQUESTS = 20000;

const CONCURRENCY = 100;

const runId = randomUUID();

let requestCounter = 0;

let successCount = 0;
let duplicateCount = 0;
let errorCount = 0;

const sendRequest = async (index) => {
  // First 80,000 requests use unique keys.
  // Last 20,000 reuse the first 20,000 keys.

  const keyIndex = index < UNIQUE_REQUESTS ? index : index - UNIQUE_REQUESTS;

  const idempotencyKey = `${runId}-${keyIndex}`;

  const payload = {
    form_id: "load-test-form",
    idempotency_key: idempotencyKey,
    email: `user${keyIndex}@example.com`,
    data: {
      name: `User ${keyIndex}`,
      message: "Load testing submission",
    },
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      errorCount++;
      return;
    }

    const result = await response.json();

    successCount++;

    if (result.isDuplicate === true) {
      duplicateCount++;
    }
  } catch (error) {
    errorCount++;
  }
};

const worker = async () => {
  while (true) {
    const index = requestCounter++;

    if (index >= TOTAL_REQUESTS) {
      break;
    }

    await sendRequest(index);
  }
};

const runLoadTest = async () => {
  console.log("Starting load test...");
  console.log(`Total requests: ${TOTAL_REQUESTS}`);
  console.log(`Concurrency: ${CONCURRENCY}`);

  const startTime = performance.now();

  const workers = Array.from({ length: CONCURRENCY }, () => worker());

  await Promise.all(workers);

  const endTime = performance.now();

  const duration = (endTime - startTime) / 1000;

  const throughput = TOTAL_REQUESTS / duration;

  console.log("\n========== LOAD TEST RESULTS ==========");

  console.log(`Total requests: ${TOTAL_REQUESTS}`);

  console.log(`Successful requests: ${successCount}`);

  console.log(`Unique submissions expected: ${UNIQUE_REQUESTS}`);

  console.log(`Duplicates correctly identified: ${duplicateCount}`);

  console.log(`Errors: ${errorCount}`);

  console.log(`Duration: ${duration.toFixed(2)} seconds`);

  console.log(`Throughput: ${throughput.toFixed(2)} requests/second`);

  console.log("=======================================");
};

runLoadTest();
