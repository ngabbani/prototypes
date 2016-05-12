var opera = navigator.userAgent.indexOf('Opera') > -1;
var ie = navigator.userAgent.indexOf('MSIE') > 1 && !opera;
var mozilla = navigator.userAgent.indexOf('Mozilla/5.') == 0 && !opera;

function Xavier(elem_id, target_id, shim_id) {
    this.elem = document.getElementById(elem_id);

    this.target = document.getElementById(target_id);
    this.target.style.zIndex = 40001;

    /* setup iframe shim for IE6 bug fix */
    this.shim = document.getElementById(shim_id);
    this.shim.style.top = this.target.style.top;
    this.shim.style.left = this.target.style.left;
    this.shim.style.zIndex = this.target.style.zIndex - 1;

    this.source = null;

    var self = this;

    this.separator = '; ';
    this.input_limit = 10000;
    this.display_limit = 10;
    this.use_corrections = false;
    this.selected_class = 'selected';
    this.ajax_matching = false;
    this.clean_text = false;
    this.returnlistseparator = ','

    this.separator_regex = new RegExp("\\s+", "ig");

    this.prev_val = null;
    this.prev_arr = null;

    this.item_arr = null;
    this.curr_index = 0;

    this.match_arr = null;

    this.list_items = null;
    this.selected_index = 0;
    this.pressed_arrow_yet = false;
    this.list_length = 0;

    /* ignore browser's autocomplete for this input */
    this.elem.setAttribute("autocomplete", "off");

    this.elem.onkeydown = function(e) {
        if (self.list_length > 0) {
            switch (getKeyCode(e)) {
                case 40: /* down */
                    self.moveSelection(-1);
                    return false;
                    break;
                case 38: /* up */
                    self.moveSelection(1);
                    return false;
                    break;
                case 9:
                    self.insertSelectionFromTab();
                    return true;
                    break;
                case 13: /* enter */
                    self.insertSelectionFromEnter();
                    return false;
                    break;
                case 27: /* esc */
                    self.reset();
                    break;
            }
        }
    }

    this.elem.onkeyup = function(e) {
        if (this.shouldHandleEvent(e)) {
            self.handleMatching(this.value);
            this.prev_val = this.value;
        }
    }

    this.elem.onblur = function(e) {
        self.reset();
    }

    this.elem.shouldHandleEvent = function(e) {
        switch (getKeyCode(e)) { case 9: return true; break; case 13: case 27: case 38: case 40: return false; break; }
        if (this.prev_val == this.value) { return false; }
        return true;
    }

    this.handleMatching = function(value) {
        this.item_arr = this.getItemArray(value);
        if (this.item_arr.length <= this.input_limit) {
            this.curr_index = this.item_arr.length - 1;
            this.getMatches(this.item_arr[this.curr_index]);
        }
    }

    this.getItemArray = function(value) {
        var result_arr = new Array();
        if (this.input_limit > 1) {
            var arr = value.split(this.separator_regex);
            var curr = null;
            for (var i = 0; i < arr.length; i++) {
                curr = trim(arr[i], ' ');
                if (curr.length > 0) { result_arr.push(curr); }
            }
        } else {
            result_arr.push(value);
        }
        return result_arr;
    }

    this.moveSelection = function(direction) {
        if (this.list_items && this.list_items.length > 0) {
            var new_index = 0;
            if (!this.pressed_arrow_yet) {
                this.pressed_arrow_yet = true;
            } else {
                if (direction == -1) { new_index = (this.selected_index < this.list_length - 1) ? this.selected_index + 1 : 0; }
                else if (direction == 1) { new_index = (this.selected_index > 0) ? this.selected_index - 1 : this.list_length - 1; }
            }
            this.setSelection(new_index);
        }
    }

    this.setSelection = function(index) {
        if (this.list_items.length > 0) {
            this.list_items.item(this.selected_index).className = '';

            this.selected_index = index;
            this.list_items.item(this.selected_index).className = this.selected_class;
        }
    }

    this.insertSelectionFromTab = function() {
        if (this.match_arr && this.pressed_arrow_yet) {
            this.insertMatch(this.match_arr[this.selected_index]);
        } else {
            this.moveCursor();
            this.reset();
            this.elem.focus();
        }
    }

    this.insertSelectionFromEnter = function() {
        if (this.match_arr && this.pressed_arrow_yet) {
            this.insertMatch(this.match_arr[this.selected_index]);
        }
    }

    this.getMatches = function(substr) {
        if (this.ajax_matching) {
            this.getAjaxMatches(substr);
        } else {
            this.getJavascriptMatches(substr);
        }
    }

    this.getAjaxMatches = function(substr) {
        this.source.goGoGadgetAjax(this, substr, this.display_limit);
    }

    this.getJavascriptMatches = function(substr) {
        if (this.source.arr && this.source.arr.length > 0 && substr && substr.length > 0) {
            substr = substr.toLowerCase();
            var result_arr = new Array();
            for (var i = 0; i < this.source.arr.length; i++) {
                if (this.use_corrections) {
                    if (result_arr.length < this.display_limit) {
                        result_arr.push(this.source.arr[i]);
                    }
                } else {
                    if (this.source.arr[i].toLowerCase().indexOf(substr) == 0 && result_arr.length < this.display_limit) {
                        result_arr.push(this.source.arr[i]);
                    }
                }

            }
            this.match_arr = result_arr;
            this.displayMatches(this.match_arr, substr);
        } else {
            this.reset();
        }
    }

    this.onSourceUpdate = function(substr) {
        this.getJavascriptMatches(substr);
    }

    this.insertMatch = function(match) {
        this.item_arr[this.curr_index] = match;
        this.elem.value = join_items(this.item_arr, this.separator);
        this.moveCursor();
        this.reset();
        this.elem.focus();
    }

    this.moveCursor = function() {
        if (ie || opera) {
            var range = this.elem.createTextRange();
            range.move("character", this.elem.value.length);
            range.select();
        }
        this.elem.scrollTop = this.elem.clientHeight;
    }

    this.reset = function() {
        this.match_arr = null;
        this.list_items = null;
        this.selected_index = 0;
        this.pressed_arrow_yet = false;
        this.target.innerHTML = '';
        this.target.style.display = 'none';
        this.shim.style.display = 'none';
    }

    this.displayMatches = function(arr, substr) {
        if (arr && arr.length > 0) {
            if (this.list_length != arr.length) { this.selected_index = 0; this.pressed_arrow_yet = false; }
            this.list_length = arr.length;
            var substr_reg = new RegExp("(" + substr + ")", "i")
            var ul = document.createElement('ul');
            for (var i = 0; i < this.match_arr.length && i < this.display_limit; i++) {
                //ul.appendChild(this.formatMatch(this.match_arr[i], substr_reg, i));
                ul.appendChild(this.formatMatch(this.match_arr[i], substr_reg, i));
            }
            ul.style.padding = '0px';
            ul.style.margin = '0px';
            ul.style.height = 'auto';
            this.target.innerHTML = '';
            this.target.appendChild(ul);
            this.target.style.display = 'block';
            this.iframeShim();
            this.list_items = this.target.getElementsByTagName("li");
            //this.setSelection(this.selected_index);
        } else {
            this.reset();
        }
    }

    this.formatMatch = function(match, substr_reg, index) {
        var li = document.createElement('li');
        //li.innerHTML = match.replace(substr_reg, '<span class="substr">' + "$1" + '</span>');
        li.innerHTML = match
        li.onmousedown = function(e) { self.insertMatch(match); }
        li.onmouseover = function(e) { self.setSelection(index); }
        li.style.margin = '0px';
        return li;
    }

    this.iframeShim = function() {
        this.shim.style.width = this.target.offsetWidth;
        this.shim.style.height = this.target.offsetHeight;
        this.shim.style.display = 'block';
    }
}

