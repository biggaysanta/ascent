import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content');
const planFile = path.join(rootDir, '.agents/plans/cross-linking-matrix-implementation-plan.md');

// CLI Arguments
const args = process.argv.slice(2);
const isApply = args.includes('--apply');
const isVerbose = args.includes('--verbose') || args.includes('-v');

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 1. Collect all content files for fast fuzzy/slug lookup
function getAllContentFiles(dir = contentDir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllContentFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

const allContentFiles = getAllContentFiles();

// 2. Resolve document identifier to physical file path
function resolveContentFile(docId) {
  const cleanId = docId.trim().replace(/^`+|`+$/g, '').replace(/^\*\*|\*\*$/g, '');
  
  // Direct candidates
  const candidates = [
    path.join(contentDir, `${cleanId}.md`),
    path.join(contentDir, cleanId, 'index.md'),
    path.join(contentDir, cleanId, '_index.md'),
    path.join(contentDir, `${cleanId}/_index.md`),
  ];

  // If starts with conditions/, try stripping or mapping
  if (cleanId.startsWith('conditions/')) {
    const stripped = cleanId.replace(/^conditions\//, '');
    candidates.push(
      path.join(contentDir, `${stripped}.md`),
      path.join(contentDir, stripped, 'index.md'),
      path.join(contentDir, stripped, '_index.md')
    );
    if (stripped.startsWith('shoulder-and-neck-pain/')) {
      const shoulderSlug = stripped.replace(/^shoulder-and-neck-pain\//, 'shoulder/');
      candidates.push(
        path.join(contentDir, `${shoulderSlug}.md`),
        path.join(contentDir, shoulderSlug, 'index.md')
      );
    }
  }

  // Check about variations
  if (cleanId === 'about/massage-prep') {
    candidates.push(path.join(contentDir, 'about/how-to-massage-prep.md'));
  }

  for (const cand of candidates) {
    if (fs.existsSync(cand)) return cand;
  }

  // Fallback: match by base slug
  const baseSlug = path.basename(cleanId);
  const matched = allContentFiles.find(f => {
    const fileName = path.basename(f, '.md');
    const parentDir = path.basename(path.dirname(f));
    return fileName === baseSlug || parentDir === baseSlug;
  });

  return matched || null;
}

// 3. Parse Markdown Table from Plan
function parseMatrix(planPath) {
  if (!fs.existsSync(planPath)) {
    throw new Error(`Plan file not found at: ${planPath}`);
  }

  const content = fs.readFileSync(planPath, 'utf8');
  const lines = content.split('\n');
  const matrix = [];

  let inTable = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('| Source Document | Target Document |')) {
      inTable = true;
      continue;
    }
    if (inTable && trimmed.startsWith('| :---')) {
      continue;
    }
    if (inTable && trimmed.startsWith('|')) {
      const cols = trimmed.split('|').map(c => c.trim()).slice(1, -1);
      if (cols.length >= 5) {
        const sourceDoc = cols[0].replace(/\*\*/g, '').replace(/`/g, '').trim();
        const targetDoc = cols[1].replace(/`/g, '').trim();
        const targetUrl = cols[2].replace(/`/g, '').trim();
        let anchorText = cols[3].replace(/^["'`]+|["'`]+$/g, '').trim();
        const rationale = cols[4].trim();

        if (sourceDoc && targetUrl && anchorText) {
          matrix.push({
            sourceDoc,
            targetDoc,
            targetUrl,
            anchorText,
            rationale
          });
        }
      }
    } else if (inTable && !trimmed.startsWith('|') && trimmed.length > 0 && !trimmed.startsWith('---')) {
      // End of table
      inTable = false;
    }
  }

  return matrix;
}

// 4. Validate heading anchor in target file
function validateAnchor(targetUrl) {
  if (!targetUrl.includes('#')) return { valid: true };
  const [urlPath, anchor] = targetUrl.split('#');
  const cleanAnchor = anchor.toLowerCase();

  const cleanDoc = urlPath.replace(/^\//, '').replace(/\/$/, '');
  const targetFile = resolveContentFile(cleanDoc);
  if (!targetFile) return { valid: false, reason: `Target file not found for ${urlPath}` };

  const content = fs.readFileSync(targetFile, 'utf8');
  const headingMatches = content.match(/^#{1,6}\s+(.*)$/gm) || [];
  const slugs = headingMatches.map(h => {
    const cleanHeading = h.replace(/^#{1,6}\s+/, '').replace(/\{#.*\}$/, '').trim();
    const explicitIdMatch = h.match(/\{#(.*?)\}/);
    if (explicitIdMatch) return explicitIdMatch[1].toLowerCase();
    return slugify(cleanHeading);
  });

  const isValid = slugs.some(s => s === cleanAnchor || s.includes(cleanAnchor) || cleanAnchor.includes(s));
  return { valid: isValid, reason: isValid ? null : `Anchor #${anchor} not found in headings: [${slugs.join(', ')}]` };
}

// 5. Replace link safely in Markdown body
function applyLinkToContent(content, anchorText, targetUrl) {
  // Check if link to targetUrl already exists
  if (content.includes(`](${targetUrl})`)) {
    return { modified: false, reason: 'ALREADY_LINKED', newContent: content };
  }

  // Separate frontmatter
  let frontmatter = '';
  let body = content;
  if (content.startsWith('---')) {
    const endFm = content.indexOf('---', 3);
    if (endFm !== -1) {
      frontmatter = content.slice(0, endFm + 3);
      body = content.slice(endFm + 3);
    }
  }

  // Tokenize body by lines to avoid headers and code blocks
  const lines = body.split('\n');
  let inCodeBlock = false;
  let replaced = false;
  let snippet = '';

  const escapedText = anchorText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match anchorText not inside [...] or inside (...)
  const regex = new RegExp(`(?<!\\[[^\\]]*)\\b(${escapedText})\\b(?![^\\[]*\\])`, 'i');

  const newLines = lines.map(line => {
    if (replaced) return line;

    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return line;
    }

    if (inCodeBlock) return line;
    if (line.trim().startsWith('#')) return line; // Skip headings
    if (line.trim().startsWith('![')) return line; // Skip images
    if (line.trim().startsWith('{{<')) return line; // Skip shortcodes

    // Check if line contains anchorText
    const match = line.match(regex);
    if (match && !replaced) {
      // Check if line already has a markdown link surrounding the match
      const matchedStr = match[1];
      const linkReplacement = `[${matchedStr}](${targetUrl})`;
      
      const beforeMatch = line.slice(0, match.index);
      const afterMatch = line.slice(match.index + matchedStr.length);

      // Verify not inside an existing markdown link [text](url)
      const openBrackets = (beforeMatch.match(/\[/g) || []).length;
      const closeBrackets = (beforeMatch.match(/\]/g) || []).length;
      if (openBrackets > closeBrackets) {
        return line; // Inside link text
      }

      const openParen = (beforeMatch.match(/\(/g) || []).length;
      const closeParen = (beforeMatch.match(/\)/g) || []).length;
      if (openParen > closeParen && beforeMatch.endsWith('](')) {
        return line; // Inside link target
      }

      replaced = true;
      const newLine = beforeMatch + linkReplacement + afterMatch;
      snippet = newLine.trim();
      return newLine;
    }

    return line;
  });

  if (!replaced) {
    return { modified: false, reason: 'TEXT_NOT_FOUND', newContent: content };
  }

  return {
    modified: true,
    reason: 'SUCCESS',
    snippet,
    newContent: frontmatter + newLines.join('\n')
  };
}

// 6. Main runner
async function main() {
  console.log(`\n🔗 =======================================================`);
  console.log(`   Internal Cross-Linking Matrix Automation`);
  console.log(`   Mode: ${isApply ? '🚀 APPLY CHANGES' : '🔍 DRY-RUN (no files modified)'}`);
  console.log(`==========================================================\n`);

  const matrix = parseMatrix(planFile);
  console.log(`📋 Loaded ${matrix.length} cross-linking rules from plan.\n`);

  const stats = {
    total: matrix.length,
    applied: 0,
    alreadyLinked: 0,
    textNotFound: 0,
    fileNotFound: 0,
    anchorWarnings: 0,
  };

  const pendingManualReview = [];

  for (const entry of matrix) {
    const { sourceDoc, targetUrl, anchorText, rationale } = entry;
    const sourceFilePath = resolveContentFile(sourceDoc);

    console.log(`----------------------------------------------------------`);
    console.log(`📄 Source: ${sourceDoc}`);
    console.log(`🎯 Target: ${targetUrl} | Anchor Text: "${anchorText}"`);

    if (!sourceFilePath) {
      console.log(`❌ Source file could not be resolved on disk.`);
      stats.fileNotFound++;
      continue;
    }

    // Validate Anchor
    const anchorCheck = validateAnchor(targetUrl);
    if (!anchorCheck.valid) {
      console.log(`⚠️  Anchor Warning: ${anchorCheck.reason}`);
      stats.anchorWarnings++;
    }

    const originalContent = fs.readFileSync(sourceFilePath, 'utf8');
    const result = applyLinkToContent(originalContent, anchorText, targetUrl);

    if (result.reason === 'ALREADY_LINKED') {
      console.log(`ℹ️  Already linked to target URL.`);
      stats.alreadyLinked++;
    } else if (result.reason === 'TEXT_NOT_FOUND') {
      console.log(`⚠️  Anchor text not found verbatim in source copy.`);
      stats.textNotFound++;
      pendingManualReview.push({
        sourceDoc,
        sourceFilePath: path.relative(rootDir, sourceFilePath),
        anchorText,
        targetUrl,
        rationale
      });
    } else if (result.modified) {
      console.log(`✅ ${isApply ? 'Applied' : 'Match found'}:`);
      console.log(`   Snippet: "${result.snippet.slice(0, 140)}..."`);
      stats.applied++;

      if (isApply) {
        fs.writeFileSync(sourceFilePath, result.newContent, 'utf8');
      }
    }
  }

  console.log(`\n==========================================================`);
  console.log(`📊 EXECUTION SUMMARY`);
  console.log(`==========================================================`);
  console.log(`Total rules in matrix:     ${stats.total}`);
  console.log(`✅ Links ${isApply ? 'applied' : 'matched'}:           ${stats.applied}`);
  console.log(`ℹ️  Already linked:         ${stats.alreadyLinked}`);
  console.log(`⚠️  Text not found verbatim: ${stats.textNotFound}`);
  console.log(`❌ Source file not found:   ${stats.fileNotFound}`);
  console.log(`⚠️  Anchor warnings:        ${stats.anchorWarnings}`);
  console.log(`==========================================================\n`);

  if (pendingManualReview.length > 0) {
    console.log(`📌 Contextual Bridge Phrases for Manual/Assisted Insertion (${pendingManualReview.length}):`);
    pendingManualReview.forEach((item, idx) => {
      console.log(`  ${idx + 1}. [${item.sourceFilePath}]`);
      console.log(`     Target: ${item.targetUrl}`);
      console.log(`     Phrase: "${item.anchorText}"`);
      console.log(`     Goal:   ${item.rationale}\n`);
    });
  }

  if (!isApply && stats.applied > 0) {
    console.log(`💡 To apply these changes to files, run:`);
    console.log(`   npm run links:apply\n`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
