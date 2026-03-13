// Background job worker
// Processes deal score recalculation, notification emails, etc.
console.log("Worker service started");

async function recalculateScores() {
  // Would recalculate hot scores periodically
}

setInterval(() => {
  recalculateScores().catch((err) => console.error("Score recalculation error:", err));
}, 60_000);
