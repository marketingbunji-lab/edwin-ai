import prettier from "prettier";

const htmlFormatOptions = {
  parser: "html",
  printWidth: 100,
  tabWidth: 2,
  htmlWhitespaceSensitivity: "ignore",
} as const;

export async function formatHtmlDocument(html: string) {
  return prettier.format(html, htmlFormatOptions);
}

export async function formatHtmlFragment(fragment: string) {
  const wrapped = await prettier.format(
    `<body>
${fragment}
</body>`,
    htmlFormatOptions
  );

  const bodyMatch = wrapped.match(/<body>\s*([\s\S]*?)\s*<\/body>/i);
  return bodyMatch?.[1]?.trim() ?? fragment.trim();
}
