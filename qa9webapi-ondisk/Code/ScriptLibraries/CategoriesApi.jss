import StringUtil;
import Common_jss;

var CategoriesApi = {
	/// カテゴリのリストを返す
	getList: function(){
		
		// プロフィール文書の検索
		var setting = Common.getSetting();
		
		var qaDb = session.getDatabase(setting.db.server, setting.db.path);
		var qaView:NotesView = qaDb.getView('V_Setting');
		var kdoc:NotesDocument = qaView.getFirstDocument();
		var array = []; //返すJSONのオブジェクト配列を定義
		
		for(var i=0; i <= (kdoc.getItemValue("CategoryList").length)-1; i++){
			array.push(kdoc.getItemValue("CategoryList").get(i));
		}
		
		return toJson(array); 
		
	}
};