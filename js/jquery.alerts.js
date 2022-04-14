// jQuery Alert Dialogs Plugin
//
// Version 1.1
//
// Cory S.N. LaViska
//
// Usage:
//		jAlert( message, [title, callback] )
//		jConfirm( message, [title, callback] )
//		jPrompt( message, [value, title, callback] )
// 
// History:
//
//		1.00 - Released (29 December 2008)
//
//		1.01 - Fixed bug where unbinding would destroy all resize events
//
// License:
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC.
//

(function ($) {
    var ButtonTxtNative = "";
    $.alerts = {

        // These properties can be read/written by accessing $.alerts.propertyName from your scripts at any time

        verticalOffset: -(($(window).height()) * .1),                // vertical offset of the dialog from center screen, in pixels
        horizontalOffset: 0,                // horizontal offset of the dialog from center screen, in pixels/
        repositionOnResize: true,           // re-centers the dialog on window resize
        overlayOpacity: .01,                // transparency level of overlay
        overlayColor: '#FFF',               // base color of overlay
        draggable: true,                    // make the dialogs draggable (requires UI Draggables plugin)
        okButton: '&nbsp;ok&nbsp;',         // text for the OK button
        cancelButton: '&nbsp;Cancel&nbsp;', // text for the Cancel button
        dialogClass: null,                  // if specified, this class will be applied to all dialogs

        // Public methods

        alert: function (message, title, callback, ButtonTxt, CallBAckAfter_OK_Function) {
            if (title == null) title = 'Alert';
            $.alerts._show(title, message, null, 'alert', ButtonTxt, CallBAckAfter_OK_Function, function (result) {
                //if (callback) 
                callback(result);
            });

        },

        confirm: function (message, title, callback, OKText, CancelText, CallBAckAfter_OK_Function) {
            if (title == null) title = 'Confirm';
            $.alerts.okButton = OKText;
            $.alerts.cancelButton = CancelText;
            $.alerts._show(title, message, null, 'confirm','', CallBAckAfter_OK_Function, function (result) {
               // if (callback) 
                 callback(result);
            });
        },

        prompt: function (message, value, title, callback) {
            if (title == null) title = 'Prompt';
            $.alerts._show(title, message, value, 'prompt', function (result) {
                if (callback) callback(result);
            });
        },

        // Private methods

        _show: function (title, msg, value, type, ButtonTxt, CallBAckAfter_OK_Function, callbacks) {

            $.alerts._hide();
            $.alerts._overlay('show');
            
            $("BODY").append(
			  '<div id="popup_container" style="text-align: center" class="ui-simpledialog-container ui-overlay-shadow Simple-Dialog-ui-corner-all  ui-body-b in">' +
            '<meta http-equiv="Content-Type" content="text/html; charset=windows-1256" />' +
              '<div  class="ui-header ui-bar-b" style="background-color: burlywood;">' +
			    '<h3 id="popup_title" style="text-align: center;margin: 0px;font-size: 13px;" class="ui-simpledialog-title"></h1>' + '</div>' +
			    '<div id="popup_content" style="background-color: white;" >' + '<center>' +
			      '<div id="popup_message" class="AccountName" style="width:100%;  font-size: medium;text-shadow: 0px 0px 0px white;"></div>' + '</center>' +
				'</div>' +
			  '</div>');
            try{
                if ($.alerts.dialogClass)
                    $("#popup_container").addClass($.alerts.dialogClass);

                // IE6 Fix
                var pos = /*($.browser.msie && parseInt($.browser.version) <= 6) ? 'absolute' : */'fixed';
            }catch(e){alert('mm'+e);}
           
            $("#popup_container").css({
                position: pos,
                zIndex: 99999,
                padding: 0,
                margin: 0,
                left: '7.5% !important'
            });
          
            $("#popup_title").text(title);
            $("#popup_content").addClass(type);
            $("#popup_message").text(msg);
            $("#popup_message").html($("#popup_message").text().replace(/\n/g, '<br />'));

            $("#popup_container").css({
                minWidth: ($(window).width() / 2), /*$("#popup_container").outerWidth(),*/
                maxWidth: (($(window).width()) - 20)// $("#popup_container").outerWidth()
            });

            $.alerts._reposition();
            $.alerts._maintainPosition(true);
            
            switch (type) {
                case 'alert':
                    $("#popup_message").after('<div id="popup_panel" style="text-align:center;height:50px;"><center> <button data-role="button" id="popup_ok" data-theme="b" style="width:35%;height:30px;margin-bottom:10px;font-size: medium;line-height:1.9em;text-shadow: 0px 0px 0px #fff !important;" Class="gold-bg-1 BorderRadus_All ui-btn ui-shadow ui-btn-corner-all ui-btn-up-b BorderRadus_All "  rel="close" >' + ButtonTxt + '</button></center></div>');
                    //                    $("#popup_message").after(function () { document.getElementById("popup_ok").html = ButtonTxtNative; alert("cccccccccc         " + document.getElementById("popup_ok").html); });
                    $("#popup_ok").click(function () {
                        eval(CallBAckAfter_OK_Function);
                        $.alerts._hide();
                      //  callback(true);
                    });
                    $("#ClossImage").click(function () { $.alerts._hide(); });
                    $("#popup_ok").focus().keypress(function (e) {
                        if (e.keyCode == 13 || e.keyCode == 27) $("#popup_ok").trigger('click');
                    });
                    break;
                case 'confirm':
                    $("#popup_message").after('<div id="popup_panel" style="text-align:center;"><center> <table style="width:100%"> <tr><td style="width:50%" align="center"><a href="#" data-role="button" id="popup_ok" data-theme="b" style="width: 75%; height: 30px;font-size: medium;line-height: 1.9em;text-shadow: 0px 0px 0px #fff !important;" Class="BorderRadus_All ui-btn ui-shadow ui-btn-corner-all BorderRadus_All ui-btn-up-b" rel="close"> ' + $.alerts.okButton + '</a></td><td style="width:50%" align="center"><a href="#" data-role="button" id="popup_cancel" data-theme="a" style="width: 75%;height: 30px;font-size: medium;line-height: 1.9em;" Class="BorderRadus_All ui-btn ui-shadow ui-btn-corner-all BorderRadus_All ui-btn-up-a" rel="close" >' + $.alerts.cancelButton + '</a></td></tr></table></center></div>');
                    //$("#popup_message").after('<div id="popup_panel" ><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
                    $("#popup_ok").click(function () {
                        eval(CallBAckAfter_OK_Function);
                        //callback(true);
                        $.alerts._hide();
                    });
                    $("#popup_cancel").click(function () {
                        $.alerts._hide();
                        if (locationPolicy == "true") {
                            setTimeout(function () {
                                AlertFunction("AlRajhi Application may collect, use, and share your location Data in order toprovide location-based services.Most browsers and devices provide tools to opt out from this feature by default.If explicit authorization has been provided, your location data may be tracked by this Application.", "بنك الراجحى قد يجمع ويستخدام ويتبادل بيانات موقعك من أجل توفير الخدمات المستندة إلى الموقع. معظم المتصفحات وأجهزة توفير الأدوات اللازمة لإلغاء الاشتراك من هذه الميزة بشكل افتراضي. إذا كان قد تم تقديم إذن صريح، ويمكن تعقب بيانات الموقع الخاص بك عن طريق هذا التطبيق", "Location Service Policy", "خصوصية المواقع", "OK", "موافق", "");
                                UserLocation = false;
                            }, 500);
                            locationPolicy = "";
                        };
                       // if (callback) callback(false);
                    });
                    $("#popup_ok").focus();
                    $("#popup_ok, #popup_cancel").keypress(function (e) {
                        if (e.keyCode == 13) $("#popup_ok").trigger('click');
                        if (e.keyCode == 27) $("#popup_cancel").trigger('click');
                    });
                    break;
                case 'prompt':
                    $("#popup_message").append('<br /><input type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
                    $("#popup_prompt").width($("#popup_message").width());
                    $("#popup_ok").click(function () {
                        var val = $("#popup_prompt").val();
                        $.alerts._hide();
                        if (callback) callback(val);
                    });
                    $("#popup_cancel").click(function () {
                        $.alerts._hide();
                        if (callback) callback(null);
                    });
                    $("#popup_prompt, #popup_ok, #popup_cancel").keypress(function (e) {
                        if (e.keyCode == 13) $("#popup_ok").trigger('click');
                        if (e.keyCode == 27) $("#popup_cancel").trigger('click');
                    });
                    if (value) $("#popup_prompt").val(value);
                    $("#popup_prompt").focus().select();
                    break;
            }

            // Make draggable
            if ($.alerts.draggable) {
                try {
                    $("#popup_container").draggable({ handle: $("#popup_title") });
                    $("#popup_title").css({ cursor: 'move' });
                } catch (e) { /* requires jQuery UI draggables */ }
            }
        },

        _hide: function () {
            $("#popup_container").remove();
            $.alerts._overlay('hide');
            $.alerts._maintainPosition(false);
        },

        _overlay: function (status) {
            switch (status) {
                case 'show':
                    $.alerts._overlay('hide');
                    $("BODY").append('<div id="popup_overlay"></div>');
                    $("#popup_overlay").css({
                        position: 'absolute',
                        zIndex: 99998,
                        top: '0px',
                        left: '0px',
                        width: '100%',
                        height: $(document).height(),
                        background: 'black',
                        opacity: 0.3
                    });
                    break;
                case 'hide':
                    $("#popup_overlay").remove();
                    break;
            }
        },
       
        _reposition: function () {
            var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset;
            var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
            if (top < 0) top = 0;
            if (left < 0) left = 0;

            // IE6 fix
           // if ($.browser.msie && parseInt($.browser.version) <= 6) top = top + $(window).scrollTop();

            $("#popup_container").css({
                top: top + 'px',
                left: left + 'px'
            });
            $("#popup_overlay").height($(document).height());
        },

        _maintainPosition: function (status) {
            if ($.alerts.repositionOnResize) {
                switch (status) {
                    case true:
                        $(window).bind('resize', $.alerts._reposition);
                        break;
                    case false:
                        $(window).unbind('resize', $.alerts._reposition);
                        break;
                }
            }
        }

    }


    // Shortuct functions
    jAlert = function (message, title, callback, ButtonTxt, CallBAckAfter_OK_Function) {

        $.alerts.alert(message, title, callback, ButtonTxt, CallBAckAfter_OK_Function);

    }

    jConfirm = function (message, title, callback, OKText, CancelText, CallBAckAfter_OK_Function) {
        $.alerts.confirm(message, title, callback, OKText, CancelText, CallBAckAfter_OK_Function);
    };

    jPrompt = function (message, value, title, callback) {
        $.alerts.prompt(message, value, title, callback);
    };

})(jQuery);