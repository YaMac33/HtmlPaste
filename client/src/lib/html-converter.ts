export function convertTextToHtml(text: string): string {
  // Basic text to HTML conversion
  let html = text
    // Convert URLs to links
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" class="text-primary underline">$1</a>')
    // Convert line breaks to paragraphs
    .split('\n\n')
    .map(paragraph => {
      if (!paragraph.trim()) return '';
      
      // Check if it's a list
      if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
        const listItems = paragraph
          .split('\n')
          .filter(line => line.trim().startsWith('- '))
          .map(line => `<li>${line.substring(2).trim()}</li>`)
          .join('\n');
        return `<ul>\n${listItems}\n</ul>`;
      }
      
      // Regular paragraph
      return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
    })
    .filter(p => p)
    .join('\n\n');

  return html;
}

export function getTextStats(text: string) {
  return {
    characters: text.length,
    lines: text.split('\n').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    paragraphs: text.split('\n\n').filter(p => p.trim()).length
  };
}
