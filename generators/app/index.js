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
        this.argument('apply', { required: false });
    }

    initializing() {
        common.initializing(this);
    }

    prompting() {

        var prompts = common.getPrompts();
        if (!this.options.delete){        
            prompts = prompts
            .concat([{
                name: 'podControllerType',
                type: 'list',
                message: 'Which type of Pod controller mechanism whould you like to use?',
                choices: ['Deployment', 'Replication Controller', 'Other']
            }])
            .concat(deployment.getPrompts())
            .concat(rc.getPrompts())
            .concat(service.getPrompts())
        .concat(ingress.getPrompts());
        }

        return this.prompt(prompts).then((answers) => {
            this.answers = answers;
            answers.shouldExpose = answers.shouldExpose === 'yes';
        });
    }

    configuring() {}

    default () {}

    writing() {
        this.destinationRoot("./" + this.answers.name);

        if (this.options.delete)
        {
            return;
        }
                
        switch (this.answers.podControllerType) {
            case "Deployment":
                deployment.write(this.fs, this.answers);
                break;
            case "Replication Controller":
                rc.write(this.fs, this.answers);
                break;
            default:
                this.log("Not supported yet!");
                return;
        }

        service.write(this.fs, this.answers);
        if (this.answers.shouldExpose) {
            ingress.write(this.fs, this.answers);
        }        
    }

    conflicts() {}

    install() {
        if (this.options.apply) {
            common.spawnKubectlCommand(this, this.destinationRoot(), "apply");
        }
    }

    end() {}
};