'use strict';

var Generator = require('yeoman-generator');
var common = require('../app/base.js');
var deployment = require('./base.js');


module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }

    initializing() {
        common.initializing(this);
    }

    prompting() {
        var prompts = common.getPrompts()
            .concat(deployment.getPrompts());

        return this.prompt(prompts).then((answers) => {
            this.answers = answers;
            answers.shouldExpose = answers.shouldExpose === 'yes';
        });
    }

    configuring() {}

    default () {}

    writing() {
        deployment.write(this.fs, this.answers);
    }

    conflicts() {}

    install() {}

    end() {}
};