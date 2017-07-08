'use strict';

var yeoman = require('yeoman-generator');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var path = require('path');
var yaml = require('yamljs');
var expect = require('expect');
var touch = require('touch');

describe('Replication Controller without Ingress scenarios', function () {

    beforeEach(function () {
        return helpers.run(path.join(__dirname, '../generators/app'))
            .withPrompts({
                name: 'nginx',
                namespace: 'default',
                podControllerType: 'Replication Controller',
                image: 'nginx',
                replicas: 1,
                containerPort: 80,
                servicePort: 8080,
                shouldExpose: false
            });
    });    

    it('File rc.yml is generated and filled in', function () {
        assert.file(['rc.yml']);
        var rc = yaml.load('rc.yml');
        assert.equal(rc.apiVersion, 'v1');
        assert.equal(rc.kind, 'ReplicationController');
        assert.equal(rc.metadata.name, 'nginx');
        assert.equal(rc.metadata.namespace, 'default');
        assert.equal(rc.spec.replicas, 1);
        assert.equal(rc.spec.selector.app, 'nginx');
        assert.equal(rc.spec.template.metadata.labels.app, 'nginx');
        assert.equal(rc.spec.template.spec.containers[0].name, 'nginx');
        assert.equal(rc.spec.template.spec.containers[0].image, 'nginx');
    });

    it('File svc.yml is generated and filled in', function () {
        assert.file(['svc.yml']);
        var svc = yaml.load('svc.yml');
        assert.equal(svc.apiVersion, 'v1');
        assert.equal(svc.kind, 'Service');
        assert.equal(svc.metadata.name, 'nginx');
        assert.equal(svc.metadata.namespace, 'default');
        assert.equal(svc.spec.ports[0].port, 8080);
        assert.equal(svc.spec.ports[0].targetPort, 80);
        assert.equal(svc.spec.selector.app, 'nginx');
    });

    it('File ing.yml is not generated', function () {
        assert.noFile(['ing.yml']);
    });

    it('File deployment.yml is not generated', function () {
        assert.noFile(['deployment.yml']);
    });    

});

describe('Replication Controller with Ingress scenarios', function () {

    beforeEach(function () {
        return helpers.run(path.join(__dirname, '../generators/app'))
            .withPrompts({
                name: 'nginx',
                namespace: 'default',
                podControllerType: 'Replication Controller',
                image: 'nginx',
                replicas: 1,
                containerPort: 80,
                servicePort: 80,
                shouldExpose: 'yes',
                ingressType: 'external',
                host: 'nginx.ingress.com',
                path: '/',
                ingressPort: 80
            });
    });    

    it('File rc.yml is generated and filled in', function () {
        assert.file(['rc.yml']);
        var rc = yaml.load('rc.yml');
        assert.equal(rc.apiVersion, 'v1');
        assert.equal(rc.kind, 'ReplicationController');
        assert.equal(rc.metadata.name, 'nginx');
        assert.equal(rc.metadata.namespace, 'default');
        assert.equal(rc.spec.replicas, 1);
        assert.equal(rc.spec.selector.app, 'nginx');
        assert.equal(rc.spec.template.metadata.labels.app, 'nginx');
        assert.equal(rc.spec.template.spec.containers[0].name, 'nginx');
        assert.equal(rc.spec.template.spec.containers[0].image, 'nginx');
    });

    it('File svc.yml is generated and filled in', function () {
        assert.file(['svc.yml']);
        var svc = yaml.load('svc.yml');
        assert.equal(svc.apiVersion, 'v1');
        assert.equal(svc.kind, 'Service');
        assert.equal(svc.metadata.name, 'nginx');
        assert.equal(svc.metadata.namespace, 'default');
        assert.equal(svc.spec.ports[0].port, 80);
        assert.equal(svc.spec.ports[0].targetPort, 80);
        assert.equal(svc.spec.selector.app, 'nginx');
    });

    it('File ing.yml is generated and filled in', function () {
        assert.file(['ing.yml']);
        var ing = yaml.load('ing.yml');
        expect(ing.apiVersion).toBe('extensions/v1beta1');
        expect(ing.kind).toBe('Ingress');
        expect(ing.metadata.annotations).toExist("No annotations found for ing.yml");
        expect(ing.metadata.annotations["kubernetes.io/ingress.class"]).toExist("No kubernetes.io/ingress class found");
        expect(ing.metadata.annotations["kubernetes.io/ingress.class"]).toBe("external", "kubernetes.io/ingress class should be 'external'");
        expect(ing.metadata.name).toBe('nginx');
        expect(ing.metadata.namespace).toBe('default');
        expect(ing.spec.rules).toExist('Expected rules to exist');
        expect(ing.spec.rules[0].host).toBe('nginx.ingress.com');
        expect(ing.spec.rules[0].http.paths[0].path).toBe('/');
        expect(ing.spec.rules[0].http.paths[0].backend.serviceName).toBe('nginx');
        expect(ing.spec.rules[0].http.paths[0].backend.servicePort).toBe(80);
    });

    it('File deployment.yml is not generated', function () {
        assert.noFile(['deployment.yml']);
    });    

});


