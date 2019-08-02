let CleanCSS=require("clean-css");

class Plugin {
    apply(compiler) {
        compiler.plugin('emit', function(compilation, callback) {
            compilation.chunks.forEach(function(chunk) {
                // chunk.modules是模块的集合（构建时webpack梳理出的依赖，即import、require的module）
                // 最终生成的文件的集合
                chunk.files.forEach(function(filename) {
                    if(/\.css$/.test(filename)){
                        let source = compilation.assets[filename].source();
                        let output = new CleanCSS({
                            format: 'beautify',
                            level: {
                                2: {
                                    all: false, // sets all values to `false`
                                    removeDuplicateRules: true, // turns on removing duplicate rules
                                    removeEmpty: true,
                                    reduceNonAdjacentRules: true, // controls non-adjacent rule reducing; defaults to true
                                    removeDuplicateFontRules: true, // controls duplicate `@font-face` removing; defaults to true
                                    removeDuplicateMediaBlocks: true, // controls duplicate `@media` removing; defaults to true
                                }
                            }
                        }).minify(source);
                        compilation.assets[filename]={
                            source:function(){
                                return `${output.styles}`;
                            },
                            size:function(){
                                return `${output.styles}`.length;
                            }
                        };
                    }
                });
            });
            callback();
        });
    }
}
module.exports = Plugin;