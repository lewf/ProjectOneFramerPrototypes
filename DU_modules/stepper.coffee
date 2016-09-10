class exports.stepper extends Layer
  constructor:(@options={}) ->
    options.backgroundColor ?= if options.setup then "hsla(60, 90%, 47%, .4)" else "transparent"
    super @options

  # @define 'alignMode'
  #   get: ->
  #     @options.alignMode
  #   set: (value) ->
  #     @options.alignMode = value
  # #     @options.title ?= "Stepper Title"
  # #     @options.subtitle ?= "Stepper Subtitle"
  # #     @options.stepStartValue   ?= 0
  # #     @options.stepMaxValue     ?= 2
  # #     @options.stepIncrement    ?= 1
  # #     super @options
  # {TextLayer} = require 'TextLayer'
#
# exports.stepperContainer = new Layer
# 	x:Align.center()
# 	y:Align.center()
# # 	parent:numPassengersForm
#
# stepperTitle = new TextLayer
# 		name:"Title"
# 		text:"Title"
# 		setup:true
# 		width:stepperWidth
# 		parent:stepperContainer
# 		autoSizeHeight:true
# 		textAlign:"center"
# 		fontFamily:"Celeste Sans Offc Pro"
# 		fontSize:20
# 		color:"black"
# 		lineHeight:1
# 		x:Align.center()
# stepperSubtitle = new TextLayer
# 		name:"Subtitle"
# 		text:"Subtitle"
# 		setup:true
# 		width:stepperWidth
# 		parent:stepperContainer
# 		autoSizeHeight:true
# 		textAlign:"center"
# 		fontFamily:"Celeste Sans Offc Pro"
# 		fontSize:12
# 		color:"black"
# 		lineHeight:1
# 		y:stepperTitle.maxY+10
# 		x:Align.center()
#
# # class exports.Stepper extends Layer
# #   constructor:(@options={}) ->
# #     @options.title ?= "Stepper Title"
# #     @options.subtitle ?= "Stepper Subtitle"
# #     @options.stepStartValue   ?= 0
# #     @options.stepMaxValue     ?= 2
# #     @options.stepIncrement    ?= 1
# #     super @options
# #
# #   @define 'title'
# #     get: ->
# #       @options.title
# #     set: (value) ->
# #       @options.title = value
# #   @define 'subtitle'
# #     get: ->
# #       @options.subtitle
# #     set: (value) ->
# #       @options.subtitle = value
# #   @define 'stepStartValue'
# #     get: ->
# #       @options.stepStartValue
# #     set: (value) ->
# #       @options.stepStartValue = value
# #   @define 'stepMaxValue'
# #     get: ->
# #       @options.stepMaxValue
# #     set: (value) ->
# #       @options.stepMaxValue = value
# #   @define 'stepIncrement'
# #     get: ->
# #       @options.stepIncrement
# #     set: (value) ->
# #       @options.stepIncrement = value
