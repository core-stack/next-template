import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function main() {
  const cwd = process.cwd();
  fs.watch(path.join(cwd, "src", "routes"), { recursive: true }, () => {
    exec("pnpm generate:api");
  });
}

main()