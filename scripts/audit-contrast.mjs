#!/usr/bin/env node
/**
 * Site-Wide WCAG AAA Contrast Spider & Auditor
 * The Firelight Studio - Ascent Site
 *
 * Spiders the site across all internal pages and audits text contrast against
 * WCAG AAA standards (7.0:1 normal text, 4.5:1 large text) for any specified theme.
 *
 * Usage:
 *   node scripts/audit-contrast.mjs                             # Default theme (theme-auntie-em, light)
 *   node scripts/audit-contrast.mjs --theme theme-dorothy       # Specific theme
 *   node scripts/audit-contrast.mjs --mode dark                 # Dark mode
 *   node scripts/audit-contrast.mjs --all-themes                # Audit all 14 themes
 *   node scripts/audit-contrast.mjs --url http://localhost:1313 # Custom base URL
 *   node scripts/audit-contrast.mjs --help                      # Show options
 */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import net from 'node:net';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const reportsDir = path.join(rootDir, '.agents', 'reports');

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// All themes defined in themes/embrace/assets/css/
const ALL_THEMES = [
  'theme-auntie-em',
  'theme-brains',
  'theme-courage',
  'theme-dorothy',
  'theme-glinda',
  'theme-healing',
  'theme-home',
  'theme-receive',
  'theme-recharge',
  'theme-refresh',
  'theme-relate',
  'theme-release',
  'theme-renew',
  'theme-repeat'
];

// CLI Argument Parsing
const args = process.argv.slice(2);

function getArg(flag, defaultValue = null) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--')) {
    return args[idx + 1];
  }
  return defaultValue;
}

const hasFlag = flag => args.includes(flag);

if (hasFlag('--help') || hasFlag('-h')) {
  console.log(`
Site-Wide WCAG AAA Contrast Spider & Auditor
The Firelight Studio

Usage:
  node scripts/audit-contrast.mjs [options]

Options:
  --theme <name>        Theme to test (e.g. theme-dorothy, theme-auntie-em) [default: theme-auntie-em]
  --all-themes          Audit every theme in the system and produce a comparative report
  --mode <light|dark>   Color scheme mode to test [default: light]
  --url <url>           Base site URL to spider [default: http://localhost:1313]
  --max-pages <num>     Maximum pages to spider [default: 50]
  --port <port>         CDP debugging port to use [default: 9333]
  --help, -h            Show this help text
`);
  process.exit(0);
}

const selectedTheme = getArg('--theme', 'theme-auntie-em');
const isAllThemes = hasFlag('--all-themes');
const selectedMode = getArg('--mode', 'light');
const baseUrl = (getArg('--url', 'http://localhost:1313') || 'http://localhost:1313').replace(/\/+$/, '');
const maxPages = parseInt(getArg('--max-pages', '50'), 10);
const cdpPort = parseInt(getArg('--port', '9333'), 10);

