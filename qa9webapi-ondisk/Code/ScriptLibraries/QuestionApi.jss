import StringUtil;
import Common_jss;

var dateFormat = new java.text.SimpleDateFormat('yyyy/MM/dd HH:mm:ss Z');

var QuestionApi = {
	createSerchConditions: function(){
		var skip = Number(param.get('skip'));
		var take = Number(param.get('take'));
		var status = param.get('status');
		var statusRegex = /^(all)|(solved)|(unsolved)$/;
		var sort = param.get('sort');
		var sortRegex = /^(good)|(answer)|(view)|(news)$/;
		var conditions = {
			skip: isNaN(skip) ? 0 : skip,
			take: (isNaN(take) || take <= 0) ? 10 : take,
			status: (statusRegex.test(status)) ? status : 'all',
			category : param.get('category'),
			sort: (sortRegex.test(sort)) ? sort : 'news',
			search: param.get('search'),
			tag: param.get('tag')
		};
		return conditions;
	},
	/// 質問のリストを返す
	getList: function(conditions){
		
		var conditionsArray = [];
		// カテゴリの条件
		if(!StringUril.isNullOrEmpty(conditions.category)){
			conditionsArray.push('[Category] CONTAINS "' + conditions.category + '"');
		}
		// ステータスの条件
		if(!StringUril.isNullOrEmpty(conditions.status)){
			switch(conditions.status){
				case 'all':
					break;
				case 'solved':
					conditionsArray.push('[Status] CONTAINS 2');
					break;
				case 'unsolved':
					conditionsArray.push('[Status] CONTAINS 1');
					break;
			}
		}
		// Searchの条件
		if(!StringUril.isNullOrEmpty(conditions.search)){
			conditionsArray.push(conditions.search);
		}
		// タグの条件
		if(!StringUril.isNullOrEmpty(conditions.tag)){
			conditionsArray.push('[Tag] CONTAINS "' + conditions.tag + '"');
		}
		// ソートする列名を決める
		var sortColumn = '';
		switch(conditions.sort){
			case 'good':
				sortColumn = 'CountOfGoods';
				break;
			case 'answer':
				sortColumn = 'CountOfAnswers';
				break;
			case 'view':
				sortColumn = 'CountOfViews';
				break;
			case 'news':
			default:
				sortColumn = 'Created';
				break;
		}
		// 文書の検索
		var docView:NotesView = Common.getQuestionView();
		var conditionString = conditionsArray.join(' AND ');
		// 条件になんかいれんとやっせん
		conditionString = (conditionString === '') ? '[created]>1970/1/1' : conditionString;
		print(conditionString);
		// 検索
		var totalCount = docView.FTSearchSorted(conditionString, 0, sortColumn, false, false,false,false);
	
		var entries:NotesViewEntryCollection = docView.getAllEntries()
		var array = []; //返すJSONのオブジェクト配列を定義
		var entry:NotesViewEntry = entries.getNthEntry(conditions.skip + 1);
		var count = 0;
		var doc:NotesDocument;
		while(entry != null){
			doc = entry.getDocument();
			var createDate = entry.getColumnValues().get(3).toJavaDate();
			
			var xspDoc = com.ibm.xsp.model.domino.wrapped.DominoDocument.wrap(doc.getParentDatabase().getFilePath(), doc, null, null, false, null);
			session.setConvertMime(true);
			var body = xspDoc.getItemValueString("Body");
			body = @Left(body, 100);
			session.setConvertMime(false);
			var user = Common.getUser(doc.getItemValueString('Author'));
			array.push(
				{
	                "id": doc.getItemValueString('UniqueID'),
	                "goodsCount": entry.getColumnValues().get(0),
	                "viewsCount": entry.getColumnValues().get(1),
	                "answersCount": entry.getColumnValues().get(2),
	                "title": doc.getItemValueString('Title'),
	                "body": body,
	                "status": (doc.getItemValueString('Status') === '1') ? 'unsolved' : 'solved',
	                "tags": Common.vectorToJsArray(doc.getItemValue('Tag')),
	                "createDatetime": dateFormat.format(createDate),
	                "user": user
            });
			if(conditions.take <= ++count){
				break;
			}
			entry = entries.getNextEntry(entry);
		}
		return toJson({
			totalCount: totalCount,
			list: array
		}); 
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