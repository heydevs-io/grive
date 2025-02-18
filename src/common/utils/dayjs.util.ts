import { DateFormat } from '@enums';
import dayjs, { ConfigType, Dayjs, OpUnitType } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import utc from 'dayjs/plugin/utc.js';
import _ from 'lodash';
// import app from '@adonisjs/core/services/app'
// import GoogleChatService from '#integration/google_chat/google_chat_service.js'
dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

export const parseFromJson: any = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('\n ==> ERROR [parseFromJson]:', e.message, '\n');
    return str;
  }
};

export function roundDecimalPrecision(
  number: number,
  fractionDigits: number,
): number {
  return Number.parseFloat(number.toFixed(fractionDigits));
}

export function formatNumber(
  number: number,
  isCurrency = true,
  locale = 'en-US',
  currency = 'SGD',
): string {
  const options: Intl.NumberFormatOptions = { currency, style: 'currency' };

  if (!isCurrency) {
    Object.assign(options, { style: 'decimal' });
  }

  return new Intl.NumberFormat(locale, options).format(number);
}

export const applyMixins = (baseClass: any, extendedClasses: any[]) => {
  extendedClasses.forEach((extendedClass) => {
    Object.getOwnPropertyNames(extendedClass.prototype).forEach((name) => {
      Object.defineProperty(
        baseClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(extendedClass.prototype, name) ||
          Object.create(null),
      );
    });
  });
};

export const stringifyAnObject = <T>(obj: T): string => {
  let result = '';
  try {
    result = JSON.stringify(obj);
  } catch (e) {
    result = JSON.stringify(obj, Object.getOwnPropertyNames(obj));
  }
  return result;
};

export const generateKeyByCount = (count: number) => {
  let id = '';

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  _.times(count, () => {
    id += s4();
  });

  return id;
};

export function roundToTwo(num: number) {
  return +(Math.round((num + 'e+2') as unknown as number) + 'e-2');
}

export function generateCID(cid?: string) {
  if (cid) return cid;
  const now = dayjs();
  return `vh-${now.format('YYYYMMDDHHmmssSSS')}-${Math.floor(
    Math.random() * 1000,
  )
    .toString()
    .padStart(3, '0')}`;
}

export function formatMilliseconds(ms: number) {
  return `${ms}ms`;
}

/**
 * @description convert time to utc and get time you want
 * @param unit positive numbers to add time and negative number to remove time
 * @param amount number time to increase or decrease
 * @returns @string
 */
export function getNewTime(
  amount: number,
  unit: dayjs.ManipulateType,
  date?: Date | string | Dayjs,
): string {
  return dayjs.utc(date).add(amount, unit).format(DateFormat.FULL_DATE_TIME);
}

export const getFilterData = <T extends Record<string, any>>(
  object: T,
  filter: (keyof T)[],
) => {
  return _.pick(object, filter);
};

export const getDeleteFilter = <T extends Record<string, any>>(
  object: T,
  filter: (keyof T)[],
) => {
  return _.omit(object, filter);
};

export const deleteKeyUndefined = <T extends Record<string, any>>(
  pros: T,
): T => {
  Object.keys(pros).forEach((key) => {
    if (pros[key] === undefined || pros[key] === null) delete pros[key];
  });
  return { ...pros };
};

export const parseSkipLimit = (
  skip?: any,
  limit?: any,
): { skip: number; limit: number } => {
  let localSkip = 0;
  let localLimit = 10;

  if (typeof skip !== 'number' || typeof skip !== 'string') localSkip = 0;
  if (typeof limit !== 'number' || typeof limit !== 'string') localLimit = 10;

  if (typeof skip === 'string' && !_.isNaN(Number(skip)))
    localSkip = Number(skip);
  if (typeof limit === 'string' && !_.isNaN(Number(limit)))
    localLimit = Number(limit) > 100 ? 100 : Number(limit);

  return { skip: localSkip, limit: localLimit };
};

export class DateJS {
  static isBetween(
    date: ConfigType,
    a: ConfigType,
    b: ConfigType,
    c?: OpUnitType | null,
    d?: '()' | '[]' | '[)' | '(]',
  ) {
    return dayjs.utc(date).isBetween(a, b, c, d);
  }

  static utc(date?: ConfigType) {
    return dayjs.utc(date);
  }
  static sameOrBefore(
    date: ConfigType,
    dateToCompare?: ConfigType,
    unit?: OpUnitType,
  ) {
    return dayjs.utc(date).isSameOrBefore(dateToCompare, unit);
  }
  static sameOrAfter(
    date: ConfigType,
    dateToCompare?: ConfigType,
    unit?: OpUnitType,
  ) {
    return dayjs.utc(date).isSameOrAfter(dateToCompare, unit);
  }

  static getStartOfDay(date: ConfigType, value = 0) {
    return dayjs(date).startOf('day').add(value, 'hour');
  }

  static getEndOfDay(date: ConfigType, value = 0) {
    return dayjs(date).endOf('day').add(value, 'hour');
  }
}

export function compareVersions(newVersion: string, oldVersion: string) {
  if (newVersion === oldVersion) return false;
  const newParts = newVersion.split('.').map(Number);
  const oldParts = oldVersion.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (newParts[i] === oldParts[i]) continue;
    if (newParts[i] < oldParts[i]) return false;
    return true;
  }
  return true;
}

//TODO NEED TO CHECK FUNCTION WORK ONLY WITH PRIMITIVE TYPE
export function getUnique<T>(arr: T[]) {
  const elementCount = new Map();

  // Count elements in array
  arr.forEach((item) => {
    elementCount.set(item, (elementCount.get(item) || 0) + 1);
  });

  const uniqueElements: T[] = [];
  elementCount.forEach((count, item) => {
    if (count === 1) {
      uniqueElements.push(item);
    }
  });

  return uniqueElements;
}