// Detect Chrome / Edge binary on Windows / macOS / Linux
function findBrowserExecutable() {
  if (process.platform === 'win32') {
    const candidates = [
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe')
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
  } else if (process.platform === 'darwin') {
    const candidates = [
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
  } else {
    // Linux
    const candidates = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge'];
    return candidates[0];
  }
  throw new Error('No compatible Chromium browser (Microsoft Edge or Google Chrome) found.');
}

// Minimal pure Node.js WebSocket client for CDP communication (zero external dependencies)
class SimpleWebSocket {
  constructor(url) {
    this.url = new URL(url);
    this.callbacks = new Map();
    this.messageId = 1;
    this.eventListeners = new Map();
    this.isOpen = false;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const key = crypto.randomBytes(16).toString('base64');
      const req = http.request({
        hostname: this.url.hostname,
        port: this.url.port,
        path: this.url.pathname + this.url.search,
        headers: {
          'Connection': 'Upgrade',
          'Upgrade': 'websocket',
          'Sec-WebSocket-Version': '13',
          'Sec-WebSocket-Key': key
        }
      });

      req.on('upgrade', (res, socket, head) => {
        this.socket = socket;
        this.isOpen = true;
        this._setupSocket();
        resolve();
      });

      req.on('error', reject);
      req.end();
    });
  }

  _setupSocket() {
    let buffer = Buffer.alloc(0);
    this.socket.on('data', chunk => {
      buffer = Buffer.concat([buffer, chunk]);
      while (buffer.length >= 2) {
        const secondByte = buffer[1];
        const payloadLengthIndicator = secondByte & 0x7f;
        let offset = 2;

        let payloadLength = payloadLengthIndicator;
        if (payloadLengthIndicator === 126) {
          if (buffer.length < 4) return;
          payloadLength = buffer.readUInt16BE(2);
          offset = 4;
        } else if (payloadLengthIndicator === 127) {
          if (buffer.length < 10) return;
          payloadLength = Number(buffer.readBigUInt64BE(2));
          offset = 10;
        }

        if (buffer.length < offset + payloadLength) return;

        const payload = buffer.subarray(offset, offset + payloadLength);
        buffer = buffer.subarray(offset + payloadLength);

        try {
          const text = payload.toString('utf8');
          const msg = JSON.parse(text);
          if (msg.id && this.callbacks.has(msg.id)) {
            const cb = this.callbacks.get(msg.id);
            this.callbacks.delete(msg.id);
            if (msg.error) cb.reject(msg.error);
            else cb.resolve(msg.result);
          } else if (msg.method && this.eventListeners.has(msg.method)) {
            for (const fn of this.eventListeners.get(msg.method)) fn(msg.params);
          }
        } catch {
          // Ignore parse errors
        }
      }
    });

    this.socket.on('close', () => {
      this.isOpen = false;
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isOpen) return reject(new Error('WebSocket is closed'));
      const id = this.messageId++;
      this.callbacks.set(id, { resolve, reject });

      const jsonStr = JSON.stringify({ id, method, params });
      const payload = Buffer.from(jsonStr, 'utf8');
      const mask = crypto.randomBytes(4);

      let header;
      if (payload.length < 126) {
        header = Buffer.alloc(6);
        header[0] = 0x81; // FIN + text frame
        header[1] = 0x80 | payload.length; // MASK bit set
        mask.copy(header, 2);
      } else if (payload.length < 65536) {
        header = Buffer.alloc(8);
        header[0] = 0x81;
        header[1] = 0x80 | 126;
        header.writeUInt16BE(payload.length, 2);
        mask.copy(header, 4);
      } else {
        header = Buffer.alloc(14);
        header[0] = 0x81;
        header[1] = 0x80 | 127;
        header.writeBigUInt64BE(BigInt(payload.length), 2);
        mask.copy(header, 10);
      }

      const maskedPayload = Buffer.alloc(payload.length);
      for (let i = 0; i < payload.length; i++) {
        maskedPayload[i] = payload[i] ^ mask[i % 4];
      }

      this.socket.write(Buffer.concat([header, maskedPayload]));
    });
  }

  on(event, listener) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(listener);
  }

  close() {
    if (this.socket) {
      try {
        this.socket.destroy();
      } catch {}
    }
    this.isOpen = false;
  }
}

