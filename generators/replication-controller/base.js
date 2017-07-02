"use strict";

var yaml = require('yamljs');

module.exports = {
    write: function (fs, answers, inline) {
        if (!inline) {
            inline = 10;
        }
        var rc = {
            apiVersion: 'v1',
            kind: 'ReplicationController',
            metadata: {
                name: answers.name,
                namespace: answers.namespace
            },
            spec: {
                replicas: answers.replicas,
                selector: {
                    app: answers.name
                },
                template: {
                    metadata: {
                        labels: {
                            app: answers.name
                        }
                    },
                    spec: {
                        containers: [{
                            name: answers.name,
                            image: answers.image,
                            imagePullPolicy: 'Always'
                        }]
                        // ,imagePullSecrets: 'registryKey'
                    }
                }
            }
        };

        var yamlContent = yaml.stringify(rc, inline);
        fs.write('rc.yml', yamlContent);
    },
    getPrompts: function () {
        var prompts = [{
            type: 'input',
            name: 'image',
            message: '(Replication Controller) Which Docker image should the Deployment use?',
            when: this.when,
            validate: function (str) {
                return str ? true : false;
            }
        }, {
            type: 'input',
            name: 'replicas',
            message: '(Replication Controller) How much container replicas should be created?',
            default: 1,
            validate: function (str) {
                return str && !Number.isNaN(str) && Number.isInteger(str) ? true : false;
            },
            when: this.when,
            filter: function (str) {
                return parseInt(str);
            }
        }];

        return prompts;
    },
    when: function(answers) {
        return answers.podControllerType === 'Replication Controller';
    }    
}