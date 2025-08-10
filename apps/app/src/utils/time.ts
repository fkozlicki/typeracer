export function calculateSecondsFromNow(date: string) {
  const now = Date.now();
  const time = new Date(date).getTime();

  return Math.floor((time - now) / 1000);
}
