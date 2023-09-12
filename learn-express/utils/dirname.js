import { fileURLToPath } from "url";
import path from "path";

// Use the `import.meta.url` property to get the URL of the current module file.
const currentModuleURL = import.meta.url;

// Convert the URL to a file path using the `fileURLToPath` function.
const currentModulePath = fileURLToPath(currentModuleURL);

// Get the directory name (folder) of the current module file.
export default path.join(path.dirname(currentModulePath), "..");
