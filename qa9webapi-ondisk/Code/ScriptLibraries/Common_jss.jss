var Common = {
	getSetting: function(){
		var setting = applicationScope.get('setting');
		if(setting == null){
			var settingView = database.getView('Settings');
			var doc = settingView.getFirstDocument();
			setting = {
				siteUrl: doc.getItemValueString('siteUrl'),
				db: {
					server: doc.getItemValueString('qadbServer'),
					path: doc.getItemValueString('qadbPath')
				},
				profileDb: {
					server: doc.getItemValueString('profileServer'),
					path: doc.getItemValueString('profilePath')
				}
			};
			applicationScope.put('setting', setting);
		}
		return setting; 
	},
	vectorToJsArray: function(vector){
		var ret = [];
		for(var i=0, max=vector.size(); i < max; i++ ){
			ret.push(vector.get(i));
		}
		return ret;
	},
	getQuestionView: function(){
		var setting = Common.getSetting();
		var qaDb = session.getDatabase(setting.db.server, setting.db.path);
		Common.questionView = qaDb.getView('V_Question_For_Search');
		return Common.questionView;
	},
	getUser: function(userid){
		var setting = Common.getSetting();
		var profileDb = session.getDatabase(setting.profileDb.server, setting.profileDb.path);
		var profileView:NotesView = profileDb.getView('V_Profiles');
		var profileDoc:NotesDocument = profileView.getDocumentByKey(userid);
		if(profileDoc == null){
			return profileDoc;
		}
		var userLink = new XSPUrl(setting.siteUrl + '/x_ProfileEdit.xsp');
		userLink.setParameter('UserId', userid);
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
			userName: profileDoc.getItemValueString('UserNameKj'),
			point: profileDoc.getItemValueInteger('User_Point'),
			userLink: userLink.toString(),
			faceImage: image
		}
	}
}