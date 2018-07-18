/**
 * Created by zhongxd on 2016/8/5.
 * 群列表
 */

define([],function () {
    'use strict';
    function notifyListCtrl($scope, $state, bgIfService) {

        //定义查询查询
        $scope.page = 1;
        $scope.notifyDatas = [];
        $scope.hasData = true;
        var dataObj = {
            page: $scope.page,
            rows: 10
        };

        /**
         * 加载数据
         * @param dataObj
         */
        function getData(dataObj) {
            bgIfService.getNotifyList(dataObj, function (notifyData) {
                if (notifyData.data.length > 0) {
                    $scope.notifyDatas = $scope.notifyDatas.concat(notifyData.data);
                    $scope.hasData = true;
                } else {
                    $scope.hasData = false;
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        getData(dataObj);

        /**
         * 加载上一页数据
         */
        $scope.loadMore = function () {
            $scope.page += 1;
            dataObj = {
                page: $scope.page,
                rows: 10
            };
            getData(dataObj);

        };


        $scope.moreDataCanBeLoaded = function () {
            return $scope.hasData;
        };


        /**
         * 跳转到消息详情页面
         */
        $scope.getDetail = function ($notifyData) {
            $state.go("notifyDetail", {
                "sendtime": $notifyData.sendtime,
                'notifycontent': $notifyData.content
            });

        };

    }

    notifyListCtrl.$inject = ['$scope', '$state',  'bgIfService'];
    return notifyListCtrl;

});