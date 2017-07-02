"use strict";

var yaml = require('yamljs');

module.exports = {
    write: function (fs, answers, inline) {
        if (!inline) {
            inline = 10;
        }
        var ingress = {
            apiVersion: 'extensions/v1beta1',
            kind: 'Ingress',
            metadata: {
                name: answers.name,
                namespace: answers.namespace
            },
            rules: [{
                host: answers.host,
                http: {
                    paths: [{
                        path: answers.path,
                        backend: {
                            serviceName: answers.name,
                            servicePort: answers.ingressPort
                        }
                    }]
                }
            }]
        };

        var yamlContent = yaml.stringify(ingress, inline);
        fs.write('ing.yml', yamlContent);
    },
    getPrompts: function () {

        var prompts = [{
            name: 'shouldExpose',
            type: 'list',
            message: '(Ingress) Would like to expose the service out of the cluster?',
            choices: ['yes', 'no']
        }, {
            name: 'host',
            type: 'input',
            message: '(Ingress) Does the service have a hostname?',
            when: function (answers) {
                return answers.shouldExpose === 'yes';
            }
        }, {
            name: 'path',
            type: 'input',
            message: '(Ingress) Ingress root path?',
            default: "/",
            when: function (answers) {
                return answers.shouldExpose === 'yes';
            }
        }, {
            name: 'ingressPort',
            type: 'input',
            message: '(Ingress) In which port should the Ingress listen?',
            default: 80,
            when: function (answers) {
                return answers.shouldExpose === 'yes';
            },
            validate: function (str) {
                return str && !Number.isNaN(str) && Number.isInteger(str) ? true : false;
            },
            filter: function (str) {
                return parseInt(str);
            }
        }];

        return prompts;
    }
}