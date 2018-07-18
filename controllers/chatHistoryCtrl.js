/**
 * Created by zhongxd on 2016/8/5.
 * 聊天历史记录
 */

define(['angular'],function (angular) {
    'use strict';
    function chatHistoryCtrl($scope, $ionicHistory, $stateParams, messageService,faceService) {

        //从上级页面(单聊或者群聊)获取到参数
        var chatType;
        var data = $stateParams.org;
        data = angular.fromJson(data);
        if (data.chatType == "chat") {
            chatType = "chat";
        } else if (data.chatType == "groupchat") {
            chatType = "groupchat";
        }

        //获取历史记录参数
        $scope.start=1;
        var data = {
            id: data.id, //对话人id
            chatType: chatType, //chat:单聊，groupchat:群聊,:公众号//contentType: 2,//代表希望拿到的消息类型，不填则为全部消息类型
            start: $scope.start, //消息列表的分页参数，起始值，默认0,
            num: 10 //
        };
        $scope.messageDetils=[];
        $scope.hasData = true;
        /**
         * 向上刷新加载数据
         */
        $scope.loadMore = function () {
            $scope.start+=1;
            data = {
                id: data.id, //对话人id
                chatType: chatType, //chat:单聊，groupchat:群聊,:公众号//contentType: 2,//代表希望拿到的消息类型，不填则为全部消息类型
                start: $scope.start, //消息列表的分页参数，起始值，默认0,
                num: 5 //
            };
            getHistory(data);
        };
        function getHistory(data){
            messageService.GetHistoryMessage(data, function (resule) {
                if( resule.result.length>0){

                    /**
                     * 处理图片和表情;
                     */
                    var _resule=resule.result;
                    for(var i=0;i<_resule.length;i++){
                        //图片
                        if(_resule[i].body.content.attachId==undefined&&_resule[i].body.content.match(/image/)){
                            var image=_resule[i].body.content.slice(7);
                            var src=JSON.parse(image).path;
                            var img="<img src='"+src+"'>";
                            _resule[i].body.content=img;

                        }
                        //文字和转义表情字符
                        else if(!(_resule[i].body.content.attachId&&_resule[i].body.content.path)) {

                            var str =  faceService.strCorventToFace(_resule[i].body.content);
                            _resule[i].body.content = str;
                        }
                        //文件待定

                    }
                    console.log(_resule);
                    $scope.messageDetils = $scope.messageDetils.concat(_resule);
                    $scope.hasData = true;
                }else {
                    $scope.hasData = false;
                }

                $scope.$broadcast("scroll.infiniteScrollComplete");
            });
        }
        getHistory(data);
        /**
         * 返回上一页
         */
        $scope.back = function () {
            $ionicHistory.goBack();
        };

    }

    chatHistoryCtrl.$inject = ['$scope','$ionicHistory','$stateParams','messageService','faceService'];
    return chatHistoryCtrl;

});