describe('Deployment without Ingress scenarios', function () {

    beforeEach(function () {
        return helpers.run(path.join(__dirname, '../generators/app'))
            .withPrompts({
                name: 'nginx',
                namespace: 'default',
                podControllerType: 'Deployment',
                image: 'nginx',
                replicas: 1,
                containerPort: 80,
                servicePort: 8080,
                shouldExpose: false
            });
    });    

    it('File rc.yml is not generated', function () {
        assert.noFile(['rc.yml']);
    });

    it('File svc.yml is generated and filled in', function () {
        assert.file(['svc.yml']);
        var svc = yaml.load('svc.yml');
        assert.equal(svc.apiVersion, 'v1');
        assert.equal(svc.kind, 'Service');
        assert.equal(svc.metadata.name, 'nginx');
        assert.equal(svc.metadata.namespace, 'default');
        assert.equal(svc.spec.ports[0].port, 8080);
        assert.equal(svc.spec.ports[0].targetPort, 80);
        assert.equal(svc.spec.selector.app, 'nginx');
    });

    it('File ing.yml is not generated', function () {
        assert.noFile(['ing.yml']);
    });

    it('File deployment.yml is generated and filled in', function () {
        assert.file(['deployment.yml']);
        var deployment = yaml.load('deployment.yml');
        assert.equal(deployment.apiVersion, 'extensions/v1beta1');
        assert.equal(deployment.kind, 'Deployment');
        assert.equal(deployment.metadata.labels.name, 'nginx');
        assert.equal(deployment.metadata.name, 'nginx');
        assert.equal(deployment.metadata.namespace, 'default');
        assert.equal(deployment.spec.replicas, 1);
        assert.equal(deployment.spec.template.metadata.labels.app, 'nginx');
        assert.equal(deployment.spec.template.spec.containers[0].name, 'nginx');
        assert.equal(deployment.spec.template.spec.containers[0].image, 'nginx');
    });    

});

