// Background job worker
// Processes deal score recalculation, notification emails, etc.
console.log("Worker service started");

async function recalculateScores() {
  // Would recalculate hot scores periodically
}

setInterval(recalculateScores, 60_000);
