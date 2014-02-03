define([ 'libs/angular', './module', 'templates' ],
function(ạngular, module, templates) {

    module
    .directive('appImagePicker', function($rootScope) {
        var maxPictures = 3;

        return {
            template: templates.imagePicker,
            replace: true,
            restrict: 'E',
            scope: { images: '=model' },
            link: function(scope, element, attrs) {
                scope.i18n = $rootScope.i18n;
                scope.maxReached = false;

                scope.images.append([
                    'http://www.mojewypieki.com/img/images/churros_1_419_small.jpg',
                    'http://www.mojewypieki.com/img/images/gofry_bajaderki_10_400x400_1057_small.jpg',
                    'http://www.mojewypieki.com/img/images/paczki_prz_1_1060_small.jpg',
                    'http://www.mojewypieki.com/img/images/racuchy_3_920_small.jpg'
                ]);

                function _clear() {
                    scope.imageProto.url = '';

                    scope.showForm = false;
                }

                function _max() {
                    if(scope.images.length >= maxPictures) {
                        scope.maxReached = true;
                    } else {
                        scope.maxReached = false;
                    }
                }

                ạngular.extend(scope, {
                    addImage: function() {
                        scope.images.push(scope.imageProto.url);

                        _max();

                        _clear();
                    },
                    removeImage: function(imageUrl) {
                        scope.images.splice(
                            scope.images.indexOf(imageUrl)
                        , 1);

                        _max();
                    },
                    cancelAdding: function() {
                        _clear();
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