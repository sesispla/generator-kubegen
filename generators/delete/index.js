'use strict';

var Generator = require('yeoman-generator');
var common = require('../app/base.js');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.argument('name', { type: String, required: false });     
    }

    initializing() {
        common.initializing(this);
    }

    prompting() {
        if (this.options.name) {
            return;
        }

        var prompts = prompts = [{
            type: 'input',
            name: 'name',
            message: 'Which service would like to delete?',
            validate: function (str) {
                return str ? true : false;
            }
        }];

        return this.prompt(prompts).then((answers) => {
            this.options.name = answers.name;
        });
    }

    configuring() {}

    default () {}

    writing() {
    }

    conflicts() {}

    install() {
        this.destinationRoot("./" + this.options.name);
        common.spawnKubectlCommand(this, this.destinationRoot(), "delete");
    }

    end() {}
};