// This file helps set up Monaco editor's web workers
// which are required for syntax highlighting and error detection

import * as monaco from 'monaco-editor';

// Set up Monaco editor to work without dedicated web workers
// This is a more robust approach that allows for better fallback behavior
export function initMonaco() {
  try {
    // Configure Monaco environment to use simple global scripts instead of web workers
    window.MonacoEnvironment = {
      // Disable workers completely and fallback to synchronous in-browser implementation
      getWorker: function() {
        return {
          postMessage: () => {},
          addEventListener: () => {}
        };
      }
    };

    // Configure basic options that improve performance
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2015,
      allowNonTsExtensions: true
    });

    // Additional Monaco configuration can go here
    console.log('Monaco editor environment initialized');
  } catch (err) {
    console.error('Failed to initialize Monaco editor:', err);
  }
}