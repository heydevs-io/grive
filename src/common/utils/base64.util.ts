export function encodeBase64(data: string): string {
  return Buffer.from(data).toString('base64');
}
