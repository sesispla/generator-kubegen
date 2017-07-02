'use strict';

var Generator = require('yeoman-generator');
var common = require('./base.js');
var ingress = require('../ingress/base.js');
var deployment = require('../deployment/base.js');
var rc = require('../replication-controller/base.js');
var service = require('../service/base.js');


module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }

    initializing() {
        common.initializing(this);
    }

    prompting() {
        var prompts = common.getPrompts()
        .concat([{
            name: 'podControllerType',
            type: 'list',
            message: 'Which type of Pod controller mechanism whould you like to use?',
            choices: ['Deployment', 'Replication Controller', 'Other']
        }])
        .concat(deployment.getPrompts())
        .concat(rc.getPrompts())
        .concat(ingress.getPrompts());

        return this.prompt(prompts).then((answers) => {
            this.answers = answers;
            answers.shouldExpose = answers.shouldExpose === 'yes';
        });
    }

    configuring() {}

    default () {}

    writing() {
        this.destinationRoot("./" + this.answers.name);
        switch (this.answers.podControllerType) {
            case "Deployment":
                deployment.write(this.fs, this.answers);
                break;
            case "Replication Controller":
                rc.write(this.fs, this.answers);
                break;
            default:
                this.log("Not supported yet!");
                break;
        }

        service.write(this.fs, this.answers);
        if (this.answers.shouldExpose) {
            ingress.write(this.fs, this.answers);
        }        
    }

    conflicts() {}

    install() {}

    end() {}
};