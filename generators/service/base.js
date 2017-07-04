"use strict";

var yaml = require('yamljs');

module.exports = {
    write: function (fs, answers, inline) {
        if (!inline) {
            inline = 10;
        }

        var service = {
            apiVersion: 'v1',
            kind: 'Service',
            metadata: {
                name: answers.name,
                namespace: answers.namespace
            },
            spec: {
                ports: [{
                    port: answers.servicePort,
                    targetPort: answers.containerPort
                }],
                selector: {
                    app: answers.name
                }
            }
        };

        var yamlContent = yaml.stringify(service, inline);
        fs.write('svc.yml', yamlContent);
    },
    getPrompts: function () {
        var prompts = [{
            name: 'containerPort',
            type: 'input',
            message: '(Service) In which port is the Container listening?',
            default: 80,
            validate: function (str) {
                return str && !Number.isNaN(str) && Number.isInteger(str) ? true : false;
            },
            filter: function (str) {
                return parseInt(str);
            }
        }, {
            name: 'servicePort',
            type: 'input',
            message: '(Service) In which port should the Service listen?',
            default: 80,
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