describe('Deployment with Ingress scenarios', function () {

    beforeEach(function () {
        return helpers.run(path.join(__dirname, '../generators/app'))
            .withPrompts({
                name: 'nginx',
                namespace: 'default',
                podControllerType: 'Deployment',
                image: 'nginx',
                replicas: 1,
                containerPort: 80,
                servicePort: 80,
                shouldExpose: 'yes',
                ingressType: 'internal',
                host: 'nginx.ingress.com',
                path: '/',
                ingressPort: 80
            });
    });    

    it('File rc.yml is not generated', function () {
        assert.noFile(['rc.yml']);
    });

    it('File svc.yml is generated and filled in', function () {
        assert.file(['svc.yml']);
        var svc = yaml.load('svc.yml');
        assert.equal(svc.apiVersion, 'v1');
        assert.equal(svc.kind, 'Service');
        assert.equal(svc.metadata.name, 'nginx');
        assert.equal(svc.metadata.namespace, 'default');
        assert.equal(svc.spec.ports[0].port, 80);
        assert.equal(svc.spec.ports[0].targetPort, 80);
        assert.equal(svc.spec.selector.app, 'nginx');
    });

    it('File ing.yml is generated and filled in', function () {
        assert.file(['ing.yml']);
        var ing = yaml.load('ing.yml');
        expect(ing.apiVersion).toBe('extensions/v1beta1');
        expect(ing.kind).toBe('Ingress');
        expect(ing.metadata.name).toBe('nginx');
        expect(ing.metadata.namespace).toBe('default');
        expect(ing.metadata.annotations).toExist("No annotations found for ing.yml");
        expect(ing.metadata.annotations["kubernetes.io/ingress.class"]).toExist("No kubernetes.io/ingress class found");
        expect(ing.metadata.annotations["kubernetes.io/ingress.class"]).toBe("internal", "kubernetes.io/ingress class should be 'internal'");
        expect(ing.spec.rules).toExist('Expected rules to exist');
        expect(ing.spec.rules[0].host).toBe('nginx.ingress.com');
        expect(ing.spec.rules[0].http.paths[0].path).toBe('/');
        expect(ing.spec.rules[0].http.paths[0].backend.serviceName).toBe('nginx');
        expect(ing.spec.rules[0].http.paths[0].backend.servicePort).toBe(80);
    });

    it('File deployment.yml is generated and filled in', function () {
        assert.file(['deployment.yml']);
        var deployment = yaml.load('deployment.yml');
        assert.equal(deployment.apiVersion, 'extensions/v1beta1');
        assert.equal(deployment.kind, 'Deployment');
        assert.equal(deployment.metadata.labels.name, 'nginx');
        assert.equal(deployment.metadata.name, 'nginx');
        assert.equal(deployment.metadata.namespace, 'default');
        assert.equal(deployment.spec.replicas, 1);
        assert.equal(deployment.spec.template.metadata.labels.app, 'nginx');
        assert.equal(deployment.spec.template.spec.containers[0].name, 'nginx');
        assert.equal(deployment.spec.template.spec.containers[0].image, 'nginx');
    });
});

describe('Ingress with no host', function () {

    beforeEach(function () {
        return helpers.run(path.join(__dirname, '../generators/app'))
            .withPrompts({
                name: 'nginx',
                namespace: 'default',
                podControllerType: 'Deployment',
                image: 'nginx',
                replicas: 1,
                containerPort: 80,
                servicePort: 80,
                shouldExpose: 'yes',
                ingressType: 'external',
                path: '/',
                ingressPort: 80
            });
    });    

    it('File rc.yml is not generated', function () {
        assert.noFile(['rc.yml']);
    });

    it('File svc.yml is generated and filled in', function () {
        assert.file(['svc.yml']);
        var svc = yaml.load('svc.yml');
        assert.equal(svc.apiVersion, 'v1');
        assert.equal(svc.kind, 'Service');
        assert.equal(svc.metadata.name, 'nginx');
        assert.equal(svc.metadata.namespace, 'default');
        assert.equal(svc.spec.ports[0].port, 80);
        assert.equal(svc.spec.ports[0].targetPort, 80);
        assert.equal(svc.spec.selector.app, 'nginx');
    });

    it('File ing.yml is generated and filled in', function () {
        assert.file(['ing.yml']);
        var ing = yaml.load('ing.yml');
        expect(ing.apiVersion).toBe('extensions/v1beta1');
        expect(ing.kind).toBe('Ingress');
        expect(ing.metadata.name).toBe('nginx');
        expect(ing.metadata.namespace).toBe('default');
        expect(ing.metadata.annotations).toExist("No annotations found for ing.yml");
        expect(ing.metadata.annotations["kubernetes.io/ingress.class"]).toExist("No kubernetes.io/ingress class found");
        expect(ing.metadata.annotations["kubernetes.io/ingress.class"]).toBe("external", "kubernetes.io/ingress class should be 'external'");        
        expect(ing.spec.rules).toExist('Expected rules to exist');
        expect(ing.spec.rules[0].host).toNotExist();
        expect(ing.spec.rules[0].http.paths[0].path).toBe('/');
        expect(ing.spec.rules[0].http.paths[0].backend.serviceName).toBe('nginx');
        expect(ing.spec.rules[0].http.paths[0].backend.servicePort).toBe(80);
    });

    it('File deployment.yml is generated and filled in', function () {
        assert.file(['deployment.yml']);
        var deployment = yaml.load('deployment.yml');
        assert.equal(deployment.apiVersion, 'extensions/v1beta1');
        assert.equal(deployment.kind, 'Deployment');
        assert.equal(deployment.metadata.labels.name, 'nginx');
        assert.equal(deployment.metadata.name, 'nginx');
        assert.equal(deployment.metadata.namespace, 'default');
        assert.equal(deployment.spec.replicas, 1);
        assert.equal(deployment.spec.template.metadata.labels.app, 'nginx');
        assert.equal(deployment.spec.template.spec.containers[0].name, 'nginx');
        assert.equal(deployment.spec.template.spec.containers[0].image, 'nginx');
    });
});

