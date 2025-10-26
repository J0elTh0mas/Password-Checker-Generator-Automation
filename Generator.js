function makeCharset(o) {
  let s = '';
  if (o.includeLower !== false) s += 'abcdefghijklmnopqrstuvwxyz';
  if (o.includeUpper !== false) s += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (o.includeDigits !== false) s += '0123456789';
  if (o.includeSymbols !== false) s += "!@#$%^&*()_+-=[]{}|;:',.<>/?`~\"";
  if (!s) s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return s;
}

function genOne(len, cs) {
  let out = '';
  for (let i = 0; i < len; i++) out += cs[Math.floor(Math.random() * cs.length)];
  return out;
}

const root = items[0]?.json || {};
const p = root.params || {};

// defaults + bounds
const generate = !!p.generate;
const count  = Math.min(Math.max(parseInt(p.count  ?? 5, 10) || 0, 0), 50);
const length = Math.min(Math.max(parseInt(p.length ?? 16, 10) || 16, 4), 128);

if (!generate || count === 0) {
  // pass through unchanged, with an empty suggestions array
  return [{ json: { ...root, suggestions: [] } }];
}

const charset = makeCharset({
  includeLower: p.includeLower !== false,
  includeUpper: p.includeUpper !== false,
  includeDigits: p.includeDigits !== false,
  includeSymbols: p.includeSymbols !== false,
});

const suggestions = Array.from({ length: count }, () => genOne(length, charset));

return [{
  json: {
    ...root,
    suggestions,
    generator: {
      count, length,
      includeLower: p.includeLower !== false,
      includeUpper: p.includeUpper !== false,
      includeDigits: p.includeDigits !== false,
      includeSymbols: p.includeSymbols !== false,
    }
  }
}];
