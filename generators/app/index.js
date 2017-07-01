'use strict';

var Generator = require('yeoman-generator');
var yaml = require('yamljs');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.yamlIndent = 10;
    }

    initializing() {
        this.log(" ");
        this.log(" |  |/  / |  |  |  | |   _  \\  |   ____| /  _____||   ____||  \\ |  | ");
        this.log(" |  '  /  |  |  |  | |  |_)  | |  |__   |  |  __  |  |__   |   \\|  | ");
        this.log(" |    <   |  |  |  | |   _  <  |   __|  |  | |_ | |   __|  |  . `  | ");
        this.log(" |  .  \\  |  `--'  | |  |_)  | |  |____ |  |__| | |  |____ |  |\\   | ");
        this.log(" |__|\\__\\  \\______/  |______/  |_______| \\______| |_______||__| \\__| ");
        this.log(" ");
        this.log('Welcome to Kubernetes Generator (kubegen)!');
    }

    prompting() {
        var prompts = [{
            type: 'input',
            name: 'name',
            message: 'How the service should be named?',
            default: 'service1',
            validate: function (str) {
                return str ? true : false;
            }
        }, {
            type: 'input',
            name: 'namespace',
            message: 'In which Namespace should be deployed?',
            default: 'default',
            validate: function (str) {
                return str ? true : false;
            }
        }, {
            name: 'podControllerType',
            type: 'list',
            message: 'Which type of Pod controller mechanism whould you like to use?',
            choices: ['Deployment', 'Replication Controller', 'Other']
        }, {
            type: 'input',
            name: 'image',
            message: 'Which image should we use?',
            validate: function (str) {
                return str ? true : false;
            }
        }, {
            type: 'input',
            name: 'replicas',
            message: 'How much container replicas should be created?',
            default: 1,
            validate: function (str) {
                return str && !Number.isNaN(str) && Number.isInteger(str) ? true : false;
            },
            filter: function (str) {
                return parseInt(str);
            }
        }, {
            name: 'shouldExpose',
            type: 'list',
            message: 'Would like to expose the service out of the cluster?',
            choices: ['yes', 'no']
        }, {
            name: 'expose',
            type: 'list',
            message: 'Choose your expose mechanism?',
            choices: ['Ingress', 'Load Balancer'],
            when: function(answers) {
                return answers.shouldExpose === 'yes';
            }
        },{
            name: 'host',
            type: 'input',
            message: 'Does the service have a hostname?',
            when: function(answers) {
                return answers.shouldExpose === 'yes';
            }
        },{
            name: 'path',
            type: 'input',
            message: 'Ingress root path?',
            default: "/",
            when: function(answers) {
                return answers.shouldExpose === 'yes';
            }
        },{
            name: 'servicePort',
            type: 'input',
            message: 'Service port?',
            default: 80,
            when: function(answers) {
                return answers.shouldExpose === 'yes';
            },
            validate: function (str) {
                return str && !Number.isNaN(str) && Number.isInteger(str) ? true : false;
            },
            filter: function (str) {
                return parseInt(str);
            }
        }];

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
                this._writeDeployemnt(this.fs, this.answers);
                this._writeService(this.fs, this.answers);
                if (this.answers.shouldExpose) {
                    this._writeIngress(this.fs, this.answers);
                }
                break;
            case "Replication Controller":
                break;
            default:
                this.log("Not supported yet!");
                break;
        }
    }

    conflicts() {}

    install() {}

    end() {}

    _writeDeployemnt(fs, answers) {

        var deployment = {
            apiVersion: 'extensions/v1beta1',
            kind: 'Deployment',
            labels: {
                app: answers.name,
                name: answers.name
            },
            name: answers.name,
            namespace: answers.namespace,
            replicas: answers.replicas,
            metadata: {
                labels: {
                    app: answers.name
                }
            },
            containers: [{
                name: answers.name,
                image: answers.image
            }, ]
        };

        var yamlContent = yaml.stringify(deployment, this.yamlIndent);
        fs.write('deployment.yml', yamlContent);
    }

    _writeService(fs, answers) {
        var service = {
            apiVersion: 'v1',
            kind: 'Service',
            metadata: {
                name: answers.name,
                namespace: answers.namespace
            },
            spec: {
                ports: [{
                    port: 80,
                    targetPort: 80
                }]
            },
            selector: {
                app: answers.name
            }
        };

        var yamlContent = yaml.stringify(service, this.yamlIndent);
        fs.write('service.yml', yamlContent);
    }

    _writeIngress(fs, answers) {
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
                            servicePort: answers.port
                        }
                    }]
                }
            }]
        };

        var yamlContent = yaml.stringify(ingress, this.yamlIndent);
        fs.write('ingress.yml', yamlContent);
    }
};