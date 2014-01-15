
import Common_jss;
//名前空間は設計要素名と同一にする(ローカルルール)
var qa_JsLib = {};
//co11111
//comment2
//////////////////////////////////////////
//[SetGoodCountUD]いいね！アクション
//引数
//   key  int  UP:1 Down:0
//戻り値
//   なし
//////////////////////////////////////////
qa_JsLib.SetGoodCountUD = function(key:int ,targetDoc:NotesXspDocument){

	//var targetdoc = docQues.getDocument();
	//var su = getComponent("sessionUser").getValue();
	var su = Common.getCurrentUser().name;
	
	var user_good = targetdoc.getItemValue("user_good");

	if (key == 1) {
		//いいね！ユーザーの追加
		if (user_good.length == 0) {
			 targetdoc.replaceItemValue("user_good",su);
			 //targetdoc.replaceItemValue("count_good","1");
		} else {
			 var result = "";
			 for (var i=0; i<user_good.length; i++) {
			 if(user_good[i]==su){
		 		//既に登録済みの場合、処理させない。
		 		return
			 }
			 		result  = result + user_good[i] + "\n";
		 	}
		 	result  =result  + su;
		
		 	//targetdoc.replaceItemValue("count_good", String(user_good.length + 1));
		 	targetdoc.replaceItemValue("user_good",@Explode(result,"\n"));
		}
		
		//ログ出力
		qa_JsLib.ComposeAccess_log(targetDoc,null ,'1','1')
		
	}else{
		//いいね！ユーザーのクリア
		var ugcount =  user_good.length;

		if (user_good.length == 0) {
				 return;
		} else {
				 var result = "";
				 for (var i=0; i<user_good.length; i++) {
				 	if(user_good[i]==su){
				 	//既に登録済みの場合、セットしない。
				 	ugcount = Number(ugcount) - 1
				 	}else{
				 		result  = result + user_good[i] + "\n";
				 	}	
				 }
				
				if (ugcount < 0 )ugcount=0;
				// targetdoc.replaceItemValue("count_good", String(ugcount));
				 targetdoc.replaceItemValue("user_good",@Explode(result,"\n"));
		}
		
		//ログ出力
		qa_JsLib.ComposeAccess_log(targetDoc,null ,'1','-1')
		
	}
	targetdoc.save();

	context.reloadPage();
}

//////////////////////////////////////////
//[SetFavoriteCountUD]お気に入りアクション
//引数
// key  int  UP:1 Down:0
//戻り値
// なし
//////////////////////////////////////////
qa_JsLib.SetFavoriteCountUD = function(key:int ,targetDoc:NotesXspDocument){

	var su = Common.getCurrentUser().name;
	var members = targetdoc.getItemValue("User_Favorite");

	if (key == 1) {
		//お気に入り！ユーザーの追加
		if (members.length == 0) {
			 targetdoc.replaceItemValue("User_Favorite",su);
		} else {
			 var result = "";
			 for (var i=0; i<members.length; i++) {
			 if(members[i]==su){
		 		//既に登録済みの場合、処理させない。
		 		return
			 }
			 		result  = result + members[i] + "\n";
		 	}
		 	result  =result  + su;
		 	targetdoc.replaceItemValue("User_Favorite",@Explode(result,"\n"));
		}
		
		//ログ出力
		qa_JsLib.ComposeAccess_log(targetDoc,null ,'3','1')
	
	}else{
		//お気に入り！ユーザーのクリア
		var ugcount =  members.length;

		if (members.length == 0) {
				 return;
		} else {
				 var result = "";
				 for (var i=0; i<members.length; i++) {
				 	if(members[i]==su){
				 	//既に登録済みの場合、セットしない。
				 	ugcount = Number(ugcount) - 1
				 	}else{
				 		result  = result + members[i] + "\n";
				 	}	
				 }
				if (ugcount < 0 )ugcount=0;
				 targetdoc.replaceItemValue("User_Favorite",@Explode(result,"\n"));
		}
		
		//ログ出力
		qa_JsLib.ComposeAccess_log(targetDoc,null ,'3','-1')
		
	}
	targetdoc.save();

}

