import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const publicSideDir = path.join(rootDir, 'public-side');
const adminSideDir = path.join(rootDir, 'admin-side');
const rootDistDir = path.join(rootDir, 'dist');
const rootAdminDistDir = path.join(rootDistDir, 'admin');

function runStep(description, command, cwd) {
  console.log(`\n========================================`);
  console.log(`[Step] ${description}`);
  console.log(`Command: ${command} (in ${cwd})`);
  console.log(`========================================\n`);

  const result = spawnSync(command, {
    cwd,
    stdio: 'inherit',
    shell: true,
  });

  if (result.error) {
    console.error(`\n[ERROR] Failed to execute step "${description}":`, result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`\n[ERROR] Step "${description}" failed with exit code ${result.status}`);
    process.exit(result.status || 1);
  }
}

try {
  // Step 1: Install and build public-side
  runStep('Install public-side dependencies', 'npm install', publicSideDir);
  runStep('Build public-side', 'npm run build', publicSideDir);

  // Step 2: Install and build admin-side
  runStep('Install admin-side dependencies', 'npm install', adminSideDir);
  runStep('Build admin-side', 'npm run build', adminSideDir);

  // Step 3: Delete root dist folder if it exists
  console.log(`\n========================================`);
  console.log(`[Step] Clean root dist directory`);
  console.log(`========================================\n`);
  if (fs.existsSync(rootDistDir)) {
    console.log(`Removing existing root dist directory: ${rootDistDir}`);
    fs.rmSync(rootDistDir, { recursive: true, force: true });
  }

  // Step 4: Copy public-side/dist into root dist/
  console.log(`\n========================================`);
  console.log(`[Step] Copy public-side/dist to root dist/`);
  console.log(`========================================\n`);
  const publicDistDir = path.join(publicSideDir, 'dist');
  if (!fs.existsSync(publicDistDir)) {
    console.error(`[ERROR] public-side dist directory not found at: ${publicDistDir}`);
    process.exit(1);
  }
  fs.mkdirSync(rootDistDir, { recursive: true });
  fs.cpSync(publicDistDir, rootDistDir, { recursive: true });
  console.log(`Copied ${publicDistDir} -> ${rootDistDir}`);

  // Step 5: Copy admin-side/dist into root dist/admin/
  console.log(`\n========================================`);
  console.log(`[Step] Copy admin-side/dist to root dist/admin/`);
  console.log(`========================================\n`);
  const adminDistDir = path.join(adminSideDir, 'dist');
  if (!fs.existsSync(adminDistDir)) {
    console.error(`[ERROR] admin-side dist directory not found at: ${adminDistDir}`);
    process.exit(1);
  }
  fs.mkdirSync(rootAdminDistDir, { recursive: true });
  fs.cpSync(adminDistDir, rootAdminDistDir, { recursive: true });
  console.log(`Copied ${adminDistDir} -> ${rootAdminDistDir}`);

  // Step 6: Confirm dist/index.html and dist/admin/index.html both exist
  console.log(`\n========================================`);
  console.log(`[Step] Verify build outputs`);
  console.log(`========================================\n`);
  const publicIndexFile = path.join(rootDistDir, 'index.html');
  const adminIndexFile = path.join(rootAdminDistDir, 'index.html');

  if (!fs.existsSync(publicIndexFile)) {
    console.error(`[ERROR] Verification failed: missing ${publicIndexFile}`);
    process.exit(1);
  }
  console.log(`✓ Confirmed public index: ${publicIndexFile}`);

  if (!fs.existsSync(adminIndexFile)) {
    console.error(`[ERROR] Verification failed: missing ${adminIndexFile}`);
    process.exit(1);
  }
  console.log(`✓ Confirmed admin index: ${adminIndexFile}`);

  console.log(`\n✓ Unified build completed successfully!\n`);
} catch (err) {
  console.error(`\n[FATAL ERROR] Unexpected failure during build:`, err);
  process.exit(1);
}
