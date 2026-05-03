#!/usr/bin/env node
/**
 * scripts/release-check.mjs
 * Pre-flight check before releasing @open-slider/* packages.
 * Run: node scripts/release-check.mjs
 */

import { execSync } from 'child_process';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const PACKAGES_DIR = 'packages';
const REQUIRED_FIELDS = ['publishConfig'];

let errors = 0;
let warnings = 0;

function pass(msg) { console.log(`  ✅ ${msg}`); }
function fail(msg) { console.log(`  ❌ ${msg}`); errors++; }
function warn(msg) { console.log(`  ⚠️  ${msg}`); warnings++; }
function section(title) { console.log(`\n── ${title}`); }

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
}

function runChecked(label, cmd) {
  try {
    run(cmd);
    pass(label);
    return true;
  } catch {
    fail(`${label} — ejecuta: ${cmd}`);
    return false;
  }
}

// ── 1. Git status
section('Git');
try {
  const status = run('git status --porcelain');
  if (status) {
    warn('Hay cambios sin commitear:\n' + status.split('\n').map(l => '     ' + l).join('\n'));
  } else {
    pass('Repo limpio');
  }
  const branch = run('git rev-parse --abbrev-ref HEAD');
  branch === 'master' ? pass(`Rama: ${branch}`) : warn(`Rama actual: ${branch} (se esperaba master)`);
} catch {
  fail('No se pudo leer el estado de git');
}

// ── 2. package.json de cada paquete
section('package.json de paquetes');
const pkgDirs = readdirSync(PACKAGES_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

const versions = {};
for (const dir of pkgDirs) {
  const pkgPath = join(PACKAGES_DIR, dir, 'package.json');
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  } catch {
    fail(`No se puede leer ${pkgPath}`);
    continue;
  }
  versions[pkg.name] = pkg.version;
  const missing = REQUIRED_FIELDS.filter(f => !pkg[f]);
  if (missing.length) {
    fail(`${pkg.name}: falta ${missing.join(', ')}`);
  } else {
    pass(`${pkg.name}@${pkg.version} — publishConfig.access=${pkg.publishConfig?.access}`);
  }
  if (!pkg.publishConfig?.access || pkg.publishConfig.access !== 'public') {
    fail(`${pkg.name}: publishConfig.access no es "public"`);
  }
}

// ── 3. Consistencia de versiones (detectar si hay paquetes desfasados)
section('Consistencia de versiones');
const uniqueVersions = [...new Set(Object.values(versions))];
if (uniqueVersions.length === 1) {
  pass(`Todos los paquetes en la misma versión: ${uniqueVersions[0]}`);
} else {
  warn(`Versiones mixtas: ${JSON.stringify(versions, null, 2)}`);
}

// ── 4. Typecheck
section('TypeScript');
runChecked('typecheck', 'npm run typecheck --no-workspaces 2>&1 || npm run typecheck');

// ── 5. Tests
section('Tests');
runChecked('vitest run', 'npm run test');

// ── 6. Build
section('Build');
runChecked('build completo', 'npm run build');

// ── 7. Changesets pendientes
section('Changesets');
try {
  const files = readdirSync('.changeset').filter(f => f.endsWith('.md') && f !== 'README.md');
  if (files.length > 0) {
    pass(`${files.length} changeset(s) pendientes: ${files.join(', ')}`);
  } else {
    warn('No hay changesets pendientes — ¿seguro que quieres hacer release?');
  }
} catch {
  fail('No se puede leer .changeset/');
}

// ── 8. npm publicado vs local
section('Versiones en npm vs local');
for (const [name, localVer] of Object.entries(versions)) {
  try {
    const npmVer = run(`npm view ${name} version 2>/dev/null`);
    if (npmVer === localVer) {
      warn(`${name}: local (${localVer}) == npm (${npmVer}) — ¿ya está publicado?`);
    } else {
      pass(`${name}: local ${localVer} → npm ${npmVer} (pendiente publicar)`);
    }
  } catch {
    pass(`${name}@${localVer} — no publicado aún (primer publish)`);
  }
}

// ── Resultado final
console.log('\n' + '─'.repeat(50));
if (errors > 0) {
  console.log(`\n❌ PREFLIGHT FALLIDO — ${errors} error(es), ${warnings} aviso(s). Corrige antes de publicar.\n`);
  process.exit(1);
} else if (warnings > 0) {
  console.log(`\n⚠️  PREFLIGHT OK con ${warnings} aviso(s). Revisa antes de continuar.\n`);
} else {
  console.log('\n✅ PREFLIGHT COMPLETO — Todo listo para release.\n');
}
