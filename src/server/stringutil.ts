export function maskEmail(email: string) {
    return email.replace(/^(.)(.*)(.@.*)$/, (_, a, b, c) => a + b.replace(/./g, '*') + c);
}