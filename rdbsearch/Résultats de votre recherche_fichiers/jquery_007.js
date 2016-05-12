/* 
This plugin relies on EmployerUI/MessageBox.ascx usercontrol in matrix and gets loaded as part of that file.

Thor Kristjansson
August 2011

Usage:
ONE BUTTON
$.CBMessageBox('show', {'message':'Your message!', 'caption':'Attention', 'confirmString':'OK'});
TWO BUTTONS
$.CBMessageBox('show', {'message':'Your message!', 'caption':'Attention', 'confirmString':'OK', 'cancelString':'Cancel'});
TWO BUTTONS, CALLBACK DEFINED FOR 1st BUTTON
$.CBMessageBox('show', {'message':'Your message!', 'caption':'Attention', 'confirmString':'OK', 'confirmCallback':function(){myfunc();}, 'cancelString':'Cancel'});
*/

(function ($) {
	$.CBMessageBox = function (action, options) {
		
		var defaults = {
			'message': '',
			'caption': '',
			'confirmString': '',
			'confirmCallback' : function(){},
			'cancelString': '',
			'cancelCallback' : function(){}
		};

		options = $.extend(defaults, options);

		if (action == 'show') {

			$("#MessageBoxBody").html(options.message);
	
			var dlg = $("#MessageBox").dialog({
				autoOpen: false,
				position: 'center',
				modal: true,
				minWidth: 300,
				maxWidth: 400,
				draggable: false,
				resizable: false,
				height: 'auto',
				dialogClass: 'msgbox',
				zIndex: 300000,
				title: options.caption				
			});
			
			if(options.confirmString != '' && options.cancelString == '')
			{			
				$( "#MessageBox" ).dialog( "option", "buttons", { "Ok": function() { $(this).dialog("close"); options.confirmCallback(); } } );
				$('.ui-dialog-buttonpane', '.msgbox').children(':button').eq(0).html(options.confirmString);
			}
			else if(options.confirmString != '' && options.cancelString != '')
			{			
				$( "#MessageBox" ).dialog( "option", "buttons", { "Ok": function() { $(this).dialog("close"); options.confirmCallback(); }, "Cancel": function() { $(this).dialog("close"); options.cancelCallback(); } } );
				$('.ui-dialog-buttonpane', '.msgbox').children(':button').eq(0).html(options.confirmString);
				$('.ui-dialog-buttonpane', '.msgbox').children(':button').eq(1).html(options.cancelString);
			}
					
			$(dlg).dialog('open');

		}
	};
})(jQuery);