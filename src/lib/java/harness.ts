import { buildCallArgs } from "./literals";

export function buildRunnerSource(options: {
  methodName: string;
  paramTypes: string[];
  returnType: string;
  args: unknown[];
}): string {
  const { methodName, paramTypes, returnType, args } = options;
  const callArgs = buildCallArgs(args, paramTypes);
  const imports = returnType.includes("List") ? "import java.util.*;\n" : "";
  let printBlock: string;
  if (returnType === "int") {
    printBlock = "        System.out.println(result);";
  } else if (returnType === "List<List<Integer>>") {
    printBlock = `        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < result.size(); i++) {
            if (i > 0) sb.append(",");
            List<Integer> pair = result.get(i);
            sb.append("[").append(pair.get(0)).append(",").append(pair.get(1)).append("]");
        }
        sb.append("]");
        System.out.println(sb.toString());`;
  } else {
    throw new Error(`Unsupported return type: ${returnType}`);
  }
  const resultType = returnType === "List<List<Integer>>" ? "List<List<Integer>>" : "int";
  return `${imports}public class Runner {
    public static void main(String[] args) {
        Solution solution = new Solution();
        ${resultType} result = solution.${methodName}(${callArgs});
${printBlock}
    }
}
`;
}

export function prepareSolutionSource(code: string): string {
  let src = code.trim();
  src = src.replace(/^\s*package\s+[\w.]+;\s*/m, "");
  src = src.replace(/\bpublic\s+class\s+Solution\b/, "class Solution");
  if (!/\bclass\s+Solution\b/.test(src)) {
    throw new Error("Your code must define a class named Solution.");
  }
  return src + "\n";
}
