var {clip} = require('../utils'),
    _plots_base = require('./_plots_base')

module.exports = class Visualizer extends _plots_base {

    static defaults() {

        return {
            type:'visualizer',
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

            _visualizer:'visualizer',

            duration:1,
            range: {min:0,max:1},
            origin: 'auto',
            logScale: false,
            smooth: false,
            pips:true,

            _value: 'value',
            default: '',
            value: '',

            _osc:'osc',

            address:'auto',
            preArgs:[],
        }

    }

    constructor(options) {

        // backward compat
        if (options.props.widgetId) {
            options.props.value = '@{' + options.props.widgetId + '}'
            delete options.props.widgetId
        }

        super(options)

        this.fps = 30
        this.pips.y.min = Math.abs(this.getProp('range').min) >= 1000? this.getProp('range').min/1000+'k' : this.getProp('range').min
        this.pips.y.max = Math.abs(this.getProp('range').max) >= 1000? this.getProp('range').max/1000+'k' : this.getProp('range').max
        this.pips.x = false
        this.rangeY = this.getProp('range') || {min:0,max:1}
        this.logScaleY = this.getProp('logScale')
        this.length = Math.round(clip(this.fps * this.getProp('duration'), [8, 4096]))
        this.data = new Array(this.length).fill(this.rangeY.min)
        this.value = this.getProp('range').min
        this.cancel = false
        this.looping = false
        this.clock = 0
        this.lastUpdate = 0
        this.watchDuration = 1000 * this.getProp('duration')
        this.ticks = 0

    }

    startLoop() {

        this.clock = new Date().getTime()
        if (!this.looping) {
            this.lastUpdate = new Date().getTime()
            this.looping = true
            this.ticks = 0
            this.loop()
        }
    }

    loop() {

        var t = new Date().getTime()

        if (t -this.clock >= this.watchDuration) {
            this.looping = false
        }

        this.ticks += (t - this.lastUpdate) / (1000/this.fps)

        if (Math.floor(this.ticks) > 0) {
            this.shiftData(Math.floor(this.ticks))
            this.ticks -= Math.floor(this.ticks)
            this.batchDraw()
        }

        this.lastUpdate = t

        if (!this.looping) return

        setTimeout(()=>{
            this.loop()
        }, (1000/this.fps))

    }

    shiftData(n) {

        for (var i=0; i<n; i++) {
            this.data.push(this.value)
            this.data.splice(0,1)
        }

    }

    setValue(v, options={}) {

        if (Array.isArray(v) && v.length == this.length) {

            this.data = v
            this.value = v[v.length - 1]
            this.startLoop()

            if (options.sync) this.changed(options)


        } else if (typeof(v) == 'number'){

            this.value = v
            this.startLoop()

            if (options.sync) this.changed(options)


        }

    }


}
