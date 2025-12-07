// // Pure Levenshtein Distance (no libraries)
// export function levenshtein(a: string, b: string): number {
//   if (a === b) return 0;

//   const alen = a.length;
//   const blen = b.length;

//   if (alen === 0) return blen;
//   if (blen === 0) return alen;

//   const dp = Array.from({ length: alen + 1 }, () => new Array(blen + 1));

//   for (let i = 0; i <= alen; i++) dp[i][0] = i;
//   for (let j = 0; j <= blen; j++) dp[0][j] = j;

//   for (let i = 1; i <= alen; i++) {
//     for (let j = 1; j <= blen; j++) {
//       const cost = a[i - 1] === b[j - 1] ? 0 : 1;
//       dp[i][j] = Math.min(
//         dp[i - 1][j] + 1, // deletion
//         dp[i][j - 1] + 1, // insertion
//         dp[i - 1][j - 1] + cost // substitution
//       );
//     }
//   }

//   return dp[alen][blen];
// }

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;

  const alen = a.length;
  const blen = b.length;

  if (alen === 0) return blen;
  if (blen === 0) return alen;

  let prev = new Array(blen + 1);
  let curr = new Array(blen + 1);

  for (let j = 0; j <= blen; j++) prev[j] = j;

  for (let i = 1; i <= alen; i++) {
    curr[0] = i;

    for (let j = 1; j <= blen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      curr[j] = Math.min(
        prev[j] + 1, // delete
        curr[j - 1] + 1, // insert
        prev[j - 1] + cost // substitute
      );
    }

    [prev, curr] = [curr, prev];
  }

  return prev[blen];
}
