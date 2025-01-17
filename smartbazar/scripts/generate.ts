import fs from "fs";
import yargs from "yargs";
import path from "path";
import generators from "./generators";

yargs
  .scriptName("schema-generator")
  .usage("$0 <cmd> [args] -")
  .command(
    "gen [data]",
    "Generate migration schema from existing JSON data structure.",
    (yargs) => {
      yargs.positional("data", {
        type: "string",
        alias: "d",
        describe: "Local folder path",
      });
      yargs.positional("provider", {
        type: "string",
        alias: "p",
        describe: "Possible values: OrderCloud, BigCommerce, Shopify",
      });
    },
    function (argv) {
      let dataUrl = argv.d as string;
      let provider = argv.p as string;

      const generator = generators[provider];

      if (!generator) {
        return console.error("Provider is not valid");
      }

      let data = {};
      try {
        fs.readdirSync(path.resolve(__dirname, dataUrl)).forEach((file) => {
          const filePath = path.resolve(__dirname, dataUrl, file);
          const stringData = fs.readFileSync(filePath, "utf8");
          const dataKey = file.split(".")[0];
          data[dataKey] = JSON.parse(stringData);
          console.info(`Found file \"${file}\"`);
        });
      } catch (err) {
        return console.error(`Directory not \"${dataUrl}\" found`);
      }
      try {
        const schema = generator(data);
        fs.writeFileSync(
          `${provider}-data.json`,
          JSON.stringify(schema),
          "utf8"
        );
      } catch (e) {
        return console.error(`Error while generating the schema: ${e}`);
      }
    }
  )
  .help().argv;
