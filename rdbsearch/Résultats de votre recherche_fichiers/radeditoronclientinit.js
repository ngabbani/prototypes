function RadEditorOnClientInit(editor) {
	editor.set_ajaxSpellCheckScriptReference(ScriptVariables.Get("RadEditorAjaxSpellCheck"));
	editor.set_mozillaFlashOverlayImage(ScriptVariables.Get("RadEditorNewImage"));
}
