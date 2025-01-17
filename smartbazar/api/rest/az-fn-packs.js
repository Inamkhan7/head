const fs = require('fs');

fs.mkdirSync('node_modules/@packages', { recursive: true });

fs.cp(
  `../../node_modules`,
  `node_modules`,
  { recursive: true, dereference: true },
  (err) => {
    if (err) {
      console.error(`AZ-FN (node_modules):`, err);
    } else {
      console.info(
        `AZ-FN (node_modules): Copy for azure functions workaround done!`,
      );
    }
  },
);
