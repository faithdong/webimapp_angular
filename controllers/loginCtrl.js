/**
 * Created by zhongxd on 2016/8/5.
 * 登录控制器
 */

define([],function () {
    'use strict';
    function loginCtrl($scope,$state, $ionicPopup, userService,messageService,localStorageService,$ionicLoading,$timeout) {
        $scope.login = function () {
            var username = $scope.login.username;
            var password = $scope.login.password;

            if (username) {
                if (password) {
                    var obj = new Object();
                    obj.loginName = username;
                    obj.loginPassword = password;
                    userService.login(obj, function (result) {
                        console.log(result);
                        if (result.result == "true") {
                            var data = new Object();
                            data.userName = result.data.name;
                            data.token = result.data.token;
                            userService.secondLogin(data);
                            //添加加载动画
                            $ionicLoading.show({
                                content: 'Loading',
                                animation: 'fade-in',
                                showBackdrop: true,
                                maxWidth: 200,
                                showDelay: 0
                            });
                            //下载群组数据并保存
                            messageService.GetGroupList(function (resultdata) {
                                localStorageService.addLocalData("grouplist",resultdata);
                            });


                            $timeout(function () {
                                $ionicLoading.hide();
                                $state.go("tab.message");
                            }, 2000);
                        } else {
                            alert("登录失败,账号或密码错误");
                        }
                    });
                }
                else {
                    $ionicPopup.alert({
                        title: '错误',
                        template: '密码不能为空'
                    });
                }


            }
            else {
                $ionicPopup.alert({
                    title: '错误',
                    template: '账号不能为空'
                });
            }

        }

    };

    loginCtrl.$inject = ['$scope','$state', '$ionicPopup', 'userService','messageService','localStorageService','$ionicLoading','$timeout'];
    return loginCtrl;

});