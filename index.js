const { EligibilityService } = require('./src/eligibility.service');

const cartFile = process.argv[2];
const profileFile = process.argv[3];
if (!cartFile || !profileFile) {
  console.error('Missing cart file.');
  console.error('Usage: node index.js [CART_FILE] [PROFILE_FILE]');
  process.exit(1);
}

let cart;
let profile;
try {
  cart = require(cartFile);
} catch (err) {
  console.error('Invalid cart file.');
  console.error('Usage: node index.js [CART_FILE] [PROFILE_FILE]');
  process.exit(2);
}

try {
  profile = require(profileFile);
} catch (err) {
  console.error('Invalid profile file.');
  console.error('Usage: node index.js [CART_FILE] [PROFILE_FILE]');
  process.exit(3);
}

const eligibilityService = new EligibilityService();
const isEligible = eligibilityService.isEligible(cart, profile);
console.log(`Cart Eligibility: ${isEligible}`);
