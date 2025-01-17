const fs = require('fs');
const path = require('path');

const getModulePath = (module) =>
  fs.existsSync(path.resolve(`./node_modules/${module}`))
    ? `./node_modules/${module}`
    : fs.existsSync(path.resolve(`../../node_modules/${module}`))
    ? `../../node_modules/${module}`
    : '.';

console.info(`Swagger styles found ${getModulePath('swagger-ui-dist')}`);

fs.copyFile(
  `${getModulePath('swagger-ui-dist')}/swagger-ui.css`,
  'dist/swagger-ui.css',
  (err) => {
    if (err) throw err;
    console.info('swagger-ui.css was copied');
  },
);

fs.cp('docs', 'dist/docs', { recursive: true }, (err) => {
  if (err) {
    console.error(err);
  }
});
