"use strict";

var yaml = require("yamljs");
const val = require("../validations.js");

module.exports = {
    write: function (fs, answers, inline = 10) {
        var ingress = {
            apiVersion: "extensions/v1beta1",
            kind: "Ingress",
            metadata: {
                name: answers.name,
                namespace: answers.namespace,
                annotations: {

                }
            },
            spec: {
                rules: [{
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
            }
        };

        if (answers.host) {
            ingress.spec.rules[0].host = answers.host;
        }

        switch (answers.ingressType) {
            case "tls-lego":
                ingress.metadata.annotations["kubernetes.io/tls-acme"] = "true";
                ingress.spec.tls = [
                {
                    "hosts": [
                    answers.host
                    ],
                    "secretName": answers.legoSecretName
                }];
                break;
            default:
                ingress.metadata.annotations["kubernetes.io/ingress.class"] = answers.ingressType;
            break;
        }

        var yamlContent = yaml.stringify(ingress, inline);
        fs.write("ing.yml", yamlContent);
    },
    getPrompts: function () {

        var prompts = [{
            name: "shouldExpose",
            type: "list",
            message: "(Ingress) Would like to expose the service out of the cluster?",
            choices: ["yes", "no"]
        }, {
            name: "ingressType",
            type: "list",
            message: "(Ingress) Which class of expose would you like?",
            choices: ["external", "internal", "nginx", "tls-lego"],
            default: "external"
        }, {
            name: "host",
            type: "input",
            message: "(Ingress) Does the service have a hostname?",
            when: this.when.shouldExpose
        }, {
            name: "legoSecretName",
            type: "input",
            message: "(Ingress) A name for the kube-lego TLS storage secret?",
            validate: val.isString,
            when: this.when.shouldExposeTls
        }, {
            name: "path",
            type: "input",
            message: "(Ingress) Ingress root path?",
            default: "/",
            when: this.when.shouldExpose
        }, {
            name: "ingressPort",
            type: "input",
            message: "(Ingress) In which port should the Ingress listen?",
            default: 80,
            when: this.when.shouldExpose,
            validate: val.isNumber,
            filter: val.parseInteger
        }];

        return prompts;
    },
    when: {
        shouldExpose(answers) {
            return answers.shouldExpose === "yes";
        },
        shouldExposeTls(answers) {
            return answers.shouldExpose === "yes" && answers.ingressType === "tls-lego";
        }
    },
}