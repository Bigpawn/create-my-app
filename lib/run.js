const fs = require('fs');
const chalk = require('chalk')
const inquirer = require('inquirer')

const generators = fs
  .readdirSync(`${__dirname}/generators`)
  .filter(f => !f.startsWith('.'))
  .map(f => {
      return {
          name: `${f.padEnd(15)}-${chalk.gray(require(`./generators/${f}/meta.json`).description)}`,
          value: f,
          short: f
      }
  })


const run = async config => {
    process.send && process.send({type: 'prompt'});
    process.emit('message', { type: 'prompt' });
    let { type } = config
    if(!type) {
        const awswers = await inquirer.prompt([
            {
                name: 'type',
                message: '选择需要创建的项目',
                type: 'list',
                choices: generators
            }
        ]);
        type = awswers.type;
    }

    try {
        
    } catch (error) {
        console.error(chalk.red('错误'), error);
        process.exit(1);
    }
}

module.exports = run