//////////////////////////////////////////
//[SetViewCountUD]閲覧カウントアップ
//引数
//targetDoc　対象文書
//戻り値
// なし
//////////////////////////////////////////
qa_JsLib.SetViewCountUD = function(targetDoc:NotesXspDocument){
	//var targetdoc = targetDoc.getDocument();

	//キー DBID　+ 文書ID
	var Key = new java.util.Vector();
	Key.add(targetdoc.getParentDatabase().getReplicaID());
	Key.add(targetdoc.getUniversalID());
	Key.add(@Today().toDateString());
	var su = Common.getCurrentUser().name;
	Key.add(su);
	//Key.add(getComponent("sessionUser").getValue());
	//ログ出力
	qa_JsLib.ComposeAccess_log(targetDoc,Key ,'0','')
	
}

//////////////////////////////////////////
//[GetViewCount]閲覧カウントアップ数の取得
//引数
//targetDoc　対象文書
//戻り値
//閲覧カウントアップ数
//////////////////////////////////////////
qa_JsLib.GetViewCount = function(targetDoc:NotesXspDocument){


	//閲覧記録Dbの取得
	var accountlist = database.getView("V_Setting");
	var Settingdoc =accountlist.getFirstDocument();
	var QAV_server =Settingdoc.getItemValue("QAview_server");
	var QAV_path =Settingdoc.getItemValue("QAview_path");
	var QAV_db = session.getDatabase(
	        (QAV_server.size() === 0) ? '' : QAV_server[0],
	        QAV_path[0]);
	var QAV_view = QAV_db.getView("VLookup_A02");


	//キー DBID　+ 文書ID
	var key = new java.util.Vector();
	key.add(targetdoc.getParentDatabase().getReplicaID());
	key.add(targetdoc.getItemValueString("UniqueID"));
	var QAV_doccol = QAV_view.getAllDocumentsByKey(key ,true);

	//既存のカウントに加算
	QAVcount = QAV_doccol.getCount();
	
	if (targetdoc.hasItem("Count_view")){
		if(targetdoc.getItemValueString("Count_view")==""){
			var cv_count = "0";
		}else{
			var cv_count = targetdoc.getItemValueString("Count_view");
		}
		return parseInt(QAVcount) + parseInt(cv_count);
	}else{
		return QAVcount;
	}


}


//////////////////////////////////////////
//[GetGoodCount]いいね！カウントアップ数の取得
//引数
//targetDoc　対象文書
//戻り値
//いいね！カウントアップ数
//////////////////////////////////////////
qa_JsLib.GetGoodCount = function(targetDoc:NotesXspDocument){
	
	var user_good= targetdoc.getItemValue("user_good");
	
	if (user_good.length==""){
		return "0";
	}else{
		return user_good.length;
		
	}
}


//////////////////////////////////////////
//[GetGoodUserList]いいね！ユーザーリストの取得
//引数
//targetDoc　対象文書
//戻り値
//対象者のユーザーリスト
//////////////////////////////////////////
qa_JsLib.GetGoodUserList = function(targetDoc:NotesXspDocument){

	var user_good = targetdoc.getItemValue("user_good");

	if (user_good.length == 0) {
			return "なし";
	} else {
			 var result = "";
			 for (var i=0; i<user_good.length; i++) {
			 //if(user_good[i]==su){
			 	//既に登録済みの場合、処理させない。
			 //	return
			 //}
			 		result  = result + @Name("[ABBREVIATE]",user_good[i]) + "\n";
			 		if (i>10){
			 		return result + "他、" + String(user_good.length-i) + "名";
			 		}
			 }
			 return result;
			
	}
}

//////////////////////////////////////////
//[SetBestAnswer]ベストアンサーのセット
//引数
//targetDoc　対象文書
//parentdoc 質問文書
//戻り値
//なし
//////////////////////////////////////////
qa_JsLib.SetBestAnswer = function(targetDoc:NotesXspDocument,parentdoc:NotesXspDocument){
	if(targetdoc.getItemValueString("bestAns")==""){
		targetdoc.replaceItemValue("bestAns","1")
		//質問文書をクローズ
		parentdoc.replaceItemValue("Status","2")
		
		//ログ出力
		qa_JsLib.ComposeAccess_log(targetDoc,null ,'2','1')
		
	}else{
		targetdoc.replaceItemValue("bestAns","");
		//質問文書をオープン
		parentdoc.replaceItemValue("Status","")
		
		//ログ出力
		qa_JsLib.ComposeAccess_log(targetDoc,null ,'2','-1')
		
	}
	targetdoc.save();
	parentdoc.save();
	
	context.reloadPage();
}



