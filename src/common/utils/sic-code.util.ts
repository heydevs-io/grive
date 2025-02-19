import sicCodes from '../constants/sic-codes.json';
import { BusinessType } from '../enums';

export interface SicCodeMap {
  [category: string]: {
    [code: string]: string;
  };
}

export interface SicCode {
  code: string;
  title: string;
  category: BusinessType;
}

export function getSicCodesByCategory(category: string): SicCode[] {
  return Object.entries((sicCodes as SicCodeMap)[category]).map(
    ([code, title]) => ({
      code,
      title,
      category: category as BusinessType,
    }),
  );
}

export function getSicCodeTitle(code: string): string | null {
  for (const category of Object.values(sicCodes as SicCodeMap)) {
    if (category[code]) {
      return category[code];
    }
  }
  return null;
}

export function getAllSicCodes(): SicCode[] {
  const codes: SicCode[] = [];
  Object.entries(sicCodes as SicCodeMap).forEach(
    ([category, categoryCodes]) => {
      Object.entries(categoryCodes).forEach(([code, title]) => {
        codes.push({
          code,
          title,
          category: category as BusinessType,
        });
      });
    },
  );
  return codes;
}