function XavierSource(for_user, key1, key2, use_corrections, clean_text, data_source, return_list_separator) {
    this.for_user = for_user;
    this.key1 = key1;
    this.key2 = key2;
    this.use_corrections = use_corrections;
    this.clean_text = clean_text;
    this.data_source = data_source;
    this.ajaxPage = 'Xavier.aspx';
    this.returnlistseparator = return_list_separator

    var self = this;

    this.arr = new Array();
    this.observers = new Array();

    this.add = function(obj) {
        this.observers.push(obj);
        obj.source = this;
    }

    this.update = function(value, substr, obj) {
        if (value && value.length > 1) { this.arr = value.split(this.returnlistseparator); }
        else { this.arr = new Array(); }
        if (obj) { obj.onSourceUpdate(substr); }
        else {
            for (var i = 0; i < this.observers.length; i++) {
                this.observers[i].onSourceUpdate(substr);
            }
        }
    }

    this.goGoGadgetAjax = function(obj, substr, limit) {
        var data = 'fu=' + this.for_user + '&key1=' + this.key1 + '&key2=' + this.key2 + '&corr=' + this.use_corrections + '&clean=' + this.clean_text + '&returnlistseparator=' + this.returnlistseparator;
        if (substr) data += '&substr=' + substr;
        if (limit) data += '&limit=' + limit;
        if (this.data_source) data += '&source=' + this.data_source;
        submitCallback(data, 'Xavier.aspx', function(success, response_text) { self.update(response_text, substr, obj); });
    }
}

function getKeyCode(e) {
    if (!e) e = window.event;
    if (e.keyCode) return e.keyCode;
    else if (e.which) return e.which;
    return false;
}

function trim(s, c) {
    if (s) {
        var len = s.length;
        if (len > 0) {
            while (s.substring(0, 1) == c) { s = s.substring(1, len); }
            while (s.substring(len - 1, len) == c) { s = s.substring(0, len - 1); }
        }
    }
    return s;
}

function join_items(arr, separator) {
    var result = '';
    var curr = null;
    var separator_wo_spaces = trim(separator, ' ');
    for (var i = 0; i < arr.length; i++) {
        curr = trim(arr[i], separator_wo_spaces);
        if (curr && curr.length > 0) {
            result += curr + separator;
        }
    }
    return result;
}