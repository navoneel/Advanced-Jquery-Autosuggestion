(function ($) {

    $.fn.advancedautosuggestion = function (options) {
        var settings = $.extend({
            tagsreturnedfromServer: [
                "example.com", "akamai.com", "2charts.com", "gmail.com", "jquery.com", "yahoo.com", "ymail.com", "hotmail.com"
            ],
            customstyle: 'color:green'
        });



        var startTyping = "";


        function placeCaretAtEnd(el) {
            el.focus();
            if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }
        }

        function split(val) {
            val = val.replace(String.fromCharCode(160), " ");
            val = val.replace("&nbsp;", " ");
            //console.log('val **'+val+'**');
            //alert('val split **'+val.split(String.fromCharCode(160))+'**');
            return val.split(" ");
        }

        function extractLast(term) {
            return split(term).pop();
        }

        function sliceoffstringfromtheLastspaceJustbeforeindex(str, index) {

            var locationoffsetnearestspacebeforecaret = 0;
            for (var i = index; i >= 0; i--) { //console.log(value[i]);
                if ((str[i] == " ") || (str[i] == "&nbsp;") || str[i] == String.fromCharCode(160)) {
                    break;
                } else
                    locationoffsetnearestspacebeforecaret++;

            }
            return str.substring(i + 1, index + 1);

        }

        function getCaretCharacterOffsetWithin(element) {

            var caretOffset = 0;
            var doc = element.ownerDocument || element.document;
            var win = doc.defaultView || doc.parentWindow;
            var sel;
            if (typeof win != "undefined" && typeof win.getSelection != "undefined") {
                var range = win.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            } else if ((sel = doc.selection) && sel.type != "Control") {
                var textRange = sel.createRange();
                var preCaretTextRange = doc.body.createTextRange();
                preCaretTextRange.moveToElementText(element);
                preCaretTextRange.setEndPoint("EndToEnd", textRange);
                caretOffset = preCaretTextRange.text.length;
            }

            // console.log('caretoffset '+(caretOffset-1).toString());
            return caretOffset - 1;
        }

        function insertTextAtCursor(text, locationoffsetnearestspacebeforecaret) {
            var sel, range, html;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.setStart(range.startContainer, range.startOffset - locationoffsetnearestspacebeforecaret);
                    range.deleteContents();
                    var a = document.createElement('a');
                    a.setAttribute('href', "#");
                    a.setAttribute('contenteditable', "false");
                    a.setAttribute('color', "green");
                    a.innerHTML = text;
                    range.insertNode(a);
                    // this code places the caret at the end the text inserted
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            } else if (document.selection && document.selection.createRange) {
                document.selection.createRange().text = text;
                document.selection.createRange().select();
            }
        }
        String.prototype.fulltrim = function () {
            return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
        };
        var valueAtEnd = "hello";
        var previousValueOftextAreaHtml;
        var previousterm = '';
        var currentterm = '';


       

            var divtemp = $(this);

            $(divtemp).on('keydown click', function (e) {
                this.style.height = "1px";
                this.style.height = (15 + this.scrollHeight) + "px";
                previousValueOftextAreaHtml = $(this).html();




                var divsuggestion = $(document.createElement('div'));

                if (e.keyCode === $.ui.keyCode.ESCAPE && $(this).data("autocomplete").menu.active) {
                    //alert('working');
                    e.preventDefault();
                }


            }).autocomplete({

                minLength: 0,
                source: function (request, response) {
                    var term = request.term,
                        results = [];
                    term = term.replace(String.fromCharCode(160), " ");
                    term = term.replace("&nbsp;", " ");
                    var thistextarea = $(divtemp).get(0);
                    var locationofcaret = getCaretCharacterOffsetWithin(thistextarea);
                    currentterm = term;

                    var wordthatwasadded = term.charAt(locationofcaret);
                    // console.log('wordthatwasadded '+wordthatwasadded);
                    previousterm = term;

                    if (term.length == 1) {
                        results = $.ui.autocomplete.filter(settings.tagsreturnedfromServer, term);

                    }


                    if (term.indexOf(String.fromCharCode(160)) >= 0 || term.indexOf(" ") >= 0 || term.indexOf("&nbsp;") >= 0) {
                        if (term.length > 1) {
                            var wordtobesearched = sliceoffstringfromtheLastspaceJustbeforeindex(term, locationofcaret); // 'Steve Jobs Apple',7  will return 'Jo'

                            if (wordtobesearched.length > 0) results = $.ui.autocomplete.filter(settings.tagsreturnedfromServer, wordtobesearched);

                        } else {

                            results = "";
                        }
                    }

                    response(results);
                },

                focus: function (event) {


                    return false;
                },
                close: function (event, ui) {
                    var ev = event.originalEvent;
                    if ((ev !== undefined && ev.type === "keydown") && ev.keyCode === $.ui.keyCode.ESCAPE) {
                        var index = ($.browser.mozilla == true && (previousValueOftextAreaHtml.endsWith('<br>') == true || previousValueOftextAreaHtml.endsWith('<br/>') == true)) ? previousValueOftextAreaHtml.lastIndexOf("<br>") : previousValueOftextAreaHtml.length;
                        var newValueOftextAreaHtml = previousValueOftextAreaHtml.substring(0, index);
                        $(this).html(newValueOftextAreaHtml);
                        placeCaretAtEnd(this);
                    }


                },


                select: function (event, ui) {
                    if (ui.item.value !== startTyping) {
                        var value = $(this).text();
                        value = value.replace(String.fromCharCode(160), " ");
                        value = value.replace("&nbsp;", " ");
                        var thistextarea = $(divtemp).get(0);
                        var locationofcaret = getCaretCharacterOffsetWithin(thistextarea);
                        var locationoffsetnearestspacebeforecaret = 0;
                        //console.log(locationofcaret);
                        for (var i = locationofcaret; i >= 0; i--) { //console.log(value[i]);
                            if ((value[i] == " ") || (value[i] == "&nbsp;") || value[i] == String.fromCharCode(160)) {
                                break;
                            } else
                                locationoffsetnearestspacebeforecaret++;

                        }
                        // console.log(locationoffsetnearestspacebeforecaret);
                        insertTextAtCursor('<a contenteditable="false" style="' + settings.customstyle + '" href="#">' + ui.item.value + '</a>', locationoffsetnearestspacebeforecaret);
                        // placeCaretAtEnd(this);

                    }
                    return false;
                }
            })
                .data("autocomplete")._renderItem = function (ul, item) {

                    if (item.label != startTyping) {
                        return $("<li></li>")
                            .data("item.autocomplete", item)
                            .append("<a><div>" + item.label + "</div></div></a>")
                            .appendTo(ul);
                    } else {
                        return $("<li></li>")
                            .data("item.autocomplete", item)
                            .append("<a>" + item.label + "</a>")
                            .appendTo(ul);
                    }
            };

        

    }
}(jQuery));
