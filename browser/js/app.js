///////////////////////

WIDGETS = {}
WIDGETS_LINKED = {}
WIDGETS_ID_BY_PATH = {}
SESSION = []
STATE = []

CLIPBOARD = null
EDITING = false

TRAVERSING = false

TABS = {}


MISC = {
    iterators: {
        widget:{},
        tab:{}
    }
}

///////////////////////

$ = jQuery = require('./jquery/jquery.min')

///////////////////////

PXSCALE =  1
$('html').css('font-size',PXSCALE+'px')

///////////////////////

require('./jquery/jquery.ui')
require('./jquery/jquery.drag')
require('./jquery/jquery.resize')
require('./jquery/jquery.fake-input')

///////////////////////

var callbacks = require('./app/callbacks')

var bindCallback = function(i) {
    IPC.on(i,function(event,data){
        callbacks[i](event,data)
    })
}

for (i in callbacks) {
    bindCallback(i)
}


///////////////////////


IPC.send('ready')