// In-Page Evaluation Script injected into the browser via CDP
const IN_PAGE_CONTRAST_EVALUATOR = `
(() => {
  function parseColor(str) {
    if (!str || str === 'transparent') return [0, 0, 0, 0];
    const match = str.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
    if (match) {
      return [
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3], 10),
        match[4] !== undefined ? parseFloat(match[4]) : 1
      ];
    }
    return [0, 0, 0, 0];
  }

  function compositeAlpha(fg, bg) {
    const [r1, g1, b1, a1] = fg;
    const [r2, g2, b2, a2] = bg;
    const outA = a1 + a2 * (1 - a1);
    if (outA === 0) return [0, 0, 0, 0];
    const outR = Math.round((r1 * a1 + r2 * a2 * (1 - a1)) / outA);
    const outG = Math.round((g1 * a1 + g2 * a2 * (1 - a1)) / outA);
    const outB = Math.round((b1 * a1 + b2 * a2 * (1 - a1)) / outA);
    return [outR, outG, outB, outA];
  }

  function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
      const v = c / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  function getContrastRatio(fg, bg) {
    const l1 = getLuminance(fg[0], fg[1], fg[2]);
    const l2 = getLuminance(bg[0], bg[1], bg[2]);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function getCssSelector(el) {
    if (el.id) return '#' + el.id;
    let path = [];
    let curr = el;
    while (curr && curr.nodeType === Node.ELEMENT_NODE && curr !== document.body) {
      let name = curr.localName;
      if (curr.className && typeof curr.className === 'string') {
        const firstClass = curr.className.trim().split(/\\s+/)[0];
        if (firstClass && !firstClass.includes(':') && !firstClass.includes('/')) {
          name += '.' + firstClass;
        }
      }
      path.unshift(name);
      if (path.length >= 3) break;
      curr = curr.parentElement;
    }
    return path.join(' > ');
  }

  const results = [];
  const candidateTags = 'h1, h2, h3, h4, h5, h6, p, a, button, li, label, th, td, span, strong, em';
  const elements = Array.from(document.querySelectorAll(candidateTags));

  // Base background from html/body
  const bodyBg = parseColor(window.getComputedStyle(document.body).backgroundColor);
  const htmlBg = parseColor(window.getComputedStyle(document.documentElement).backgroundColor);
  const defaultBaseBg = (bodyBg[3] === 1) ? bodyBg : (htmlBg[3] === 1) ? htmlBg : [255, 255, 255, 1];

  for (const el of elements) {
    // Check if element has direct text content
    let directText = '';
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        directText += node.textContent.trim() + ' ';
      }
    }
    directText = directText.trim();
    if (!directText) {
      // If no direct text, check overall text for leaf nodes
      if (el.children.length === 0) {
        directText = (el.textContent || '').trim();
      }
    }
    if (!directText || directText.length < 2) continue;

    // Visibility checks
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) continue;
    if (el.closest('[aria-hidden="true"]')) continue;

    const fgColor = parseColor(style.color);
    if (fgColor[3] === 0) continue; // Fully transparent text

    // Climb DOM to compute effective alpha composited background
    let curr = el;
    const bgLayers = [];
    while (curr && curr.nodeType === Node.ELEMENT_NODE) {
      const cs = window.getComputedStyle(curr);
      const bg = parseColor(cs.backgroundColor);
      if (bg[3] > 0) {
        bgLayers.unshift(bg);
        if (bg[3] === 1) break; // Reached fully opaque layer
      }
      curr = curr.parentElement;
    }

    let effectiveBg = defaultBaseBg;
    for (const layer of bgLayers) {
      effectiveBg = compositeAlpha(layer, effectiveBg);
    }

    // Determine large vs normal text
    const fontSize = parseFloat(style.fontSize) || 16;
    const fontWeight = parseInt(style.fontWeight, 10) || 400;
    const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
    const requiredRatio = isLarge ? 4.5 : 7.0;

    const ratio = getContrastRatio(fgColor, effectiveBg);
    const passesAAA = ratio >= requiredRatio;
    const passesAA = ratio >= (isLarge ? 3.0 : 4.5);

    results.push({
      selector: getCssSelector(el),
      text: directText.slice(0, 60),
      fontSize: Math.round(fontSize) + 'px',
      fontWeight: fontWeight,
      isLarge: isLarge,
      fgColor: \`rgb(\${fgColor[0]}, \${fgColor[1]}, \${fgColor[2]})\`,
      bgColor: \`rgb(\${effectiveBg[0]}, \${effectiveBg[1]}, \${effectiveBg[2]})\`,
      ratio: Number(ratio.toFixed(2)),
      requiredRatio: requiredRatio,
      passesAAA: passesAAA,
      passesAA: passesAA
    });
  }

  // Also collect internal links for the crawler
  const links = Array.from(document.querySelectorAll('a[href]'))
    .map(a => a.getAttribute('href'))
    .filter(Boolean);

  return { results, links };
})()
`;

