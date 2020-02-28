const fs = require('fs');
const yaml = require('js-yaml');
const deepmerge = require('deepmerge');

const main = () => {
  try {
    const fileName = process.argv[2];
    // JSON encoded in base64
    const secrets = process.argv[3];
    if (!fileName || !secrets) {
      return;
    }
    const fileContents = fs.readFileSync(`./${fileName}`, 'utf8');

    let data = yaml.safeLoad(fileContents);

    if (secrets) {
      const secrets_buffer = Buffer.from(secrets, 'base64');
      data = deepmerge(data, JSON.parse(secrets_buffer.toString('utf8')));
      let yamlStr = yaml.safeDump(data);
      fs.writeFileSync(fileName, yamlStr, 'utf8');
    }
  } catch (error) {
    console.error(error);
  }
};

main();
