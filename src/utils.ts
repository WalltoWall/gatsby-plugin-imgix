export function invariant(condition: any, msg?: string): asserts condition {
  if (!condition) throw new Error(`Invariant failed: ${msg}`)
}