//////////////////////////////////////////
//[ComposeAccess_log]履歴にログの追加
//引数
//Chkkey　同キーチェック用
//Action　アクション内容（閲覧|0/いいね|1/これで解決|2 /お気に入り|3/質問投稿|4 /回答投稿|5 /コメント投稿|6）
//Key1	　キー１の値
//戻り値
//なし
//////////////////////////////////////////
qa_JsLib.ComposeAccess_log = function(targetDoc:NotesXspDocument,Chkkey , Action ,Key1){

	var accountlist = database.getView("V_Setting");
	var Settingdoc =accountlist.getFirstDocument();
	var QAV_server =Settingdoc.getItemValue("QAview_server");
	var QAV_path =Settingdoc.getItemValue("QAview_path");
	var QAV_db = session.getDatabase(
	        QAV_server.size() === 0 ? '' : QAV_server[0],
	        QAV_path[0]);


	//チェックキーがある場合、同キーのチェック。あった場合、処理しない
	//
	if(Chkkey != null){
		var QAV_view = QAV_db.getView("VLookup_A01");
		var QAV_doccol = QAV_view.getAllDocumentsByKey(Chkkey ,true);

		QAVcount = QAV_doccol.getCount();
		if(QAVcount>0) return;
	}

	//ログ文書の作成
	var QAV_doc = QAV_db.createDocument();
	QAV_doc.replaceItemValue("Form","FM_Action_log");

	QAV_doc.replaceItemValue("server",database.getServer());
	QAV_doc.replaceItemValue("path",database.getFilePath());
	QAV_doc.replaceItemValue("Db_id",database.getReplicaID());
	QAV_doc.replaceItemValue("doc_id",targetdoc.getUniversalID());
	QAV_doc.replaceItemValue("Doc_Author",targetdoc.getItemValue("Author"));
	QAV_doc.replaceItemValue("AccessUser",Common.getCurrentUser().name);
	var date_notes = session.createDateTime(@Now()); 
	QAV_doc.replaceItemValue("AccessDate", date_notes);

	QAV_doc.replaceItemValue("Action",Action);
	QAV_doc.replaceItemValue("Key1",Key1);

	QAV_doc.save();

}


//////////////////////////////////////////
//[InputChkAccount]アカウント登録入力チェック
//引数
//accDoc　アカウント登録文書
//type	"1"：新規登録		"2"：パスワード変更		"3"：パスワード再発行
//戻り値
//なし
//////////////////////////////////////////
qa_JsLib.InputChkAccount = function(accDoc, type){

	sessionScope.ErrMsg = "";
	
	if (type=="1"){
		//新規登録
		var Password1 = getComponent("Password1").value;
		var Password2 = getComponent("Password2").value;
		
		if (getComponent("LoginName").value == ""){
			sessionScope.ErrMsg =  "ログインユーザー名が入力されていません。"
		
		}else if (Password1 == "" || Password2 == "" ){
			sessionScope.ErrMsg =  "パスワードが入力されていません。"
		
		}else if (Password1 != Password2){
			sessionScope.ErrMsg =  "パスワードが一致しません。パスワードを入力し直して下さい。"
		
		}else if (getComponent("MailAddress").value == ""){
			sessionScope.ErrMsg =  "メールアドレスが入力されていません。"
		}
	}else if(type=="2"){
		//パスワード変更
		var Password1 = getComponent("Password1").value;
		var Password2 = getComponent("Password2").value;
		
		if (getComponent("LoginName").value == ""){
			sessionScope.ErrMsg =  "ログインユーザー名が入力されていません。"
				
		}else if (Password1 == "" || Password2 == "" ){
			sessionScope.ErrMsg =  "パスワードが入力されていません。"

		}else if (Password1 != Password2){
			sessionScope.ErrMsg =  "パスワードが一致しません。パスワードを入力し直して下さい。"
		}	
	
	}else if(type=="3"){
		if (getComponent("LoginName").value == ""){
			sessionScope.ErrMsg =  "ログインユーザー名が入力されていません。"
				
		}else if (getComponent("MailAddress").value == ""){
			sessionScope.ErrMsg =  "メールアドレスが入力されていません。。"

		}	
	}
	
	if (sessionScope.ErrMsg != ""){
		return false;
	}else{
		return true;
	}	
}


