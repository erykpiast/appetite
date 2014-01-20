define([ 'libs/angular', 'modules/auth',
         'libs/angular-resource', 'libs/cookie-store', 'libs/angular-xeditable', 'libs/angular-ui-router', 'libs/angular-ui-date', 'libs/angular-ui-select2',
         'controllers', 'templates',
         'directives', 'services', 'filters' ],
function(angular, auth,
         _angularResource, _cookieStore, _angularXeditable, _angularUiRouter, _angularUiDate, _angularUiSelect2,
         controllers, templates,
         _directives, _services, _filters) {

    'use scrict';

    angular.module('appetite',
        [ 'ngResource', 'ngCookies', 'xeditable', 'ui.router', 'ui.date', 'ui.select2', 'auth',
          'appetite.filters', 'appetite.directives', 'appetite.services' ])
        .config(function($stateProvider, $urlRouterProvider, $locationProvider, $cookieStoreProvider) {
            $urlRouterProvider.otherwise('/');

            var common = {
                    'header@': {
                        template: templates.header,
                        controller: controllers.header
                    },
                    'footer@': {
                        template: templates.footer,
                        controller: controllers.footer
                    }
                };

            $stateProvider
                .state('index', {
                    url: '/',
                    views: angular.extend({
                        'content@': {
                            template: templates.main,
                            controller: controllers.main
                        }/*,
                        'sidebar@': {
                            template: templates.sidebarMain,
                            controller: controllers.sidebarMain
                        }*/
                    }, common)
                })
                .state('offer', {
                    url: '/offer',
                    views: angular.extend({
                        'content@': {
                            template: templates.offers,
                            controller: controllers.offers
                        }/*,
                        'sidebar@': {
                            template: templates.sidebarOffers,
                            controller: controllers.sidebarOffers
                        }*/
                    }, common)
                })
                .state('offer.details', {
                    url: '/{id:[0-9]{1,8}}',
                    views: angular.extend({
                        'content@': {
                            template: templates.offer,
                            controller: controllers.offer
                        }/*,
                        'sidebar@': {
                            template: templates.sidebarOffer,
                            controller: controllers.sidebarOffer
                        }*/
                    }, common)
                })
                .state('offer.create', {
                    url: '/create',
                    views: angular.extend({
                        'content@': {
                            template: templates.offerCreate,
                            controller: controllers.offerCreate
                        }/*,
                        'sidebar@': {
                            template: templates.sidebarOffer,
                            controller: controllers.sidebarOffer
                        }*/
                    }, common)
                })
                .state('user', {
                    url: '/user',
                    views: angular.extend({
                        'content@': {
                            template: templates.users,
                            controller: controllers.users
                        }/*,
                        'sidebar@': {
                            template: templates.sidebarUsers,
                            controller: controllers.sidebarUsers
                        }*/
                    }, common)
                })
                .state('user.details', {
                    url: '/{id:[0-9]{1,8}}',
                    views: angular.extend({
                        'content@': {
                            template: templates.user,
                            controller: controllers.user
                        }/*,
                        'sidebar@': {
                            template: templates.sidebarUser,
                            controller: controllers.sidebarUser
                        }*/
                    }, common)
                });
                
            // $locationProvider.html5Mode(true);

            $cookieStoreProvider.setDefaultOptions({
                path: '/',
                expires: new Date(60 * 365 * 24 * 60 * 60 * 1000) // cookie 'never' expires
            });
        })
        .run(function($rootScope, $state, i18n) {

            var __newVar__20131119171903013692 = $rootScope;
            __newVar__20131119171903013692.i18n = i18n;

            $rootScope.goTo = function(state, params) {
                $state.transitionTo(state, params, { location: true, inherit: true, relative: $state.$current, notify: true });
            }

            $rootScope.urlRegExp = String._urlRegExp;
        });

    return angular.module('appetite');

});