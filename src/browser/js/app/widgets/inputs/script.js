var Widget = require('../common/widget'),
    widgetManager = require('../../managers/widgets')


class Script extends Widget {

    static defaults() {

        return {
            type:'script',
            id:'auto',
            linkId:'',

            _geometry:'geometry',

            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',

            _style:'style',

            label:'auto',
            color:'auto',
            css:'',

            _script:'script',

            script:'',

            _osc:'osc',

            address:'auto',
            preArgs:[],
            target: []

        }

    }

    constructor(options) {

        var html = `
            <div class="script">
            </div>
        `

        super({...options, html: html})

    }


    static scriptSet(id, value, options) {

        var widgets = widgetManager.getWidgetById(id)

        for (var i = widgets.length - 1; i >= 0; i--) {

            return widgets[i].setValue(value, options)

        }

    }

    scriptSend(target, address, ...args) {

        var overrides = {
            address,
            v: args,
            preArgs: []
        }

        if (target) overrides.target = Array.isArray(target) ? target : [target]

        this.sendValue(overrides)

    }


    setValue(v, options={} ) {

        var context = {
            value: v,
            send: options.send ? this.scriptSend.bind(this) : ()=>{},
            set: (id, value)=>{Script.scriptSet(id, value, options)},
            log: console.log
        }

        if (v) this.resolveProp('script', undefined, false, false, false, context)

        // if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

    }


}

Script.dynamicProps = Script.prototype.constructor.dynamicProps.concat(
    'script'
)

module.exports = Script