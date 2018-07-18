/**
 * Created by zhongxd on 2016/8/5.
 *  组织联系人
 */

define([],function () {
    'use strict';
    function concatCtrl($scope, $state, $resource, $http) {

        var url = "";
        if (ionic.Platform.isAndroid()) {
            url = "/android_asset/www/";
        }
        //请求本地组织架构的json数据
        $http.get(url + 'data/json/orglist.json').success(function (datas) {
            $scope.orgs = datas;
        });
        //组织架构根节点
        $scope.orgcode = "15436103226";
        var array = [];
        var index = 0;
        var button = document.getElementById("friends_button");

        /**
         * 跳转到当前组织机构下一页
         * 因为组织架构有多层子级页面
         * 所以增加了一个处理
         */
        $scope.gotopage = function (uporgcode) {
            array[index++] = $scope.orgcode;
            $scope.orgcode = uporgcode;
            button.style.display = "block";
        };

        /**
         * 回到到当前组织机构上一页
         * 因为组织架构有多层子级页面
         * 所以增加了一个处理
         */
        $scope.back = function () {
            if (index > 1) {
                $scope.orgcode = array[--index];
            }
            else {
                $scope.orgcode = array[--index];
                button.style.display = "none";
            }
        };


        /**
         * 跳转到我的组织列表
         */
        $scope.gotomygroup = function () {
            $state.go("myGroup");
        };

        /**
         * 跳转到搜索页面
         */
        $scope.gotoSearch = function () {
            $state.go("search");
        };

        /**
         * 跳转到群成员列表
         */
        $scope.friendinfo = function (org) {
            var info = angular.toJson(org);
            $state.go("memberInfo", {
                "info": info
            });
        };

    }

    concatCtrl.$inject = ['$scope', '$state', '$resource', '$http'];
    return concatCtrl;

});