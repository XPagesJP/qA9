function insertHTML(codeId, previewId, langId) {
	var code = dojo.byId(codeId).value;
	var preview = dojo.byId(previewId).firstChild;
	if(preview.innerText !== undefined){
		preview.innerText = code;
	}if(!!preview.textContent !== undefined){
		preview.textContent = code;
	}
	hljs.highlightBlock(preview);
}