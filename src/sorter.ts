export interface SorterOptions {
  sortDependencies: boolean;
  sortDevDependencies: boolean;
  sortPeerDependencies: boolean;
  sortScripts: boolean;
  groupScopes: 'top' | 'bottom' | 'inline';
}

export interface FormattingOptions {
  insertSpaces: boolean;
  tabSize: number;
}

/**
 * Intelligently sorts the keys of an object.
 * If groupScopes is 'top' or 'bottom', it separates keys starting with '@'
 * and groups them accordingly. Otherwise, it performs a standard alphabetical sort.
 */
function sortObjectKeys(
  obj: Record<string, any>,
  groupScopes: 'top' | 'bottom' | 'inline'
): Record<string, any> {
  const keys = Object.keys(obj);
  let sortedKeys: string[];

  if (groupScopes === 'inline') {
    sortedKeys = [...keys].sort((a, b) => a.localeCompare(b));
  } else {
    const scopedKeys = keys.filter(k => k.startsWith('@')).sort((a, b) => a.localeCompare(b));
    const nonScopedKeys = keys.filter(k => !k.startsWith('@')).sort((a, b) => a.localeCompare(b));

    if (groupScopes === 'top') {
      sortedKeys = [...scopedKeys, ...nonScopedKeys];
    } else {
      // 'bottom'
      sortedKeys = [...nonScopedKeys, ...scopedKeys];
    }
  }

  const sortedObj: Record<string, any> = {};
  for (const key of sortedKeys) {
    sortedObj[key] = obj[key];
  }
  return sortedObj;
}

/**
 * Parses, sorts, and re-stringifies package.json content according to the options.
 * Throws an error if the JSON is invalid.
 */
export function sortPackageJson(
  jsonText: string,
  formattingOptions: FormattingOptions,
  options: SorterOptions
): string {
  // Parse original JSON. This will throw if the syntax is invalid.
  const data = JSON.parse(jsonText);

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    // Sort dependencies if enabled and exists as an object
    if (
      options.sortDependencies &&
      data.dependencies &&
      typeof data.dependencies === 'object' &&
      !Array.isArray(data.dependencies)
    ) {
      data.dependencies = sortObjectKeys(data.dependencies, options.groupScopes);
    }

    // Sort devDependencies if enabled and exists as an object
    if (
      options.sortDevDependencies &&
      data.devDependencies &&
      typeof data.devDependencies === 'object' &&
      !Array.isArray(data.devDependencies)
    ) {
      data.devDependencies = sortObjectKeys(data.devDependencies, options.groupScopes);
    }

    // Sort peerDependencies if enabled and exists as an object
    if (
      options.sortPeerDependencies &&
      data.peerDependencies &&
      typeof data.peerDependencies === 'object' &&
      !Array.isArray(data.peerDependencies)
    ) {
      data.peerDependencies = sortObjectKeys(data.peerDependencies, options.groupScopes);
    }

    // Sort scripts if enabled and exists as an object (always sorted 'inline')
    if (
      options.sortScripts &&
      data.scripts &&
      typeof data.scripts === 'object' &&
      !Array.isArray(data.scripts)
    ) {
      data.scripts = sortObjectKeys(data.scripts, 'inline');
    }
  }

  // Determine indentation representation
  const indent = formattingOptions.insertSpaces
    ? ' '.repeat(formattingOptions.tabSize)
    : '\t';

  // Stringify the sorted object
  let formatted = JSON.stringify(data, null, indent);

  // Preserve trailing newline if it existed in the original document
  const hasTrailingNewline = jsonText.endsWith('\n') || jsonText.endsWith('\r\n');
  if (hasTrailingNewline && !formatted.endsWith('\n')) {
    // If the original used CRLF, let's keep CRLF, otherwise LF
    const newline = jsonText.endsWith('\r\n') ? '\r\n' : '\n';
    formatted += newline;
  }

  return formatted;
}
