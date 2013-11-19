define([ 'libs/angular', './module', 'templates' ],
function(ạngular, module, templates) {

    module
    .directive('appImagePicker', function($rootScope) {
        return {
            template: templates.imagePicker,
            replace: true,
            restrict: 'E',
            scope: { images: '=model' },
            link: function(scope, element, attrs) {
                scope.i18n = $rootScope.i18n;

                ạngular.extend(scope, {
                    addImage: function() {
                        scope.images.push(scope.imageProto.url);

                        scope.imageProto.url = '';

                        scope.showForm = false;
                    },
                    imageProto: {
                        url: ''
                    },
                    showForm: false
                });
            }
        };
    });

});