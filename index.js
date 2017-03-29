// Check for Issues and PRs to lock every hour
const INTERVAL = 60 * 60 * 1000;

module.exports = async robot => {
  // Check for lockables startup
  check();

  setInterval(check, INTERVAL);

  async function check() {
  }
};
