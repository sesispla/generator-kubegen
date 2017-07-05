"use strict";

var yaml = require('yamljs');
const val = require('../validations.js');

module.exports = {
    write: function (fs, answers, inline = 10) {
        
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
            validate: val.isNumber,
            filter: val.parseInteger
        }, {
            name: 'servicePort',
            type: 'input',
            message: '(Service) In which port should the Service listen?',
            default: 80,
            validate: val.isNumber,
            filter: val.parseInteger
        }];

        return prompts;
    }
}