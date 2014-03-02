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
            link: function(scope, $element, attrs) {
                scope.i18n = $rootScope.i18n;
                scope.maxReached = false;

                var $input = $element.find('.image-picker__adder__form__input > input');

                scope.$watchCollection('images', function(newValue) {
                    if(newValue.length >= maxPictures) {
                        scope.maxReached = true;
                    } else {
                        scope.maxReached = false;
                    }
                });

                scope.$watch('showForm', function(newValue) {
                    if(!!newValue) {
                        $input.focus();
                    }
                });

                scope.images.append([
                    /*'http://www.mojewypieki.com/img/images/churros_1_419_small.jpg',
                    'http://www.mojewypieki.com/img/images/gofry_bajaderki_10_400x400_1057_small.jpg',
                    'http://www.mojewypieki.com/img/images/paczki_prz_1_1060_small.jpg'*/
                ]);

                function _clear() {
                    scope.imageProto.url = null;

                    scope.showForm = false;
                }

                ạngular.extend(scope, {
                    addImage: function() {
                        if(scope.imageProto.url && scope.imageProto.url.length) {
                            scope.images.push(scope.imageProto.url);

                            _clear();
                        }
                    },
                    removeImage: function(imageUrl) {
                        scope.images.splice(
                            scope.images.indexOf(imageUrl)
                        , 1);
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