describe('Invalid podControllerType stops the writing process', function () {

    beforeEach(function () {
        return helpers.run(path.join(__dirname, '../generators/app'))
            .withArguments(['--create'])
            .withPrompts({
                name: 'nginx',
                namespace: 'default',
                podControllerType: 'InvalidType',
                image: 'nginx',
                replicas: 1,
                containerPort: 80,
                servicePort: 80,
                shouldExpose: 'yes',
                host: 'nginx.ingress.com',
                path: '/',
                ingressPort: 80
            });
    });    

    it('File rc.yml is not generated', function () {
        assert.noFile(['rc.yml']);
    });

    it('File svc.yml is not generated', function () {
        assert.noFile(['svc.yml']);
    });

    it('File ing.yml is not generated', function () {
        assert.noFile(['ing.yml']);
    });

    it('File deployment.yml is not generated', function () {
        assert.noFile(['deployment.yml']);
    });
});

describe('Spawn create command with Deployment', function () {

    beforeEach(function () {
        return helpers.run(path.join(__dirname, '../generators/app'))
            .withArguments(['--create'])
            .withPrompts({
                name: 'nginx',
                namespace: 'default',
                podControllerType: 'Deployment',
                image: 'nginx',
                replicas: 1,
                containerPort: 80,
                servicePort: 80,
                shouldExpose: 'yes',
                host: 'nginx.ingress.com',
                path: '/',
                ingressPort: 80
            });
    });    

    it('File rc.yml is not generated', function () {
        assert.noFile(['rc.yml']);
    });

    it('File svc.yml is generated', function () {
        assert.file(['svc.yml']);
    });

    it('File ing.yml is generated', function () {
        assert.file(['ing.yml']);
    });

    it('File deployment.yml is generated', function () {
        assert.file(['deployment.yml']);
    });
});

describe('Spawn apply command with Deployment', function () {

    beforeEach(function () {
        return helpers.run(path.join(__dirname, '../generators/app'))
            .withArguments(['--apply'])
            .withPrompts({
                name: 'nginx',
                namespace: 'default',
                podControllerType: 'Deployment',
                image: 'nginx',
                replicas: 1,
                containerPort: 80,
                servicePort: 80,
                shouldExpose: 'yes',
                ingressType: 'external',
                host: 'nginx.ingress.com',
                path: '/',
                ingressPort: 80
            });
    });    

    it('File rc.yml is not generated', function () {
        assert.noFile(['rc.yml']);
    });

    it('File svc.yml is generated', function () {
        assert.file(['svc.yml']);
    });

    it('File ing.yml is generated', function () {
        assert.file(['ing.yml']);
    });

    it('File deployment.yml is generated', function () {
        assert.file(['deployment.yml']);
    });
});