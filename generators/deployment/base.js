"use strict";

var yaml = require('yamljs');
var val = require('../validations.js');

module.exports = {
    write: function (fs, answers, inline = 10) {
        var deployment = {
            apiVersion: 'extensions/v1beta1',
            kind: 'Deployment',
            metadata: {
                labels: {
                    name: answers.name
                },
                name: answers.name,
                namespace: answers.namespace
            },
            spec: {
                replicas: answers.replicas,
                template: {
                    metadata: {
                        labels: {
                            app: answers.name
                        }
                    },
                    spec:  {
                        containers: [{
                            name: answers.name,
                            image: answers.image
                        }]
                    }
                }
            }
        };

        var yamlContent = yaml.stringify(deployment, inline);
        fs.write('deployment.yml', yamlContent);
    },
    getPrompts: function () {
        var prompts = [{
            type: 'input',
            name: 'image',
            message: '(Deployment) Which Docker image should the Deployment use?',
            when: this.when,
            validate: val.isString
        }, {
            type: 'input',
            name: 'replicas',
            message: '(Deployment) How much container replicas should be created?',
            default: 1,
            validate: function (str) {
                return str && !Number.isNaN(str) && Number.isInteger(str) ? true : false;
            },
            when: this.when,
            filter: val.parseInteger
        }];

        return prompts;
    },
    when: function (answers) {
        return answers.podControllerType === 'Deployment' || !answers.podControllerType;
    }
}