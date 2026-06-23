import * as vscode from 'vscode';
import { sortPackageJson, SorterOptions } from './sorter';

/**
 * Reads the configuration values from vscode workspace configuration.
 */
function getSorterOptions(): SorterOptions {
  const config = vscode.workspace.getConfiguration('smartSorter');
  return {
    sortDependencies: config.get<boolean>('sortDependencies', true),
    sortDevDependencies: config.get<boolean>('sortDevDependencies', true),
    sortPeerDependencies: config.get<boolean>('sortPeerDependencies', true),
    sortScripts: config.get<boolean>('sortScripts', false),
    groupScopes: config.get<'top' | 'bottom' | 'inline'>('groupScopes', 'inline')
  };
}

/**
 * Helper to run the sorting process with optional settings overrides.
 */
async function runSortCommand(
  editor: vscode.TextEditor,
  overrideOptions?: Partial<SorterOptions>
) {
  const document = editor.document;
  
  // Check if the current file is indeed package.json
  if (!document.fileName.endsWith('package.json')) {
    vscode.window.showWarningMessage('Smart Sorter can only be executed on package.json files.');
    return;
  }

  const text = document.getText();
  const formattingOptions = {
    insertSpaces: typeof editor.options.insertSpaces === 'boolean'
      ? editor.options.insertSpaces
      : true,
    tabSize: typeof editor.options.tabSize === 'number'
      ? editor.options.tabSize
      : 2
  };

  const baseOptions = getSorterOptions();
  const options = overrideOptions ? { ...baseOptions, ...overrideOptions } : baseOptions;

  try {
    const sortedText = sortPackageJson(text, formattingOptions, options);
    
    // Perform the edit on the document
    await editor.edit(editBuilder => {
      const start = document.positionAt(0);
      const end = document.positionAt(text.length);
      const range = new vscode.Range(start, end);
      editBuilder.replace(range, sortedText);
    });
    
    vscode.window.showInformationMessage('package.json sorted successfully!');
  } catch (error: any) {
    // For manual commands, show a discrete warning message on invalid JSON syntax
    vscode.window.showWarningMessage(
      `Failed to sort package.json: Invalid JSON syntax. ${error?.message || ''}`
    );
  }
}

export function activate(context: vscode.ExtensionContext) {
  // Document selector targeting json language specifically for package.json files
  const documentSelector: vscode.DocumentSelector = {
    language: 'json',
    pattern: '**/package.json'
  };

  // Register the document formatting provider
  const formattingProvider = vscode.languages.registerDocumentFormattingEditProvider(
    documentSelector,
    {
      provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions
      ): vscode.TextEdit[] {
        const text = document.getText();
        try {
          const sortedText = sortPackageJson(text, {
            insertSpaces: options.insertSpaces,
            tabSize: options.tabSize
          }, getSorterOptions());

          const start = document.positionAt(0);
          const end = document.positionAt(text.length);
          const range = new vscode.Range(start, end);

          return [vscode.TextEdit.replace(range, sortedText)];
        } catch (error) {
          // If JSON is invalid, return empty array to do nothing during formatting
          return [];
        }
      }
    }
  );

  // Command handlers
  const sortConfiguredCommand = vscode.commands.registerCommand('smartSorter.sortCurrentFile', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      runSortCommand(editor);
    }
  });

  const sortAllCommand = vscode.commands.registerCommand('smartSorter.sortAllSections', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      runSortCommand(editor, {
        sortDependencies: true,
        sortDevDependencies: true,
        sortPeerDependencies: true,
        sortScripts: true
      });
    }
  });

  const sortDepsCommand = vscode.commands.registerCommand('smartSorter.sortDepsOnly', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      runSortCommand(editor, {
        sortDependencies: true,
        sortDevDependencies: false,
        sortPeerDependencies: false,
        sortScripts: false
      });
    }
  });

  const sortDevDepsCommand = vscode.commands.registerCommand('smartSorter.sortDevDepsOnly', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      runSortCommand(editor, {
        sortDependencies: false,
        sortDevDependencies: true,
        sortPeerDependencies: false,
        sortScripts: false
      });
    }
  });

  const sortPeerDepsCommand = vscode.commands.registerCommand('smartSorter.sortPeerDepsOnly', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      runSortCommand(editor, {
        sortDependencies: false,
        sortDevDependencies: false,
        sortPeerDependencies: true,
        sortScripts: false
      });
    }
  });

  const sortScriptsCommand = vscode.commands.registerCommand('smartSorter.sortScriptsOnly', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      runSortCommand(editor, {
        sortDependencies: false,
        sortDevDependencies: false,
        sortPeerDependencies: false,
        sortScripts: true
      });
    }
  });

  context.subscriptions.push(
    formattingProvider,
    sortConfiguredCommand,
    sortAllCommand,
    sortDepsCommand,
    sortDevDepsCommand,
    sortPeerDepsCommand,
    sortScriptsCommand
  );
}

export function deactivate() {
  // Cleanup resources
}
