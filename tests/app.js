'use strict';

var yeoman = require('yeoman-generator');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var path = require('path');
var yaml = require('yamljs');

beforeEach(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({
            name: "nginx",
            namespace: "default",
            podControllerType: "Replication Controller",
            image: "nginx",
            replicas: 1,
            containerPort: 80,
            servicePort: 8080,
            shouldExpose: false
        });
});



describe('Replication Controller scenarios', function () {
    
    it('generates file rc.yml', function () {
        assert.file(['rc.yml']);
        var rc = yaml.load('rc.yml');
        assert.equal(rc.apiVersion, 'v1');
        assert.equal(rc.kind, 'ReplicationController');
        assert.equal(rc.metadata.name, "nginx");
        assert.equal(rc.metadata.namespace, "default");
        assert.equal(rc.spec.replicas, 1);
        assert.equal(rc.spec.selector.app, "nginx");
        assert.equal(rc.spec.template.metadata.labels.app, "nginx");
        assert.equal(rc.spec.template.spec.containers[0].name, "nginx");
        assert.equal(rc.spec.template.spec.containers[0].image, "nginx");
    });

    it('generates file svc.yml', function () {
        assert.file(['svc.yml']);
    });

    it('do not generates file ing.yml', function () {
        assert.noFile(['ing.yml']);
    });

});