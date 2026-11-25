import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_ENTRY_CHARS = 200;

const ENTRY_LINE: string =
  "I took a mental health day, and my team got so much done without my meetings that HR asked if I could make it a mental health quarter.";

function validateEntry(text: string): void {
  const charCount: number = [...text].length;
  if (text.trim().length === 0 || charCount < 1 || charCount > MAX_ENTRY_CHARS || /[\r\n]/.test(text)) {
    throw new Error(`Invalid entry text: chars=${charCount}`);
  }
}

function resolveOutputDir(): string {
  const envDir: string | undefined = process.env.MAKEFUN_OUTPUT_DIR;
  return envDir !== undefined && envDir.trim().length > 0 ? envDir : "/output";
}

function main(): void {
  validateEntry(ENTRY_LINE);

  const outputDir: string = resolveOutputDir();
  const outputPath: string = join(outputDir, "entry.txt");
  const payload: Buffer = Buffer.from(ENTRY_LINE, "utf8");

  mkdirSync(outputDir, { recursive: true, mode: 0o755 });
  writeFileSync(outputPath, payload, { mode: 0o644 });
  chmodSync(outputPath, 0o644);
}

try {
  main();
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
