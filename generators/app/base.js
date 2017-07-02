'use strict';

module.exports = {

    initializing(generator) {
        generator.log(" ");
        generator.log(" |  |/  / |  |  |  | |   _  \\  |   ____| /  _____||   ____||  \\ |  | ");
        generator.log(" |  '  /  |  |  |  | |  |_)  | |  |__   |  |  __  |  |__   |   \\|  | ");
        generator.log(" |    <   |  |  |  | |   _  <  |   __|  |  | |_ | |   __|  |  . `  | ");
        generator.log(" |  .  \\  |  `--'  | |  |_)  | |  |____ |  |__| | |  |____ |  |\\   | ");
        generator.log(" |__|\\__\\  \\______/  |______/  |_______| \\______| |_______||__| \\__| ");
        generator.log(" ");
        generator.log('Welcome to Kubernetes Generator (kubegen)!');
    },
    getPrompts() {
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
        }];

        return prompts;        
    }
};