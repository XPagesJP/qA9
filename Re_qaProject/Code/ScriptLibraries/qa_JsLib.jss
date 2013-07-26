//名前空間は設計要素名と同一にする(ローカルルール)
var qa_JsLib = {};

//////////////////////////////////////////
//[SetGoodCountUD]いいね！アクション
//引数
//   key  int  UP:1 Down:0
//戻り値
//   なし
//////////////////////////////////////////
qa_JsLib.SetGoodCountUD = function(key:int ,targetDoc:NotesXspDocument){

	//var targetdoc = docQues.getDocument();
	var su = getComponent("sessionUser").getValue();

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
	Key.add(getComponent("sessionUser").getValue());
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
//Action　アクション内容（閲覧|0/いいね|1/これで解決|2）
//Key1	　キー１の値
//戻り値
//なし
//////////////////////////////////////////
qa_JsLib.ComposeAccess_log = function(targetDoc:NotesXspDocument,Chkkey , Action ,Key1){

	var accountlist = database.getView("V_Setting");
	var Settingdoc =accountlist.getFirstDocument();
	var QAV_server =Settingdoc.getItemValue("QAview_server");
	var QAV_path =Settingdoc.getItemValue("QAview_path");
	var QAV_db = session.getDatabase(QAV_server[0],QAV_path[0]);


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
	QAV_doc.replaceItemValue("AccessUser",getComponent("sessionUser").getValue());
	var date_notes = session.createDateTime(@Now()); 
	QAV_doc.replaceItemValue("AccessDate", date_notes);

	QAV_doc.replaceItemValue("Action",Action);
	QAV_doc.replaceItemValue("Key1",Key1);

	QAV_doc.save();

}