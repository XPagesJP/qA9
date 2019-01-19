var Common = {};
//ユーザー情報
Common.getCurrentUser = function(){
	
	//初回でanonymousを持ったままになったので、とりあえず
	   var userName:NotesName = session.createName(@UserName());
		var user = {
   			 id: '001',
   		 name:@Name("[ABBREVIATE]",userName)
		}
		sessionScope.put('user', user);
	return user

//初回でanonymousを持ったままになったので、とりあえず

	   //SessionScopeにあればそれを返す
    if(sessionScope.get('user')){
    	return sessionScope.get('user');
    }
    //SessionScopeになければ取得
    //実際にはログイン時にユーザー情報を取得してsessionScope.user に格納する
    //ので、ここはあとで削除する
    var userName:NotesName = session.createName(@UserName());
    var user = {
        id: '001',
        name: 'テスト ユーザー'
    }
    sessionScope.put('user', user);
}
Common.getHost = function getHost(){
	//var accountlist = database.getView("V_Setting");
	//var settingdoc =accountlist.getFirstDocument();
	//return settingdoc.getItemValueString("Host_name"); 
	var url = context.getUrl().getAddress().replace(/[^\/]*$/,'');
	return url;
}
/*
'*********************************************************
'【機能概要】
'	全文検索クエリ文字列の有効チェック
'【引数】
'	strQuery	:全文検索クエリ文字列
'【戻り値】
'	true:有効 false:無効
'*********************************************************
*/
function isValidFTQuery(strQuery:String){
	var db:NotesDatabase = session.getCurrentDatabase();
	try{
		// 実際にFTSearchして確認する
		db.FTSearch(strQuery, 1)
		return true;
	}catch(e){
		return false;
	}
}

/**
 * 【機能概要】
 *   設定文書取得
 * 【引数】
 *   なし
 * 【戻り値】
 *   NotesDocument
 */
Common.getSettingDoc = function(){
	var db:NotesDatabase = session.getCurrentDatabase();
	var envvw:NotesView = db.getView('V_Setting');
	var envdoc:NotesDocument = envvw.getFirstDocument();
	
	return envdoc;
};

/**
 * 【機能概要】
 *   Snipppets DB 取得
 * 【引数】
 *   なし
 * 【戻り値】
 *   NotesDatabase
 */
Common.getSnippetsDB = function(){
	var envdoc:NotesDocument = Common.getSettingDoc();
	if (envdoc == null){
		return null;
	}
  
	// XSnippets DB取得
	var serverName = envdoc.getItemValueString('snippets_server');
	var dbPath = envdoc.getItemValueString('snippets_path');
	var sdb:NotesDatabase = session.getDatabase(serverName, dbPath);
	
	return sdb;
};

Common.getCommonUserName = function(userName) {
	var atmartAlt = '\t';
	var _userName = userName;
	_userName = _userName.replace(/\@/g, atmartAlt);
	var userName:NotesName = session.createName(_userName);
	var Targetuser = userName.getCommon();
	Targetuser = Targetuser.replace(/\t/g, '@');	
	return Targetuser;
}