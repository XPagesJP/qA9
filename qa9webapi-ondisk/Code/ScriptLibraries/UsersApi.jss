import StringUtil;
import Common_jss;

var dateFormat = new java.text.SimpleDateFormat('yyyy/MM/dd HH:mm:ss Z');

var UsersApi = {
	/// ユーザーのリストを返す
	getList: function(){
		
		var useridParam = param.get('userid');
		// プロフィール文書の検索
		var setting = Common.getSetting();
		
		var profileDb = session.getDatabase(setting.profileDb.server, setting.profileDb.path);
		var profileView:NotesView = profileDb.getView('V_Profiles');
		var array = []; //返すJSONのオブジェクト配列を定義
		

		if(StringUril.isNullOrEmpty(useridParam)){
			
			//ユーザーリスト
			var entries:NotesViewEntryCollection = profileView.getAllEntries()
			var entry:NotesViewEntry = entries.getFirstEntry();
			
			var count = 0;
			var targetDoc:NotesDocument;
			while(entry != null){
				
				targetDoc = entry.getDocument();
				var user = getUserAllinfo(targetDoc);
				array.push(user);
				entry = entries.getNextEntry(entry);
			}
		}else{
			//単一ユーザー
			var targetDoc:NotesDocument = profileView.getDocumentByKey(useridParam);
			if(targetDoc != null){
				var user = getUserAllinfo(targetDoc);
				array.push(user);
			}
			
		}
		
		return toJson(array); 
		
		/*************************************
		 * ユーザー情報の取得
		 **************************************/
		function getUserAllinfo(profileDoc:NotesDocument){
			print("getUserAllinfo");
			var userLink = new XSPUrl(setting.siteUrl + '/x_ProfileEdit.xsp');
			var userid = profileDoc.getItemValueString('UserID');
			var userName:NotesName = session.createName(userid);
			var userAbbreviated = userName.getAbbreviated();
			
			userLink.setParameter('UserId', userAbbreviated);
			
			//画像情報
			var image = (function(){
				var imageName:String = "xpPhotoPlaceholder.gif";
				var xspDoc = com.ibm.xsp.model.domino.wrapped.DominoDocument.wrap(profileDoc.getParentDatabase().getFilePath(), profileDoc, null, null, false, null);
			
				var al:java.util.List = xspDoc.getAttachmentList("Photo");
				if(!al.isEmpty())
				{
					var eo:NotesEmbeddedObject = al.get(0);
					imageName = eo.getHref();
				}
				return(setting.siteUrl + '/xsp' + imageName);			
			})();
			
			
			return {
				userId			:userAbbreviated,
				userName		: profileDoc.getItemValueString('UserNameKj'),
				point			: {
									total		:profileDoc.getItemValueInteger('User_Point'),
									question	:profileDoc.getItemValueInteger('Count_Qs'),
									good		:profileDoc.getItemValueInteger('Count_Good'),
									answer		:profileDoc.getItemValueInteger('Count_Ans'),
									bestAnswer	:profileDoc.getItemValueInteger('Count_BestAns'),
									comment		:profileDoc.getItemValueInteger('Count_Com'),
									favorite	:profileDoc.getItemValueInteger('Count_Fav'),
									view		:profileDoc.getItemValueInteger('Count_Com')
									},
				comment			: profileDoc.getItemValueString('Comment'),
				tags			: Common.vectorToJsArray(profileDoc.getItemValue('Tag')),
				questionHistory	: Common.vectorToJsArray(profileDoc.getItemValue('History_Qs')),
				answerHistory	: Common.vectorToJsArray(profileDoc.getItemValue('History_Ans')),
				favorite		: Common.vectorToJsArray(profileDoc.getItemValue('Favorite')),
				userPageLink	: userLink.toString(),
				faceImage		: image
			}
		}
		
	}
};
