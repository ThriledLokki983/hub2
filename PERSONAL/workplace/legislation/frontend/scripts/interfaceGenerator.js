import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';


const FILE_EXTENSION = `.tsx`;
const COMPONENTS_FOLDER = './src/components';

const InterfaceGenerator = () => {

  const createInterfaceFile = (componentFile) => {
    // Assuming your components use the .tsx extension.
    const componentName = path.basename(componentFile, FILE_EXTENSION);
    const interfaceFilePath = path.join(path.dirname(componentFile), `${componentName}.interface.ts`);

    if (!fs.existsSync(interfaceFilePath)) {
      // Add export statement.
      const interfaceContent = `export interface ${componentName}Props {\n  // Define your props here\n}\n`;
      fs.writeFileSync(interfaceFilePath, interfaceContent);
      console.log(`Interface file created: ${interfaceFilePath}`);

      // Read the component file content.
      const componentContent = fs.readFileSync(componentFile, 'utf-8');

      // Add import statement.
      const importStatement = `import { ${componentName}Props } from './${componentName}.interface';\n`;
      const updatedComponentContent = importStatement + componentContent;

      // Write the updated content back to the component file.
      fs.writeFileSync(componentFile, updatedComponentContent);
      console.log(`Updated component file with import: ${componentFile}`);
    }
  };

  const watcher = chokidar.watch(COMPONENTS_FOLDER, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  });

  return {
    init: () => {
      return watcher
        .on('add', (componentFile) => {
          if (path.extname(componentFile) === FILE_EXTENSION) {
            createInterfaceFile(componentFile);
          }
        })
        .on('ready', () => {
          console.log('Watching for component file changes...');
        });
    },
  };

};

export default InterfaceGenerator;
