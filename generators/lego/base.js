"use strict";

var yaml = require('yamljs');
const val = require('../validations.js');

module.exports = {
    write: function (fs, answers, inline = 10) {
        var deployment = {
            "apiVersion": "extensions/v1beta1",
            "kind": "Deployment",
            "metadata": {
                "name": answers.name,
                "namespace": answers.namespace
            },
            "spec": {
                "replicas": 1,
                "template": {
                    "metadata": {
                        "labels": {
                            "app": answers.name
                        }
                    },
                    "spec": {
                        "containers": [{
                            "name": answers.name,
                            "image": answers.image,
                            "imagePullPolicy": "Always",
                            "ports": [{
                                "containerPort": 8080
                            }],
                            "env": [{
                                    "name": "LEGO_EMAIL",
                                    "valueFrom": {
                                        "configMapKeyRef": {
                                            "name": "kube-lego",
                                            "key": "lego.email"
                                        }
                                    }
                                },
                                {
                                    "name": "LEGO_URL",
                                    "valueFrom": {
                                        "configMapKeyRef": {
                                            "name": "kube-lego",
                                            "key": "lego.url"
                                        }
                                    }
                                },
                                {
                                    "name": "LEGO_NAMESPACE",
                                    "valueFrom": {
                                        "fieldRef": {
                                            "fieldPath": "metadata.namespace"
                                        }
                                    }
                                },
                                {
                                    "name": "LEGO_POD_IP",
                                    "valueFrom": {
                                        "fieldRef": {
                                            "fieldPath": "status.podIP"
                                        }
                                    }
                                }
                            ],
                            "readinessProbe": {
                                "httpGet": {
                                    "path": "/healthz",
                                    "port": 8080
                                },
                                "initialDelaySeconds": 5,
                                "timeoutSeconds": 1
                            }
                        }]
                    }
                }
            }
        };

        var configMap = {
            "apiVersion": "v1",
            "kind": "ConfigMap",
            "metadata": {
                "name": answers.name,
                "namespace": answers.namespace
            },
            "data": {
                "lego.email": answers.lego.mail,
                "lego.url": answers.lego.url
            }
        };

        var deploymentYml = yaml.stringify(deployment, inline);
        fs.write('deployment.yml', deploymentYml);
        var configMapYml = yaml.stringify(configMap, inline);
        fs.write('configmap.yml', configMapYml);
    },
    getPrompts: function () {
        var prompts = [{
            type: 'input',
            name: 'image',
            message: '(Let\'s Encrypt) Which Docker image should the Deployment use?',
            default: 'jetstack/kube-lego:0.1.4',
            validate: val.isString
        }, {
            type: 'input',
            name: 'lego.mail',
            message: '(Let\'s Encrypt) Your Let\'s Encrypt e-mail?',
            validate: val.isString
        }, {
            type: 'input',
            name: 'lego.url',
            message: '(Let\'s Encrypt) Is the Let\'s Encrypt service URL correct?',
            default: 'https://acme-v01.api.letsencrypt.org/directory'
        }];

        return prompts;
    }
}