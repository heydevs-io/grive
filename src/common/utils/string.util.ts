import { findBestMatch, Rating } from 'string-similarity';

export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);

export const getBestMatch = (
  label: string,
  targetLabels: string[],
  threshold = 0.7,
): string => {
  const bestMatch = findBestMatch(label, targetLabels);
  const absoluteBestRating = bestMatch.ratings.find(
    (rating) => rating.target === label,
  );
  const finalRating: Rating = absoluteBestRating || bestMatch.bestMatch;

  if (finalRating.rating < threshold) {
    return '';
  }

  return finalRating.target;
};
