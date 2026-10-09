import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor/editor";
import "monaco-editor/languages/definitions/java/register";

self.MonacoEnvironment = {
  getWorker: () =>
    new Worker(new URL("monaco-editor/editor/editor.worker", import.meta.url), {
      type: "module",
    }),
};

loader.config({ monaco });
