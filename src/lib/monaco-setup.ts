import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor/editor";
import "monaco-editor/languages/definitions/java/register";

// Bundle Monaco from node_modules instead of the default jsDelivr CDN so the
// editor works with no network connection.
self.MonacoEnvironment = {
  getWorker: () =>
    new Worker(new URL("monaco-editor/editor/editor.worker", import.meta.url), {
      type: "module",
    }),
};

loader.config({ monaco });
