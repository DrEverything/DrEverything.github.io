import MarkdownIt from 'markdown-it';
import texmath from 'markdown-it-texmath';
import katex from 'katex';

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
  .use(texmath, {
    engine: katex,
    delimiters: 'dollars',
    katexOptions: { throwOnError: false }
  });

export function render(src: string): string {
  return md.render(src);
}

// markdown.ts
// export function render(src: string): string {
//   const result = md.render(src);
//   console.log('INPUT:', src);
//   console.log('OUTPUT:', result);
//   return result;
// }