//////////////////////////////////////////
//[SetPersonHistory]お気に入り履歴登録
//引数
//key  int  UP:1 Down:0
//戻り値
//なし
//////////////////////////////////////////
qa_JsLib.SetPersonHistory = function(targetDoc:NotesXspDocument,key:int){
	//登録チェック
	//環境設定文書取得
	var db:NotesDatabase = session.getCurrentDatabase();
	var envvw:NotesView = db.getView("V_Setting");
	var envdoc:NotesDocument = envvw.getFirstDocument();
	if (envdoc == null){
		return "";
	}		
	
	//プロフィールDB取得
	var ProServer = envdoc.getItemValueString("Profile_server");
	var ProPath = envdoc.getItemValueString("Profile_path");
	var Prodb:NotesDatabase = session.getDatabase(ProServer,ProPath);
	if (Prodb == null) {
		return "";
	}
	//自分のプロフィール取得
	
	var user = @Name("[ABBREVIATE]", @UserName());
	var Provw:NotesView = Prodb.getView("V_Profile");			
	var Prodoc:NotesDocument = Provw.getDocumentByKey(user, true);
	if(Prodoc == null){
		return "";
	}else{
		
		var UniqueID = "";
		var SetField = "";
		var setMax = 0;
		if(key == 1){
			//1:質問履歴
			//UniqueID = targetdoc.getItemValueString("UniqueID");
			UniqueID = targetdoc.getUniversalID();
			SetField ="History_Qs";
			setMax = 15;
		}else if(key == 2){
			//2：回答履歴(親のキー)
			UniqueID = targetdoc.getItemValueString("ParentDocId");
			SetField ="History_Ans";
			setMax = 15;
		}else if(key ==3|key ==4){
			//3：お気に入り
			UniqueID = targetdoc.getItemValueString("UniqueID");
			SetField ="Favorite";
			setMax = 9999;
		}
		
		
		var Nowitem =  Prodoc.getItemValue(SetField);
		if (Nowitem.length == 0) {
			Prodoc.replaceItemValue(SetField,UniqueID);
		} else {
			 var result = "";
			 var cf =0;
			 
			 if(Nowitem.length < setMax ){
				 var iMax = Nowitem.length
			 }else{
				 var iMax = setMax
			 }
			 
			for (var i=0; i<iMax; i++) {
			 	if(Nowitem[i]==UniqueID){
			 		//既に登録済みの場合、セットしない
			 		if(key ==4){
			 			//お気に入りクリア時は、クリアフラグ
			 			cf = 1
			 		}
				 }else{
			 		result  = result + Nowitem[i] + "\n";
			 	}
			 	
		 	}
			if(cf !=1){
				result  =UniqueID + "\n" + result ;
			}
		 	
		 	Prodoc.replaceItemValue(SetField,@Explode(result,"\n"));
		}
		Prodoc.save();
	}
	
}


//////////////////////////////////////////
//タグのセット
//引数
//戻り値
//なし
//////////////////////////////////////////

