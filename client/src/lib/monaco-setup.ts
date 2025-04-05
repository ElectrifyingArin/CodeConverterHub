// This file helps set up Monaco editor's web workers
// which are required for syntax highlighting and error detection

import * as monaco from 'monaco-editor';

// This is needed for Monaco editor to work properly in a browser environment
self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: string, label: string) {
    if (label === 'json') {
      return '/monaco-editor/json.worker.js';
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return '/monaco-editor/css.worker.js';
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return '/monaco-editor/html.worker.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return '/monaco-editor/ts.worker.js';
    }
    return '/monaco-editor/editor.worker.js';
  }
};

export function initMonaco() {
  // Nothing else needed for now, just importing this file sets up the environment
  console.log('Monaco editor environment initialized');
}