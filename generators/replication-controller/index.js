'use strict';

var Generator = require('yeoman-generator');
var common = require('../app/base.js');
var rc = require('./base.js');


module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }

    initializing() {
        common.initializing(this);
    }

    prompting() {
        var prompts = common.getPrompts()
            .concat(rc.getPrompts());

        return this.prompt(prompts).then((answers) => {
            this.answers = answers;
        });
    }

    configuring() {}

    default () {}

    writing() {
        rc.write(this.fs, this.answers);
    }

    conflicts() {}

    install() {}

    end() {}
};