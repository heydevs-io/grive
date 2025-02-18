export function formatSeconds(sec: number): string {
  // there are 86400 seconds in a day
  return new Date(sec * 1000).toISOString().substr(11, 8);
}

export function getMonthFromString(str: string): number | null {
  return !str ? null : new Date(str).getMonth() + 1;
}

export function getYearFromString(str: string): number | null {
  return !str ? null : new Date(str).getFullYear();
}
