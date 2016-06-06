var QuestionApi = {
	GetList: function(category){
		var qaDb = session.getDatabase('','ebihara/qa9.nsf');
		var docView:NotesView = qaDb.getView('V_Date_All_Cate');
		var docs:NotesDocumentCollection;
		var array = []; //返すJSONのオブジェクト配列を定義
		var doc:NotesDocument;
		if(!!category){
		 	docs = docView.getAllDocumentsByKey(category);
		}else{
			docs = docView;
		}
		var doc = docs.getFirstDocument();
		while(doc != null){
			var status = doc.getItemValueString('Status');
			var tagsVector = doc.getItemValue('Tag');
			
			var obj = {
				title: doc.getItemValueString('Title'),
				//JSONに日付型は無いのでUnixTimeを利用する
				createDatetime: doc.getCreated().toJavaDate().getTime(),
				tags: VectorToStringArray(tagsVector),
				status: (status === '1') ? 'unsolved' : 'solved'
			};
			array.push(obj);
			doc = docs.getNextDocument(doc);
		}
		// JavascriptオブジェクトをJSON文字列に変換して返する
		return toJson(array); 
	},
	Create: function(inputObj){
		var qaDb = session.getDatabase('','ebihara/qa9.nsf');
        var doc = qaDb.createDocument();
        //実際には、入力値の検証が必要
        doc.replaceItemValue('form', 'FM_Question');
        doc.replaceItemValue('name', inputObj.name);
        doc.replaceItemValue('tag', inputObj.tag);
        doc.replaceItemValue('title', inputObj.title);
        doc.save(false,false);
        var result = {
            result: true,
            message: ""
        };
        return toJson(result);
    }
};

function VectorToStringArray(vector){
	var _vector:java.util.Vector = vector;
	var ret = [];
	for(var i=_vector.size()-1; 0 <= i; i--){
		ret.push(_vector[i]);
	}
	return ret;
}