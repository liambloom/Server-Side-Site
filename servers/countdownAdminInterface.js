const readline = require("readline");
const { pool } = require("./initPool");
const uuid = require("uuid/v4");
const fs = require("fs");

console.error = error => {
  console.debug("\x1b[31m%s\x1b[0m", error);
};
console.input = (question, maxChar) => { 
  return new Promise((resolve, reject) => {
    try {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question("\n" + question + ":\n  ", (answer) => {
        if (maxChar && answer.length > maxChar) reject(new Error("Response Too Long"));
        else resolve(answer);
        rl.close();
      });
    }
    catch (err) {
      reject(err);
    }
  });
};

void async function main () {
  try {
    const name = await console.input("Event Name", 50);
    const icon = await console.input("Icon Path");
    const iconUUID = uuid() + ".svg";
    const timing = await console.input("Timing String", 50);
    const message = await console.input("Message", 40);
    const query = `
      INSERT INTO countdowns VALUES (
        uuid_generate_v4(),
        '${name.replace(/'/g, "''")}',
        'georgian',
        '${iconUUID}',
        'placeholder',
        '00000000000000000000000000000000',
        '${timing}',
        '${message.replace(/'/g, "''")}'
      );
    `;
    pool.query(query);
    fs.appendFileSync("./countdowns.sql", query);
    fs.copyFileSync(`../img/Countdowns/${icon}.svg`, `../img/Countdowns/toName/${iconUUID}`);
  }
  catch (err) {
    console.error(err);
  }
}();