// Helper: HTTP request wrapper
function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Main execution
async function main() {
  console.log('='.repeat(65));
  console.log('   THE FIRELIGHT STUDIO - WCAG AAA TEXT CONTRAST SPIDER');
  console.log('='.repeat(65));
  console.log(`Base URL:      ${baseUrl}`);
  console.log(`Selected Mode: ${selectedMode}`);
  console.log(`Themes to Run: ${isAllThemes ? ALL_THEMES.join(', ') : selectedTheme}`);
  console.log(`Target:        WCAG AAA (≥7.0:1 normal text, ≥4.5:1 large text)`);
  console.log('='.repeat(65));

  // 1. Verify that the server is reachable
  try {
    await httpGet(baseUrl);
  } catch (err) {
    console.error(`\n[ERROR] Cannot connect to ${baseUrl}!`);
    console.error('Make sure your Hugo development server is running:');
    console.error('  npx concurrently "hugo server -D" vite\n  or: hugo server -D\n');
    process.exit(1);
  }

  // 2. Launch Chromium in headless mode
  const browserPath = findBrowserExecutable();
  console.log(`\nLaunching headless browser: ${browserPath}`);

  const userDataDir = path.join(rootDir, '.agents', 'scratch', 'chrome-user-data-' + Date.now());
  fs.mkdirSync(userDataDir, { recursive: true });

  const browserProc = spawn(browserPath, [
    `--remote-debugging-port=${cdpPort}`,
    '--headless=new',
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  const cleanup = () => {
    try {
      browserProc.kill();
    } catch {}
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {}
  };

  process.on('SIGINT', () => {
    cleanup();
    process.exit(0);
  });
  process.on('exit', cleanup);

  // Wait for CDP port to open
  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const versionJson = await httpGet(`http://127.0.0.1:${cdpPort}/json/version`);
      const data = JSON.parse(versionJson);
      wsUrl = data.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch {}
  }

  if (!wsUrl) {
    console.error('[ERROR] Failed to connect to headless browser CDP port.');
    cleanup();
    process.exit(1);
  }

  // 3. Connect via WebSocket
  const ws = new SimpleWebSocket(wsUrl);
  await ws.connect();

  // Create a new target/page
  const target = await ws.send('Target.createTarget', { url: baseUrl });
  const pageWsUrl = `ws://127.0.0.1:${cdpPort}/devtools/page/${target.targetId}`;
  const pageWs = new SimpleWebSocket(pageWsUrl);
  await pageWs.connect();

  await pageWs.send('Page.enable');
  await pageWs.send('Runtime.enable');

  // Emulate color scheme
  if (selectedMode === 'dark') {
    await pageWs.send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [{ name: 'prefers-color-scheme', value: 'dark' }]
    });
  }

  // Spider the site to discover all pages
  console.log(`\nSpidering site starting from: ${baseUrl}`);
  const pagesToVisit = [baseUrl];
  const visitedPages = new Set();

  // Navigate helper
  async function navigate(url) {
    return new Promise(async resolve => {
      const onLoad = () => {
        resolve();
      };
      pageWs.on('Page.loadEventFired', onLoad);
      await pageWs.send('Page.navigate', { url });
      // Timeout fallback
      setTimeout(resolve, 4000);
    });
  }

  // Step 1: Discover all unique pages
  while (pagesToVisit.length > 0 && visitedPages.size < maxPages) {
    const currentUrl = pagesToVisit.shift();
    if (visitedPages.has(currentUrl)) continue;
    visitedPages.add(currentUrl);

    await navigate(currentUrl);
    await new Promise(r => setTimeout(r, 400));

    const evalResult = await pageWs.send('Runtime.evaluate', {
      expression: 'Array.from(document.querySelectorAll("a[href]")).map(a => a.getAttribute("href"))',
      returnByValue: true
    });

    const links = evalResult.result?.value || [];
    for (const href of links) {
      if (!href) continue;
      try {
        const resolved = new URL(href, currentUrl).href.split('#')[0];
        if (
          resolved.startsWith(baseUrl) &&
          !visitedPages.has(resolved) &&
          !pagesToVisit.includes(resolved) &&
          !resolved.match(/\.(svg|png|jpg|jpeg|webp|gif|css|js|woff|woff2|xml|json|ico)$/i)
        ) {
          pagesToVisit.push(resolved);
        }
      } catch {}
    }
  }

  const allPageUrls = Array.from(visitedPages);
  console.log(`Spider complete: Discovered ${allPageUrls.length} pages:\n` + allPageUrls.map(u => `  - ${u}`).join('\n'));

  // Step 2: Run audits for selected themes
  const themesToAudit = isAllThemes ? ALL_THEMES : [selectedTheme];
  const allReportsSummary = [];

  for (const theme of themesToAudit) {
    console.log(`\n${'='.repeat(65)}`);
    console.log(`AUDITING THEME: [ ${theme} ] (Mode: ${selectedMode})`);
    console.log('='.repeat(65));

    const themeAuditResults = [];
    let totalEvaluated = 0;
    let totalPassAAA = 0;
    let totalPassAA = 0;
    let totalFailAAA = 0;

    for (const pageUrl of allPageUrls) {
      await navigate(pageUrl);
      await new Promise(r => setTimeout(r, 300));

      // Inject theme class onto <html>
      await pageWs.send('Runtime.evaluate', {
        expression: `
          (() => {
            document.documentElement.className = document.documentElement.className.replace(/\\btheme-\\S+/g, '').trim();
            document.documentElement.classList.add('${theme}');
          })()
        `
      });

      await new Promise(r => setTimeout(r, 150));

      // Execute in-page evaluator
      const evalResponse = await pageWs.send('Runtime.evaluate', {
        expression: IN_PAGE_CONTRAST_EVALUATOR,
        returnByValue: true
      });

      const pageResults = evalResponse.result?.value?.results || [];
      const pagePassAAA = pageResults.filter(r => r.passesAAA).length;
      const pageFailAAA = pageResults.length - pagePassAAA;

      totalEvaluated += pageResults.length;
      totalPassAAA += pagePassAAA;
      totalFailAAA += pageFailAAA;

      themeAuditResults.push({
        url: pageUrl,
        results: pageResults,
        evaluated: pageResults.length,
        passCount: pagePassAAA,
        failCount: pageFailAAA,
        passRate: pageResults.length > 0 ? ((pagePassAAA / pageResults.length) * 100).toFixed(1) : '100.0'
      });

      const displayPath = new URL(pageUrl).pathname || '/';
      console.log(`  ✓ ${displayPath.padEnd(35)} : ${pagePassAAA}/${pageResults.length} AAA compliant (${pageResults.length > 0 ? ((pagePassAAA / pageResults.length) * 100).toFixed(1) : 100}%)`);
    }

    const overallRate = totalEvaluated > 0 ? ((totalPassAAA / totalEvaluated) * 100).toFixed(1) : '100.0';
    console.log(`\nTHEME SUMMARY [${theme}]: ${totalPassAAA}/${totalEvaluated} passed (${overallRate}% AAA compliant)`);

    // Write Theme Markdown Report
    const reportFilename = `contrast-report-${theme}-${selectedMode}.md`;
    const reportPath = path.join(reportsDir, reportFilename);

    let md = `# WCAG AAA Contrast Audit Report\n\n`;
    md += `- **Theme Tested**: \`${theme}\`\n`;
    md += `- **Color Mode**: \`${selectedMode}\`\n`;
    md += `- **Audit Date**: ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC\n`;
    md += `- **Base URL**: \`${baseUrl}\`\n`;
    md += `- **Pages Audited**: ${allPageUrls.length}\n`;
    md += `- **Total Elements Evaluated**: ${totalEvaluated}\n`;
    md += `- **AAA Pass Rate**: **${overallRate}%** (${totalPassAAA} passed, ${totalFailAAA} failed)\n\n`;

    md += `## Page Breakdown\n\n`;
    md += `| Page Path | Evaluated | AAA Pass | AAA Fail | Pass Rate |\n`;
    md += `|---|---|---|---|---|\n`;
    for (const page of themeAuditResults) {
      const p = new URL(page.url).pathname || '/';
      md += `| \`${p}\` | ${page.evaluated} | ${page.passCount} | ${page.failCount} | ${page.passRate}% |\n`;
    }

    md += `\n## Failing Elements Detail (WCAG AAA Violations)\n\n`;
    let anyFailures = false;

    for (const page of themeAuditResults) {
      const failures = page.results.filter(r => !r.passesAAA);
      if (failures.length === 0) continue;
      anyFailures = true;
      const p = new URL(page.url).pathname || '/';
      md += `### \`${p}\` (${failures.length} issues)\n\n`;

      for (let i = 0; i < failures.length; i++) {
        const item = failures[i];
        const shortfall = (item.requiredRatio - item.ratio).toFixed(2);
        md += `${i + 1}. **Selector**: \`${item.selector}\`\n`;
        md += `   - **Snippet**: "${item.text.replace(/\n+/g, ' ')}"\n`;
        md += `   - **Text Size**: ${item.fontSize} (${item.isLarge ? 'Large' : 'Normal'} text, weight: ${item.fontWeight})\n`;
        md += `   - **Text Color**: \`${item.fgColor}\`\n`;
        md += `   - **Effective Background**: \`${item.bgColor}\`\n`;
        md += `   - **Contrast Ratio**: **${item.ratio}:1** (Required: **${item.requiredRatio}:1** | Shortfall: \`-${shortfall}\`)\n`;
        md += `   - **WCAG Level**: ${item.passesAA ? '✅ Passes AA, ❌ Fails AAA' : '❌ Fails AA and AAA'}\n\n`;
      }
    }

    if (!anyFailures) {
      md += `🎉 **Perfect Score!** All text elements across all audited pages meet or exceed WCAG AAA contrast guidelines!\n\n`;
    }

    fs.writeFileSync(reportPath, md, 'utf8');
    console.log(`Report written to: ${path.relative(rootDir, reportPath)}`);

    allReportsSummary.push({
      theme,
      mode: selectedMode,
      total: totalEvaluated,
      passed: totalPassAAA,
      failed: totalFailAAA,
      rate: parseFloat(overallRate),
      reportPath: path.relative(rootDir, reportPath)
    });
  }

  // If all themes were audited, generate the master comparative index
  if (isAllThemes) {
    const masterPath = path.join(reportsDir, `contrast-report-all-themes-${selectedMode}.md`);
    let masterMd = `# All-Themes WCAG AAA Contrast Benchmark Report\n\n`;
    masterMd += `- **Color Mode**: \`${selectedMode}\`\n`;
    masterMd += `- **Audit Date**: ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC\n`;
    masterMd += `- **Total Themes Evaluated**: ${allReportsSummary.length}\n\n`;
    masterMd += `| Theme Name | Total Evaluated | AAA Passed | AAA Failed | AAA Pass Rate | Detailed Report |\n`;
    masterMd += `|---|---|---|---|---|---|\n`;

    allReportsSummary.sort((a, b) => b.rate - a.rate);
    for (const item of allReportsSummary) {
      masterMd += `| \`${item.theme}\` | ${item.total} | ${item.passed} | ${item.failed} | **${item.rate.toFixed(1)}%** | [View Report](${item.reportPath.replace(/\\\\/g, '/')}) |\n`;
    }

    fs.writeFileSync(masterPath, masterMd, 'utf8');
    console.log(`\nMaster all-themes report written to: ${path.relative(rootDir, masterPath)}`);
  }

  console.log(`\n${'='.repeat(65)}`);
  console.log('CONTRAST AUDIT COMPLETED SUCCESSFULLY');
  console.log('='.repeat(65));

  cleanup();
  process.exit(0);
}

main().catch(err => {
  console.error('\n[FATAL ERROR]', err);
  process.exit(1);
});
