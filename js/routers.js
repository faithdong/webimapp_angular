/**
 * Created by zhongxd on 2016/8/3.
 * 路由配置js
 */


define(['angular', 'require', 'uiRouter'], function (angular) {
    var app = angular.module('IMApp.routes', []);

    app.config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state("tab", {
                    url: "/tab",
                    abstract: true,
                    templateUrl: "view/tab-nav/tabs.html"
                })
                .state('tab.message', {
                    url: '/message',
                    views: {
                        'tab-message': {
                            templateUrl: 'view/tabA-message/tab-message.html',
                            controller: "messageCtrl"
                        }
                    }
                })
                .state('messageDetail', { //单聊
                    url: '/messageDetail/:messageId',
                    templateUrl: "view/tabA-message/singleChat.html",
                    controller: "singleChatCtrl"
                })
                .state('tab.concat', {
                    url: '/concat',
                    views: {
                        'tab-concat': {
                            templateUrl: 'view/tabB-concat/tab-concat.html',
                            controller: "concatCtrl"
                        }
                    }
                })
                .state('createGroup', {
                    url: '/createGroup/',
                    templateUrl: "view/tabE-group/createGroup.html",
                    controller: "createGroupCtrl"
                })
                .state('myGroup', {
                    url: '/myGroup',
                    templateUrl: "view/tabE-group/myGroup.html",
                    controller: "myGroupCtrl",
                    cache:false
                })

                .state('groupChat', {
                    url: '/groupChat:group',
                    templateUrl: "view/tabE-group/groupChat.html",
                    controller: "groupChatCtrl"
                })

                .state('groupMember', {
                    url: '/groupMember/:data',
                    templateUrl: "view/tabE-group/groupMember.html",
                    controller: "groupMemberCtrl",
                    cache:false
                })

                .state('groupFile', {
                    url: '/groupFile:data',
                    templateUrl: "view/tabE-group/groupFile.html",
                    controller: "groupFileCtrl"
                })



                .state('memberInfo', {
                    url: "/memberInfo/:info",
                    templateUrl: "view/tabE-group/memberInfo.html",
                    controller: 'memberInfoCtrl'
                })

                .state('chatSetting', {
                    url: '/chatSetting/:data',
                    templateUrl: 'view/tabA-message/chatSetting.html',
                    controller: "chatSettingCtrl"
                })
                .state('tab.personInfo', {
                    url: '/personInfo',
                    views: {
                        'tab-personInfo': {
                            templateUrl: 'view/tabD-mine/personInfo.html',
                            controller: "personInfoCtrl"
                        }
                    }
                })
                .state('chooseMember', {
                    url: '/chooseMember/:groupname',
                    templateUrl: 'view/tabE-group/chooseMember.html',
                    controller: "chooseMemberCtrl"
                })
                .state('tab.notifyList', {
                    url: "/notifyList",
                    views: {
                        'tab-notifyList': {
                            templateUrl: "view/tabC-notice/notifyList.html",
                            controller: 'notifyListCtrl'
                        }
                    }
                })
                .state('notifyDetail', {
                    url: "/notify-detail/:sendtime :notifycontent",
                    templateUrl: "view/tabC-notice/notify-detail.html",
                    controller: 'notifyDetailCtrl'
                })

                .state('search', {
                    url: "/search",
                    templateUrl: "view/tabB-concat/search.html",
                    controller: 'searchCtrl'
                })
                .state('chatHistory', {
                    url: "/chatHistory/:org",
                    templateUrl: "view/tabA-message/chatHistory.html",
                    controller: 'chatHistoryCtrl'
                })
                .state('login', {
                    url: "/login",
                    templateUrl: "view/login.html",
                    controller: 'loginCtrl'
                })
                .state("test", {
                    url: "/test",
                    templateUrl: "view/tabZ-test/test.html",
                    controller: 'testCtrl'
                });

            $urlRouterProvider.otherwise("/tabs");
        });

    return app;

});




