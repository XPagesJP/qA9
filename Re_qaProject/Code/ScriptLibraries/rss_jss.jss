importPackage(jp.xpages.qa);
import Common_jss;
var rss = {};
rss.getRssFeeds = function(){
	var feedCreator = new jp.xpages.qa.FeedCreator();
	feedCreator.setFeedTitle(database.getTitle());
	var settingView = database.getView("V_Setting");
	var settingDoc = settingView.getFirstDocument();
	var siteUrl = Common.getHost();
	feedCreator.setFeedLink(siteUrl);
	feedCreator.setFeedDescription(database.getTitle() + " に新規に登録された質問のリストです。");

	var newView = database.getView("RSS");
	var limit = 30;
	var doc = newView.getFirstDocument();
	var guid, title, docLink, desc, date;
	while(!!doc && 0 < limit){
		guid = doc.getItemValueString("UniqueID");
		title = doc.getItemValueString("Title");
		docLink = siteUrl + "/" + "x_anspage.xsp?docId=" + guid;
		docLink = docLink.replace("//","/");
		desc = @Left(doc.getItemValueString("Body"), 100);
		date = doc.getCreated().toJavaDate();
		feedCreator.setTextEntry(guid,title,docLink,desc,date);
		doc = newView.getNextDocument(doc);
		limit--;
	}
	
	var feedString = feedCreator.createFeed();
	return feedString;
	//return '<?xml version="1.0" encoding="utf-8"?><rss version="2.0"></rss>';
};