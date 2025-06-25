import fastGlob from 'fast-glob';
import fs from 'fs/promises';
import path from 'path';
import z from 'zod';
import { printNode, zodToTs } from 'zod-to-ts';

const snakeToCamel = (str: string) =>
  str.toLowerCase().split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

const toRoutePath = (file: string) =>
  "/" + file
    .replace(/^.*src\/routes\//, "")
    .replace(/\.(ts|js)$/, "")
    .replace(/\[\.{3}[^\]]+\]/g, "*") // [...slug] => *
    .replace(/\[([^\]]+)\]/g, ":$1"); // [id] => :id

const toRouteName = (file: string) =>
  file
    .replace(/^.*src\/routes\//, "")
    .replace(/\.(ts|js)$/, "")
    .replaceAll(/\[\.{3}[^\]]+\]/g, "*") // [...slug] => *
    .replaceAll(/\[([^\]]+)\]/g, "_$1") // [id] => :id
    .replaceAll(/\//g, "_")
    .replaceAll("-", "_")
async function main() {
  let files = await fastGlob([path.join(process.cwd(), "/src/routes/**/{get,post,put,delete,patch}.ts")]);
  
  const routeMap: Record<string, string[]> = {};
  const apiRouteEntries: string[] = [];

  for (const file of files) {
    const mod = await import(path.resolve(file));
    const method = path.basename(file, ".ts").toUpperCase(); // "get" -> "GET"
    const routePath = toRoutePath(file);
    const routeName = snakeToCamel(toRouteName(file));

    const options = mod.options;
    
    if (!options?.schema) continue;

    const parts: string[] = [];
    const fields: string[] = [];

    for (const key of ["body", "querystring", "params", "response"] as const) {
      if (key === "response") {
        const response = options.schema[key] as Record<number, z.ZodTypeAny> | undefined;
        if (response) {
          const names: Record<string, number> = {};
          for (const [key, value] of Object.entries(response)) {
            const { node } = zodToTs(value, `${routeName}_${key}`);
            const typeName = "Response" + key;
            parts.push(`export type ${typeName} = ${printNode(node)}`);
            names[`${routeName}.${typeName}`] = Number(key);
          }
          
          const successResponses = Object.entries(names).filter(([, value]) => value < 400).map(([name]) => name);
          const errorResponses = Object.entries(names).filter(([, value]) => value >= 400).map(([name]) => name);
          const responseType = successResponses.length ? successResponses.join(" | ") : "unknown";
          const errorType = errorResponses.length ? errorResponses.join(" | ") : "unknown";

          fields.push(`response: {} as ${responseType}`);
          fields.push(`error: {} as ${errorType}`);
        } else {
          fields.push("response: {} as unknown");
          fields.push("error: {} as unknown");
        }
        continue;
      }
      const schema = options.schema[key];
      if (schema) {
        const { node } = zodToTs(schema, `${routeName}_${key}`);
        const typeName = snakeToCamel(key);
        parts.push(`export type ${typeName} = ${printNode(node)}`);
        fields.push(`${key}: {} as ${routeName}.${typeName}`);
      } else {
        fields.push(`${key}: {} as any`);
      }
    }

    const fullNamespace = `export namespace ${routeName} {\n${parts.join("\n")}\n}`;
    if (!routeMap[routeName]) routeMap[routeName] = [];
    routeMap[routeName].push(fullNamespace);

    const entry = `  "[${method}] ${routePath.replace(`/${method.toLowerCase()}`, "")}": {
    method: "${method}",
    ${fields.join(",\n    ")}
  }`;
    apiRouteEntries.push(entry);
  }

  const typeEntries = Object.values(routeMap).map(group => group.join("\n\n")).join("\n\n");

  const routeConstant = `export const apiRoutes = {\n${apiRouteEntries.join(",\n\n")}\n} as const;`;

  const output = `// GENERATED FILE — DO NOT EDIT

${typeEntries}

${routeConstant}

export type ApiRoutes = typeof apiRoutes;
export type ApiPath = keyof ApiRoutes;
export type RouteData<Path extends ApiPath> = ApiRoutes[Path];
`;
  const commonPath = path.join(process.cwd(), "../../packages/common")
  // verify if __generated__ folder exists
  try {
    await fs.readdir(path.join(commonPath, "src/__generated__"));
  } catch (error) {
    await fs.mkdir(path.join(commonPath, "src/__generated__")); 
  }
  await fs.writeFile(path.join(commonPath, "src/__generated__/api.ts"), output);
  console.log("✅ Types and apiRoutes generated!");
}

main().catch((err) => {
  console.error("Erro ao gerar tipos:", err);
  process.exit(1);
});
