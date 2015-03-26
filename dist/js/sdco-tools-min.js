angular.module("sdco-tools",["sdco-tools.directives","sdco-tools.services","ngSanitize","ui.bootstrap"]),angular.module("sdco-tools.directives",["ui.bootstrap","sdco-tools.services"]),angular.module("sdco-tools.directives").directive("sdcoCustomEventActions",["$log",function(){return{restrict:"A",scope:{currentIndex:"="},link:function(e,t){t.on("keydown",function(t){e.$apply(function(){37==t.keyCode?e.currentIndex--:39==t.keyCode&&e.currentIndex++})})}}}]),angular.module("sdco-tools.directives").directive("sdcoEditorTab",["$log","sdcoEditorService",function(e,t){return{require:"^sdcoEditor",restrict:"E",transclude:!0,replace:!0,scope:{type:"@",heading:"@"},template:'			<div>				<div ng-transclude /> 				<div class="editorElement" ng-show="selected" /> 			</div> 		',link:function(e,n,o,i){var s=i.getNbEditors(),r=angular.element(n[0].querySelector("div[ng-transclude]")),c=r.text().trim();r.contents().remove();var a=i.getScope().readOnly;e.editor=t.installEditor(n[0].querySelector(".editorElement"),c,e.type,s,a),"html"==e.type&&i.confirmPreview(),a||e.editor.on("change",function(){e.$apply(function(){i.getScope().checkAndProcessContent()})}),i.addTabScope(e)}}}]),angular.module("sdco-tools.directives").factory("sdcoEditorLinkFn",["sdcoEditorService",function(e){return function(t,n,o,i){t.checkAndProcessContent=function(){t.contents=e.run(),t.compile&&!t.isCompileOnDemand()&&i.processEditorsContent()},t.checkAndProcessContent(),angular.forEach(t.tabScopes,function(e){e.editor.setSize("100%",t.height)}),t.wrapperStyle={width:t.width},t.settingsMenu=function(){var e=[{label:"jsFiddle",selected:t.isFiddle(),select:function(){t.jsFiddle=!0},deselect:function(){t.jsFiddle=!1}}];return t.compile&&e.push({label:"compile on demand",selected:t.isCompileOnDemand(),select:function(){t.compileOnDemand=!0},deselect:function(){t.compileOnDemand=!1}}),e}()}}]).factory("sdcoEditorControllerFn",["$templateCache","sdcoEditorService",function(e,t){return function(n){var o=n.tabScopes=[],i=0;n.processHtml=function(){if(contents=n.contents=t.run(),void 0!==contents.html){i=(i+1)%2;var o="contents"+i+".html";e.put(o,contents.html),n.htmlTemplateUrl=o}},n.processCss=function(){if(void 0!==contents.css){var e="dynamicEditorStyles",t=angular.element(document.querySelector("#"+e));0===t.length&&(t=angular.element("<style />").attr("type","text/css").attr("id",e),angular.element(document.querySelector("head")).append(t)),t.text(contents.css)}},n.processJs=function(){if(contents.javascript){var e="dynamicEditorJs",t=angular.element(document.querySelector("#"+e));0!==t.length&&t.remove(),t=angular.element("<script />").attr("type","text/javascript").attr("id",e),angular.element(document.querySelector("body")).append(t),t.text(contents.javascript)}},this.processEditorsContent=n.processEditorsContent=function(){if(n.compile)if(n.htmlProcessed=!1,n.processHtml(),n.processCss(),n.htmlProcessed)n.processJs();else var e=n.$watch("htmlProcessed",function(t){t&&(e(),n.processJs(),n.htmlProcessed=!1)})},this.getNbEditors=function(){return o.length},this.addTabScope=function(e){0===o.length&&(e.selected=!0),o.push(e)},this.getScope=function(){return n},this.confirmPreview=function(){n.confirmPreview=!0},n.isFiddle=function(){return"true"===n.jsFiddle||n.jsFiddle===!0},n.isCompileOnDemand=function(){return"true"===n.compileOnDemand||n.compileOnDemand===!0},n.selectTab=function(e){angular.forEach(o,function(e){e.selected=!1}),e.selected=!0},n.needPreview=function(){return 1==n.compile&&n.confirmPreview}}}]).directive("sdcoEditor",["sdcoEditorLinkFn","sdcoEditorControllerFn","$log",function(e,t){return{restrict:"E",transclude:!0,replace:!0,scope:{compile:"=",compileOnDemand:"@",readOnly:"@",width:"@",height:"@",jsFiddle:"@",displayTitle:"@"},template:'				<section class="editor-wrapper" ng-style="wrapperStyle"> 					<h1 ng-if="displayTitle">dynamic editor</h1> 					<div class="editor-preview-wrapper" ng-show="needPreview()"> 						<h2><span>preview</span></h2> 						<div ng-include src="htmlTemplateUrl" onload="htmlProcessed=true;" /> 					</div> 					<ul class="tabs-wrapper"> 						<li 							ng-repeat="tabScope in tabScopes" 							ng-class={selected:tabScope.selected} 							ng-click="selectTab(tabScope)" 							title="{{tabScope.heading}}" 						> 							<a href="">{{tabScope.heading}}</a> 						</li> 					</ul> 					<ul class="functions-wrapper"> 						<li ng-if="isFiddle()"> 							<sdco-js-fiddle fwk="AngularJS" version="1.2" title="test" desc="test" data="contents" /> 						</li> 						<li ng-if="compile && isCompileOnDemand()"> 							<a href="" class="compile-on-demand" ng-click="processEditorsContent()"></a> 						</li> 						<li> 							<section class="menu-options"> 								<sdco-options-menu settings-content="settingsMenu"></sdco-options-menu> 							</section> 						</li> 					</ul> 					<div ng-transclude /> 				</section> 			',link:e,controller:["$scope","$element","$transclude",t]}}]),angular.module("sdco-tools.directives").directive("sdcoJsFiddle",["$log","$sce",function(e,t){return{restrict:"E",replace:!0,scope:{fwk:"@",version:"@",title:"@",desc:"@",data:"="},template:'			<form 				method="post" 				action={{fiddleUrl}} 				target="check" 				class="jsfiddle" 			> 				<a href=""></a> 				<div ng-show="false"> 					<textarea type="text" name="html" ng-model="data.html" ng-trim="false" ></textarea> 					<textarea type="text" name="js" ng-model="data.javascript" ng-trim="false" ></textarea> 					<textarea type="text" name="css" ng-model="data.css" ng-trim="false" ></textarea> 				</div> 				<input type="text" name="title" ng-model="title" ng-show="false" ng-if="title"> 				<input type="text" name="description" ng-model="desc" ng-show="false" ng-if="desc"> 			</form>			',link:function(e,n){n.find("a").on("click",function(){n[0].submit()}),e.fiddleUrl=t.trustAsResourceUrl("http://jsfiddle.net/api/post/"+e.fwk+"/"+e.version+"/")}}}]),angular.module("sdco-tools.directives").directive("sdcoNotesExport",["$log","$modal","sdcoNotesService",function(e,t,n){var o=function(e){e.notes=JSON.stringify(n.exportNotes()),e.saveNotes=function(){n.importNotes(JSON.parse(e.notes))}};return{restrict:"E",scope:{},template:'				<button class="main-note" ng-click="open()" /> 			',link:function(e){var n=function(){return'<div style="font-size: small;"><div class="modal-header"> All Notes </div><div class="modal-body"><p> Copy this content in a file to save your comments or replace the content with your one to update all the notes </p><h2>Your notes</h2><textarea ng-model="notes" rows="10" style="width:100%;" ></textarea><input type="submit" ng-click="saveNotes()" value="save" /></div> 							</div>'};e.open=function(){t.open({template:n(),controller:o})}}}}]),angular.module("sdco-tools.directives").directive("sdcoNotes",["$log","$modal","sdcoNotesService",function(e,t,n){var o=function(e,t,o){e.noteData=o,e.saveNote=function(){n.saveNote(e.noteData)}};return{restrict:"E",transclude:!0,scope:{},template:'				<button class="local-note" ng-click="open()"> 				<div ng-show="false" ng-transclude /> 			',link:function(e,i){e.noteData=n.getNote();var s=angular.element(i[0].querySelector("div[ng-transclude]")),r=s.html();s.contents().remove();var c=function(){return'<div style="font-size: small;"> <div class="modal-header"> Notes </div> <div class="modal-body"><p>'+r+'</p><h2>Your notes</h2><textarea ng-model="noteData.note" rows="10" style="width:100%;" /><input type="submit" ng-click="saveNote()" value="save" /></div> </div>'};e.open=function(){t.open({template:c(),controller:o,resolve:{noteData:function(){return e.noteData}}})}}}}]),angular.module("sdco-tools.directives").directive("sdcoOptionsMenu",["$log",function(){return{restrict:"E",replace:!0,scope:{settingsContent:"="},template:'		<ul class="menu-settings"> 			<li> 				<a href="" class="main-menu" ng-click="expanded=!expanded"> 				</a> 			</li> 			<li> 				<ul class="menu-list" ng-show="expanded"> 					<li 						ng-repeat="currentOption in settingsContent" 						ng-click="applyAction(currentOption)" 					> 						<a 							href="" 							title="{{currentOption.label}}" 							ng-class="{\'menu-selected\':currentOption.selected}"> 							{{currentOption.label}} 						</a> 					</li> 				</ul> 			</li> 		</ul> 		',link:function(e){e.expanded=!1,e.applyAction=function(t){t.selected&&t.deselect&&t.deselect(),!t.selected&&t.select&&t.select(),t.selected=!t.selected,e.expanded=!1}}}}]),angular.module("sdco-tools.services",["ngSanitize"]),angular.module("sdco-tools.services").provider("sdcoEditorService",function(){this.isStorageActive=!1;var e=function(e,t,n,o){var i={},s=function(e){return"sdcoEditor"+e},r=function(){var e=[];return angular.forEach(i,function(t,n){var o=(t.getOption("mode"),t.getValue());e.push({id:n,content:o})}),e},c=function(){n.$on("$locationChangeStart",function(e,t,n){var o=s(n);angular.element(document.querySelector("body")).data(o,r()),i={}})};o&&c();var a=function(){var e=s(t.absUrl());return angular.element(document.querySelector("body")).data(e)};this.installEditor=function(e,t,n,s,r){if(o){var c=a(),l=c&&c[s]&&c[s].content;l&&(t=l)}var d={value:t,mode:{},lineNumbers:"true",theme:"eclipse",lineWrapping:!0,readOnly:r};switch(n){case"javascript":d.mode.name="javascript";break;case"html":d.mode.name="xml",d.htmlMode=!0;break;case"css":d.mode.name="css"}return editor=CodeMirror(e,d),angular.element(editor.getWrapperElement()).on("keydown",function(e){e.stopPropagation()}),i[s]=editor,editor},this.getInstalledEditors=function(){return i},this.setInstalledEditors=function(e){i=e},this.removeEditor=function(e){angular.forEach(i,function(t,n){return e==t?(angular.element(e.getWrapperElement()).remove(),delete i[n],!1):void 0})},this.run=function(){var e="",t="",n="";return angular.forEach(i,function(o){var i=o.getOption("mode"),s=o.getOption("htmlMode");"javascript"==i.name?e+=o.getValue():"css"==i.name?n+=o.getValue():"xml"==i.name&&s&&(t+=o.getValue())}),{javascript:e,html:t,css:n}}};this.$get=["$log","$location","$rootScope",function(t,n,o){return new e(t,n,o,this.isStorageActive)}]}),angular.module("sdco-tools.services").value("sdcoLocalStorageService",localStorage),angular.module("sdco-tools.services").service("sdcoNotesService",["$rootScope","sdcoLocalStorageService",function(e,t){this.commonPrefixKey="slide",this.currentIndice=0,this.mainKey=void 0,this.notes=[],this.exportNotes=function(){var e=[],n=new RegExp(this.commonPrefixKey+"\\d_\\d","i");for(var o in t){var i=o.match(n);i&&e.push({key:o,note:t[o]})}return e},this.importNotes=function(e){for(var n in e){var o=e[n];t.setItem(o.key,o.note)}},this.loadViewNotes=function(){var e=[],n=new RegExp(this.mainKey+"_\\d","i");for(var o in t){var i=o.match(n);if(i){var s=parseInt(i[0].substring(i[0].length-1));e.push({id:s,note:t[o]})}}this.notes.length=e.length;for(var r in e)this.notes[e[r].id]=e[r].note},this.getNote=function(){var e={id:this.currentIndice,note:this.notes[this.currentIndice]};return this.currentIndice++,e},this.saveNote=function(e){this.notes[e.id]=e.note,t.setItem(this.mainKey+"_"+e.id,e.note)},this.init=function(){var t=this;e.$on("$locationChangeSuccess",function(e,n){var o=n.match(/slide\d/i);o&&(t.mainKey=o[o.length-1],t.currentIndice=0,t.loadViewNotes())})}}]);