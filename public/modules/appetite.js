define(['libs/angular', 'libs/angular-i18n', 'modules/auth',
        'libs/angular-resource', 'libs/cookie-store', 'libs/angular-ui', 'libs/angular-ui-router', 'libs/angular-ui-date', 'libs/angular-ui-select2', 'libs/angular-perfect-scrollbar', 'libs/jquery-waypoints', 'libs/angular-elastic',
        'controllers', 'templates',
        'directives', 'services', 'filters'
    ],
    function(angular, _angularI18N, auth,
        _angularResource, _cookieStore, _angularUi, _angularUiRouter, _angularUiDate, _angularUiSelect2, _angularPerfectScrollbar, _jqueryWaypoints, _angularElastic, 
        controllers, templates,
        _directives, _services, _filters) {

        'use scrict';

        angular.module('appetite', ['ngResource', 'ngCookies', 'ui.router', 'ui.directives', 'ui.date', 'ui.select2', 'perfect-scrollbar', 'monospaced.elastic', 'auth',
            'appetite.filters', 'appetite.directives', 'appetite.services'
        ])
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
                            }
                            /*,
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
                            }
                            /*,
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
                            },
                            'sidebar@': {
                                template: templates.offerSidebar,
                                controller: controllers.offerSidebar
                            }
                        }, common)
                    })
                    .state('offer.create', {
                        url: '/create',
                        views: angular.extend({
                            'content@': {
                                template: templates.offerCreate,
                                controller: controllers.offerCreate
                            }
                            /*,
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
                            }
                            /*,
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
                            }
                            /*,
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

                $rootScope.goTo = function(state, params) {
                    $state.transitionTo(state, params, {
                        location: true,
                        inherit: true,
                        relative: $state.$current,
                        notify: true
                    });
                };

                $rootScope.urlRegExp = String._urlRegExp;

                $rootScope.i18n = i18n;
            });

        return angular.module('appetite');

    });