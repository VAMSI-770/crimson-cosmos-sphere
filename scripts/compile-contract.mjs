/**
 * Compiles contracts/PortfolioRegistry.sol into a browser-importable artifact
 * (ABI + creation bytecode) at src/lib/blockchain/PortfolioRegistry.json.
 *
 * Run: node scripts/compile-contract.mjs
 */
import solc from "solc";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = fs.readFileSync(path.join(root, "contracts/PortfolioRegistry.sol"), "utf8");

const input = {
  language: "Solidity",
  sources: { "PortfolioRegistry.sol": { content: source } },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
  },
};

function findImport(importPath) {
  const candidate = path.join(root, "node_modules", importPath);
  if (fs.existsSync(candidate)) return { contents: fs.readFileSync(candidate, "utf8") };
  return { error: `File not found: ${importPath}` };
}

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImport }));

const fatal = (output.errors || []).filter((e) => e.severity === "error");
if (fatal.length) {
  console.error(fatal.map((e) => e.formattedMessage).join("\n"));
  process.exit(1);
}

const contract = output.contracts["PortfolioRegistry.sol"].PortfolioRegistry;
const artifact = {
  contractName: "PortfolioRegistry",
  compiler: solc.version(),
  abi: contract.abi,
  bytecode: `0x${contract.evm.bytecode.object}`,
};

const target = path.join(root, "src/lib/blockchain/PortfolioRegistry.json");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, `${JSON.stringify(artifact, null, 2)}\n`);
console.log(`Wrote ${target} (${artifact.bytecode.length / 2} bytes of bytecode)`);
