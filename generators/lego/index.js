'use strict';

var Generator = require('yeoman-generator');
var common = require('../app/base.js');
var svc = require('./base.js');


module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }

    initializing() {
        common.initializing(this);
    }

    prompting() {
        var prompts = common.getPrompts()
            .concat(svc.getPrompts());

        return this.prompt(prompts).then((answers) => {
            this.answers = answers;
        });
    }

    configuring() {}

    default () {}

    writing() {
        this.destinationRoot("./kube-lego");
        svc.write(this.fs, this.answers);
    }

    conflicts() {}

    install() {}

    end() {}
};