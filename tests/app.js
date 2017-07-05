'use strict';

var yeoman = require('yeoman-generator');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var path = require('path');
var yaml = require('yamljs');

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
        ing.apiVersion = 'extensions/v1beta1';
        ing.kind = 'Ingress';
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
        ing.apiVersion = 'extensions/v1beta1';
        ing.kind = 'Ingress';
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