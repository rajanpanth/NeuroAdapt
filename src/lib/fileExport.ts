import { Document } from '@/types/document';

export type ExportFormat = 'html' | 'txt' | 'json' | 'md';

/**
 * Export a document to a file and trigger browser download
 */
export const exportDocument = (doc: Document, format: ExportFormat = 'html') => {
  let content: string;
  let mimeType: string;
  let extension: string;

  switch (format) {
    case 'html':
      content = generateHTMLFile(doc);
      mimeType = 'text/html';
      extension = 'html';
      break;
    case 'txt':
      content = stripHTML(doc.content);
      mimeType = 'text/plain';
      extension = 'txt';
      break;
    case 'json':
      content = JSON.stringify(doc, null, 2);
      mimeType = 'application/json';
      extension = 'json';
      break;
    case 'md':
      content = convertToMarkdown(doc.content);
      mimeType = 'text/markdown';
      extension = 'md';
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  // Create blob and download link
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = url;
  
  // Generate filename from document title
  const sanitizedTitle = sanitizeFilename(doc.title || 'Untitled Document');
  link.download = `${sanitizedTitle}.${extension}`;
  
  // Trigger download
  window.document.body.appendChild(link);
  link.click();
  
  // Cleanup
  window.document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate a complete HTML file with styling
 */
const generateHTMLFile = (doc: Document): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(doc.title)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
    }
    h1 { font-size: 2.5em; }
    h2 { font-size: 2em; }
    h3 { font-size: 1.75em; }
    h4 { font-size: 1.5em; }
    h5 { font-size: 1.25em; }
    h6 { font-size: 1em; }
    p { margin-bottom: 1em; }
    a { color: #0066cc; text-decoration: underline; }
    img { max-width: 100%; height: auto; }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    table, th, td {
      border: 1px solid #ddd;
    }
    th, td {
      padding: 0.5em;
      text-align: left;
    }
    th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
    code {
      background-color: #f5f5f5;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    pre {
      background-color: #f5f5f5;
      padding: 1em;
      border-radius: 5px;
      overflow-x: auto;
    }
    blockquote {
      border-left: 4px solid #ddd;
      margin: 1em 0;
      padding-left: 1em;
      color: #666;
    }
    ul, ol {
      margin-bottom: 1em;
      padding-left: 2em;
    }
    .highlight {
      background-color: #ffeb3b;
    }
  </style>
</head>
<body>
  <h1>${escapeHTML(doc.title)}</h1>
  <div class="content">
    ${doc.content}
  </div>
  <footer style="margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #ddd; color: #666; font-size: 0.875rem;">
    <p>Created: ${doc.createdAt.toLocaleString()}</p>
    <p>Last Updated: ${doc.updatedAt.toLocaleString()}</p>
  </footer>
</body>
</html>`;
};

/**
 * Strip HTML tags to get plain text
 */
const stripHTML = (html: string): string => {
  const tmp = window.document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Convert HTML to Markdown (basic conversion)
 */
const convertToMarkdown = (html: string): string => {
  let markdown = html;
  
  // Headers
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');
  markdown = markdown.replace(/<h4>(.*?)<\/h4>/gi, '#### $1\n\n');
  markdown = markdown.replace(/<h5>(.*?)<\/h5>/gi, '##### $1\n\n');
  markdown = markdown.replace(/<h6>(.*?)<\/h6>/gi, '###### $1\n\n');
  
  // Bold and italic
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b>(.*?)<\/b>/gi, '**$1**');
  markdown = markdown.replace(/<em>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i>(.*?)<\/i>/gi, '*$1*');
  
  // Links
  markdown = markdown.replace(/<a href="(.*?)".*?>(.*?)<\/a>/gi, '[$2]($1)');
  
  // Images
  markdown = markdown.replace(/<img src="(.*?)" alt="(.*?)".*?>/gi, '![$2]($1)');
  
  // Lists
  markdown = markdown.replace(/<li>(.*?)<\/li>/gi, '- $1\n');
  markdown = markdown.replace(/<ul>(.*?)<\/ul>/gi, '$1\n');
  markdown = markdown.replace(/<ol>(.*?)<\/ol>/gi, '$1\n');
  
  // Paragraphs
  markdown = markdown.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
  
  // Line breaks
  markdown = markdown.replace(/<br\s*\/?>/gi, '\n');
  
  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, '');
  
  // Decode HTML entities
  markdown = markdown.replace(/&nbsp;/g, ' ');
  markdown = markdown.replace(/&quot;/g, '"');
  markdown = markdown.replace(/&amp;/g, '&');
  markdown = markdown.replace(/&lt;/g, '<');
  markdown = markdown.replace(/&gt;/g, '>');
  
  return markdown.trim();
};

/**
 * Sanitize filename to remove invalid characters
 */
const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 200); // Limit length
};

/**
 * Escape HTML special characters
 */
const escapeHTML = (str: string): string => {
  const div = window.document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};
