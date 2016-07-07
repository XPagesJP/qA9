function insertHTML(codeId, previewId, langId) {
	var code = dojo.byId(codeId).value;
	var preview = dojo.byId(previewId).firstChild;
	if (preview.innerText !== undefined) {
		preview.innerText = code;
	}
	if (!!preview.textContent !== undefined) {
		preview.textContent = code;
	}
	hljs.highlightBlock(preview);
}

function loadSocialButton() {
	// twitter
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
	
	// facebook
	( function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id))
			return;
		js = d.createElement(s);
		js.id = id;
		js.src = "//connect.facebook.net/ja_JP/sdk.js#xfbml=1&appId=177509492387338&version=v2.0";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
}

function reloadSocialButton(){
	if(!!window.gapi){
		gapi.plusone.go();
	}
	if(!!window.twttr){
		twttr.widgets.load();
	}
	if(!!window.FB){
	    FB.XFBML.parse();
	}
}