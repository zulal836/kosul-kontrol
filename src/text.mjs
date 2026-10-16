export const normalize = s => s.normalize('NFKC').replace(/\s+/gu,' ').trim();