qa_JsLib.SetTag = function(){

	var inputTag =getComponent("taginput").getValue();

	

	
	
	
	var NowTag2 =@Explode(getComponent("djextListTextBox1").getValue(),",");
	var NowTag =getComponent("djextListTextBox1").getValue();

	var inputTag_R = "";
	var  StrTag = "";
	for (var i=1; i<=@Elements(inputTag); i++) {
		var sIT = @Element(inputTag, i);
		 	 //既存値チェック
		 	 
		var input:com.ibm.xsp.component.xp.XspInputText = @Trim(sIT); 
		//var sourceString = input.getValueAsString(); 
		var sourceString = input;
		var transITag = com.ibm.icu.text.Normalizer.normalize(sourceString,
		com.ibm.icu.text.Normalizer.NFKC); 

		
			 //質問文書上で検索
			var TagChkQ =@DbLookup(@DbName(),"V_TagSearch",@LowerCase(@Trim(transITag)),2);
			if( TagChkQ==undefined){
					 
					//プロフィール文書上 で検索
					var sv =getComponent("Profile_SV").getValue();
					var path = getComponent("Profile_Path").getValue();

					var PRF_dbname = new Array((sv.size() === 0) ? '' : sv[0], path[0]);
					var TagChkP =@DbLookup(PRF_dbname,"V_Profile_Tag",@LowerCase(@Trim(transITag)),2);
					if( TagChkP==undefined){	 
						StrTag = transITag
					 }else{
						 StrTag = TagChkP
					 }
			}else{
				 StrTag = TagChkQ
			}
			
			if(inputTag_R==""){
					  	inputTag_R = StrTag ;
					 }else{
					  	inputTag_R = inputTag_R + ","+ StrTag;
			}
	}
			
		var inputTag_R2  =@Unique(@Explode(inputTag_R,","));
		
		
		
	if (NowTag.length == 0) {
				getComponent("djextListTextBox1").setValue(inputTag_R2);
				getComponent("taginput").setValue("");
	} else {
				 var result = "";
				 
					for (var n=1; n<=@Elements(NowTag); n++) {
						result  = result + @Element(NowTag, n) + ",";
				 	}
				 
				 	for (var i=1; i<=@Elements(inputTag_R2); i++) {
				 		var i1 = @Element(inputTag_R2, i);//登録しようとしているタグ
				 		var nchk = false
				 		for (var n=1; n<=@Elements(NowTag); n++) {
				 			var n1 = @Element(NowTag, n);//現在のタグ
				 			if(n1==i1){
			 					//既に登録済みの場合、処理させない。
			 					nchk = true
			 					break
					 		}
				 		}
				 		if(nchk==false){
				 			result  = result + i1 + ",";
				 		}
			 		}
			 	
			 	result  =@Explode(result ,",");
			 	
				getComponent("djextListTextBox1").setValue(result);
				getComponent("taginput").setValue("");
	}
}			


//////////////////////////////////////////
//[DeleteDocument]文書削除
//引数
//key  int  質問文書:1 回答文書:2
//戻り値
//なし
//////////////////////////////////////////
qa_JsLib.DeleteDocument = function(targetDoc:NotesXspDocument,key:int){

//フォーム名を変更して非表示化
var fmname = targetdoc.getItemValueString("form");
targetDoc.replaceItemValue("form",fmname + "_del");
targetDoc.save();


	if (key == 1) {
		//ログ出力	(質問-1)
		qa_JsLib.ComposeAccess_log(targetDoc,null ,'4','-1')
		
		//質問文書の場合、回答も削除
		var answerlist = database.getView("V_Answer_All");
		var vec:NotesViewEntryCollection= answerlist.getAllEntriesByKey(targetDoc.getItemValueString('UniqueID'));

		if (vec.getCount() == 0) {
			return;
		}
		var entry:NotesViewEntry = vec.getFirstEntry();
		while (entry != null) {
			//フォーム名を変更して非表示化
			var Ansdoc = entry.getDocument()
			var fmnameAns = Ansdoc.getItemValueString("form");
			Ansdoc.replaceItemValue("form",fmnameAns + "_del");
			Ansdoc.save();

			//ログ出力	(回答-1)
			//＞＞せっかく回答してくれたので、削除しない。
			
			var tmpentry = vec.getNextEntry();
			entry.recycle();
			entry = tmpentry;
		}
	}else{
		
		if(targetDoc.getItemValueString("AorC")=="A"){
			//ログ出力	(回答-1)
			qa_JsLib.ComposeAccess_log(targetDoc,null ,'5','-1')
		}else{
			//ログ出力	(コメント-1)
			qa_JsLib.ComposeAccess_log(targetDoc,null ,'6','-1')
		}
		
	}

}
//////////////////////////////////////////
//[IsSameUrlFileName]URLのファイル名と一致するか確認
//引数
//pageName  string or [string]: URLのファイル名が同じかチェックする名前。配列の場合は、いずれかに一致するか確認する
//戻り値
//boolean: 同じ場合は true そうでない場合は false を返す
//////////////////////////////////////////
qa_JsLib.IsSameUrlFileName = function IsSameUrlFileName(pageName){
	var _fileName = context.getUrl().getPath(),
	    _pageName = [],
	    _result = false, _reg;
	print('_fileName:' + _fileName);
	if(pageName instanceof Array){
	    _pageName = pageName;
	}else{
	    _pageName = [pageName];
	}
	for(var i=0,max=_pageName.length; i < max; i++){
	    _reg = new RegExp('/' + _pageName[i] + '$');
	    print(_pageName[i] + '$');
	    if(_reg.test(_fileName)){
	        _result = true;
	        break;
	    }
	}
	return _result;
}