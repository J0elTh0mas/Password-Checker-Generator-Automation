// --- Common password list ---
const common = new Set([
  '123456','password','123456789','12345','12345678','qwerty','123123','111111',
  '1234','iloveyou','1q2w3e4r','000000','qwerty123','zaq12wsx','dragon','sunshine',
  'login','admin','welcome','football'
]);

// --- Analyzer function ---
function analyze(pw) {
  const length = (pw || '').length;
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /\d/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  const classes = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;
  const repeatedRun = /(.)\1{2,}/.test(pw);
  const inCommon = common.has((pw || '').toLowerCase());

  let pool = 0;
  if (hasLower) pool += 26;
  if (hasUpper) pool += 26;
  if (hasDigit) pool += 10;
  if (hasSymbol) pool += 33;
  const entropyBits = pw ? Math.round(length * Math.log2(Math.max(pool, 1))) : 0;

  let score = 0;
  const tips = [];
  if (!pw) {
    tips.push('Provide a password to analyze.');
    return { score: 0, verdict: 'empty', entropyBits, length, hasLower, hasUpper, hasDigit, hasSymbol, suggestions: tips };
  }
  if (inCommon) tips.push('This password appears in common lists—pick a unique one.');
  if (length < 12) tips.push('Use at least 12–16 characters.');
  if (classes < 3) tips.push('Mix upper/lowercase, digits, and symbols.');
  if (repeatedRun) tips.push('Avoid repeating a character 3+ times.');
  if (/^[A-Za-z]+$/.test(pw)) tips.push('Avoid all-letters—add digits/symbols.');
  if (/^[0-9]+$/.test(pw)) tips.push('Avoid all-digits—add letters/symbols.');

  if (inCommon || length < 8 || classes < 2) score = 1;
  else if (entropyBits < 40) score = 2;
  else if (entropyBits < 60) score = 3;
  else score = 4;

  const verdict = ['very-weak','weak','fair','good','strong'][Math.max(0, Math.min(score,4))];
  return { score, verdict, entropyBits, length, hasLower, hasUpper, hasDigit, hasSymbol, suggestions: tips };
}

// --- READ input from Webhook (supports both root and body) ---
const root = items[0]?.json ?? {};
const payload = (root.body && typeof root.body === 'object') ? root.body : root;

// --- Run analyzer ---
const pw = typeof payload.password === 'string' ? payload.password : '';
const analysis = analyze(pw);

// --- Strip the raw password before returning ---
const { password, ...safeParams } = payload;

return [{
  json: {
    params: safeParams,   // no password here
    analysis
  }
}];
