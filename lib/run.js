const fs = require('fs');
const chalk = require('chalk')
const inquirer = require('inquirer')
const mkdirp = require('mkdirp')
const path = require('path')
const clipboardy = require('clipboardy')

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

const runGenerators = async (generatorsPath, { name = '', cwd = process.cwd(), args = {} }) => {
    return new Promise(resolve => {
        if(name) {
            mkdirp.sync(name);
            cwd = path.join(cwd, name);
        }

        const Generator = require(generatorsPath);
        const generator = new Generator({
            name,
            env: {
                cwd
            },
            resolved: require.resolve(generatorsPath),
            args
        })
        return generator.run(() => {
            if(name) {
                if(process.platform !== 'linux' || process.env.DISPLAY) {
                    clipboardy.writeSync(`cd ${name}`)
                    // console.log('📋 复制到粘贴板，ctrl v')
                }
                console.log('✨ 文件生成完成')
                resolve(true)
            }else {
                console.log('err: 请输入项目名称')
            }
        })
    })
}

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
        return runGenerators(`./generators/${type}`, config)
    } catch (error) {
        console.error(chalk.red('错误'), error);
        process.exit(1);
    }
}

module.exports = run