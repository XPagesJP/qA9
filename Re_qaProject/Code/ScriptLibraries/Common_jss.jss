var Common = {};
//ユーザー情報
Common.getCurrentUser = function(){
    //SessionScopeにあればそれを返す
    if(sessionScope.get('user')){
    	return sessionScope.get('user');
    }
    //SessionScopeになければ取得
    //実際にはログイン時にユーザー情報を取得してsessionScope.user に格納する
    //ので、ここはあとで削除する
    var user = {
        id: '001',
        name: 'テスト ユーザー'
    }
    sessionScope.put('user', user);
}