const BasicGenerator = require('../../BasicGenerator.js')

class Generator extends BasicGenerator {
    prompting() {
        if(this.opts.args && 'isTypeScript' in this.opts.args && 'reactFeatures' in this.opts.args) {
            this.prompts = {
                isTypeScript: this.opts.args.isTypeScript,
                reactFeatures: this.opts.args.reactFeatures
            }
        } else {
            const prompts = [{
                name: 'isTypeScript',
                type: 'confirm',
                message: '是否使用typeScript？',
                default: false
            }, {
                name: 'reactFeatures',
                type: 'checkbox',
                message: '您希望启用什么功能?',
                choices: [{
                    name: 'antd',
                    value: 'antd'
                }, 
                // {
                    // name: 'code splitting',
                    // value: 'dynamicImport'
                // }
            ]
            }];
            return this.prompt(prompts).then(props => {
                this.prompts = props;
            })
        } 
    }
    writing() {
        this.writeFiles({
            context: {
                name: this.name,
                ...this.prompts
            },
            filterFiles: f => {
                const { isTypeScript } = this.prompts
                if(isTypeScript) {
                    if(f.startsWith('scripts/') || f.startsWith('public/') || f.startsWith('config/')) return true;
                    if(f.endsWith('.js')) return false;
                } else {
                    if(this.isTsFile(f)) return false;
                }
                return true;
            }
        })
    }
}

module.exports = Generator