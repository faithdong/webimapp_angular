/**
 * Created by zhongxd on 2016/7/29.
 */

require.config({
    //baseUrl: 'js',
    paths:{
        //配置js库文件
        jquery:'../lib/jquery/jquery-2.1.4.min',
        angular:'../lib/ionic/js/angular/angular',
        angularAnimate:'../lib/ionic/js/angular/angular-animate',
        angularSanitize:'../lib/ionic/js/angular/angular-sanitize',
        uiRouter:'../lib/ionic/js/angular-ui/angular-ui-router',
        ngResource:'../lib/ionic/js/angular/angular-resource',
        ionic:'../lib/ionic/js/ionic',
        ionicAngular:'../lib/ionic/js/ionic-angular',
        uapCore:'../lib/uapFramework/iuapmobile.frameworks.core-2.7.0',
        summer:'../lib/uapFramework/summer',
        YYIMSDK:'../lib/webSdk/YYIMSDK',

        //配置自己定义的js文件
        app:'app',
        routers:'routers',
        config:'config',
        eventManager:'event-manager',
        controllers:'../controllers/controllers',

        messageCtrl:'../controllers/messageCtrl',
        singleChatCtrl:'../controllers/singleChatCtrl',
        chatSettingCtrl:'../controllers/chatSettingCtrl',
        chatHistoryCtrl:'../controllers/chatHistoryCtrl',

        concatCtrl:'../controllers/concatCtrl',
        searchCtrl:'../controllers/searchCtrl',

        notifyListCtrl:'../controllers/notifyListCtrl',
        notifyDetailCtrl:'../controllers/notifyDetailCtrl',

        personInfoCtrl:'../controllers/personInfoCtrl',

        createGroupCtrl:'../controllers/createGroupCtrl',
        myGroupCtrl:'../controllers/myGroupCtrl',
        groupChatCtrl:'../controllers/groupChatCtrl',
        groupMemberCtrl:'../controllers/groupMemberCtrl',
        groupFileCtrl:'../controllers/groupFileCtrl',
        memberInfoCtrl:'../controllers/memberInfoCtrl',
        chooseMemberCtrl:'../controllers/chooseMemberCtrl',

        loginCtrl:'../controllers/loginCtrl',

        testCtrl:'../controllers/testCtrl',

        services:'../services/services',
        directives:'../directives/directives'
    },
    shim:{
        angular:{exports:'angular'},
        angularAnimate : {deps: ['angular']},
        angularSanitize : {deps: ['angular']},
        uiRouter : {deps: ['angular']},
        ngResource: {deps: ['angular']},
        ionic :  {deps: ['angular'], exports : 'ionic'},
        ionicAngular: {deps: ['angular', 'ionic', 'uiRouter', 'angularAnimate', 'angularSanitize','ngResource']},
        jquery:{exports:'jquery'},
        YYIMSDK:{deps:['jquery'],exports:'YYIMSDK'},
        uapCore:{deps:['jquery'],exports:'uapCore'},
        summer:{deps:['jquery'],exports:'summer'}
    },
    priority:['angular','ionic'],
    deps:['bootstrap']
});

