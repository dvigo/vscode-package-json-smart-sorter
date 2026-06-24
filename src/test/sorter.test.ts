import * as assert from 'assert';
import { sortPackageJson, SorterOptions, FormattingOptions } from '../sorter';

function runTests() {
  console.log('Running Sorter Tests...');

  const defaultFormatting: FormattingOptions = {
    insertSpaces: true,
    tabSize: 2
  };

  const defaultOptions: SorterOptions = {
    sortDependencies: true,
    sortDevDependencies: true,
    sortPeerDependencies: true,
    sortScripts: false,
    sortOverrides: false,
    sortPnpmOverrides: false,
    groupScopes: 'inline'
  };

  // Test Case 1: Standard sorting of dependencies alphabetically (groupScopes = inline)
  {
    const original = JSON.stringify({
      name: "test-package",
      dependencies: {
        "react": "^17.0.0",
        "lodash": "^4.17.0",
        "@types/react": "^17.0.0",
        "@angular/core": "^12.0.0"
      }
    }, null, 2);

    const expected = JSON.stringify({
      name: "test-package",
      dependencies: {
        "@angular/core": "^12.0.0",
        "@types/react": "^17.0.0",
        "lodash": "^4.17.0",
        "react": "^17.0.0"
      }
    }, null, 2);

    const result = sortPackageJson(original, defaultFormatting, defaultOptions);
    assert.strictEqual(result, expected, 'Failed Case 1: Standard sorting inline');
  }

  // Test Case 2: Grouping scopes at the top
  {
    const original = JSON.stringify({
      name: "test-package",
      dependencies: {
        "react": "^17.0.0",
        "lodash": "^4.17.0",
        "@types/react": "^17.0.0",
        "@angular/core": "^12.0.0"
      }
    }, null, 2);

    const expected = JSON.stringify({
      name: "test-package",
      dependencies: {
        "@angular/core": "^12.0.0",
        "@types/react": "^17.0.0",
        "lodash": "^4.17.0",
        "react": "^17.0.0"
      }
    }, null, 2);

    const options: SorterOptions = { ...defaultOptions, groupScopes: 'top' };
    const result = sortPackageJson(original, defaultFormatting, options);
    assert.strictEqual(result, expected, 'Failed Case 2: groupScopes = top');
  }

  // Test Case 3: Grouping scopes at the bottom
  {
    const original = JSON.stringify({
      name: "test-package",
      dependencies: {
        "react": "^17.0.0",
        "lodash": "^4.17.0",
        "@types/react": "^17.0.0",
        "@angular/core": "^12.0.0"
      }
    }, null, 2);

    const expected = JSON.stringify({
      name: "test-package",
      dependencies: {
        "lodash": "^4.17.0",
        "react": "^17.0.0",
        "@angular/core": "^12.0.0",
        "@types/react": "^17.0.0"
      }
    }, null, 2);

    const options: SorterOptions = { ...defaultOptions, groupScopes: 'bottom' };
    const result = sortPackageJson(original, defaultFormatting, options);
    assert.strictEqual(result, expected, 'Failed Case 3: groupScopes = bottom');
  }

  // Test Case 4: Enabling / disabling sorting of specific sections (devDependencies, peerDependencies)
  {
    const original = JSON.stringify({
      name: "test-package",
      devDependencies: {
        "typescript": "^4.0.0",
        "eslint": "^7.0.0"
      },
      peerDependencies: {
        "react-dom": "^17.0.0",
        "react": "^17.0.0"
      }
    }, null, 2);

    // sortDevDependencies = false, sortPeerDependencies = true
    const options: SorterOptions = {
      ...defaultOptions,
      sortDevDependencies: false,
      sortPeerDependencies: true
    };

    const expected = JSON.stringify({
      name: "test-package",
      devDependencies: {
        "typescript": "^4.0.0",
        "eslint": "^7.0.0"
      },
      peerDependencies: {
        "react": "^17.0.0",
        "react-dom": "^17.0.0"
      }
    }, null, 2);

    const result = sortPackageJson(original, defaultFormatting, options);
    assert.strictEqual(result, expected, 'Failed Case 4: selectively sorting sections');
  }

  // Test Case 5: Scripts sorting
  {
    const original = JSON.stringify({
      name: "test-package",
      scripts: {
        "test": "jest",
        "build": "tsc",
        "start": "node index.js"
      }
    }, null, 2);

    // sortScripts = true
    const options: SorterOptions = {
      ...defaultOptions,
      sortScripts: true
    };

    const expected = JSON.stringify({
      name: "test-package",
      scripts: {
        "build": "tsc",
        "start": "node index.js",
        "test": "jest"
      }
    }, null, 2);

    const result = sortPackageJson(original, defaultFormatting, options);
    assert.strictEqual(result, expected, 'Failed Case 5: script sorting');
  }

  // Test Case 6: Indentation options (tabs)
  {
    const original = JSON.stringify({
      name: "test-package",
      dependencies: {
        "b": "2",
        "a": "1"
      }
    }, null, '\t');

    const expected = JSON.stringify({
      name: "test-package",
      dependencies: {
        "a": "1",
        "b": "2"
      }
    }, null, '\t');

    const result = sortPackageJson(original, { insertSpaces: false, tabSize: 4 }, defaultOptions);
    assert.strictEqual(result, expected, 'Failed Case 6: Tab indentation');
  }

  // Test Case 7: Trailing newline preservation
  {
    const original = '{\n  "dependencies": {\n    "b": "2",\n    "a": "1"\n  }\n}\n';
    const expected = '{\n  "dependencies": {\n    "a": "1",\n    "b": "2"\n  }\n}\n';

    const result = sortPackageJson(original, defaultFormatting, defaultOptions);
    assert.strictEqual(result, expected, 'Failed Case 7: Trailing newline');
  }

  // Test Case 9: Overrides sorting (npm)
  {
    const original = JSON.stringify({
      overrides: {
        "lodash": "^4.17.21",
        "chokidar": "^3.0.0",
        "@types/node": "^18.0.0"
      }
    }, null, 2);

    const expected = JSON.stringify({
      overrides: {
        "@types/node": "^18.0.0",
        "chokidar": "^3.0.0",
        "lodash": "^4.17.21"
      }
    }, null, 2);

    const result = sortPackageJson(original, defaultFormatting, {
      ...defaultOptions,
      sortOverrides: true
    });
    assert.strictEqual(result, expected, 'Failed Case 9: npm overrides sorting');
  }

  // Test Case 10: pnpm overrides sorting
  {
    const original = JSON.stringify({
      pnpm: {
        overrides: {
          "lodash": "^4.17.21",
          "chokidar": "^3.0.0",
          "@types/node": "^18.0.0"
        }
      }
    }, null, 2);

    const expected = JSON.stringify({
      pnpm: {
        overrides: {
          "@types/node": "^18.0.0",
          "chokidar": "^3.0.0",
          "lodash": "^4.17.21"
        }
      }
    }, null, 2);

    const result = sortPackageJson(original, defaultFormatting, {
      ...defaultOptions,
      sortPnpmOverrides: true
    });
    assert.strictEqual(result, expected, 'Failed Case 10: pnpm overrides sorting');
  }

  console.log('All Sorter Tests Passed!');
}

runTests();
