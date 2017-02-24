# Use desktop cursor
document.body.style.cursor = "auto"
framerKit = require "framerKit"
ios = require 'iOSKit'
{ƒ,ƒƒ} = require 'findModule'
ViewController = require 'ViewController'
{TextLayer} = require 'TextLayer'

## panel construction arrays ###
t2Panels = []


# data structure for convenience
d = require "contentModel"



Framer.Device.deviceType = "fullscreen"
Framer.Device.fullScreen = true

### MAIN NAVIGATION ###

header = new Layer
	width:Screen.width
	height:120
	backgroundColor:"transparent"
	name:"header"

mainHeader = new Layer
	width: Screen.width
	parent:header
	height:80
	backgroundColor:"rgba(225,225,225,1)"
	
	
subHeader = new Layer
	parent:header
	width: Screen.width
	y: mainHeader.maxY
	backgroundColor:"white"
	shadowY:1
	shadowBlur: 1
	shadowColor: "rgba(10,10,10,0.2)"
	height:40
subHeader.originalYPosition = subHeader.y

cruiseNameHeader = new TextLayer # needs module included
	text:"Mediterranean Sea with Costa Diadema"
	height:subHeader.height
	width:150
	textAlign:"left"
	parent:subHeader
	fontFamily:"Celeste Sans Offc Pro"
	color:"#000"
	fontSize: 12
	fontWeight:600
	autoSize:false
	autoSizeHeight:true
	y: Align.center
	x: Align.left(10)

buyButtonHeader = new Layer
	backgroundColor: "#FF6008"
	borderRadius: 80
	height:26
	width:70
	parent:subHeader
	y:Align.center
	x:Align.right(-10)
	html:"BUY"
	style:
		fontFamily:"CelesteSansOffcPro"
		fontSize:"10pt"
		fontWeight:"600"
		color:"white"
		textAlign:"center"
buyButtonHeader.states.add
	out:
		backgroundColor: "#FF6008"
	on:
		backgroundColor: "#FFC500"

buyButtonHeader.on Events.TapStart, () ->
	buyButtonHeader.states.switchInstant("on")

buyButtonHeader.on Events.TapEnd, () ->
	buyButtonHeader.states.switchInstant("out")
		
buyButtonHeader.on Events.MouseOver, (event, layer) ->
	buyButtonHeader.states.switchInstant("on")
buyButtonHeader.on Events.MouseOut, (event, layer) ->
	buyButtonHeader.states.switchInstant("out")

navContainer = new Layer
# 	backgroundColor: "pink"
	backgroundColor:"transparent"
	parent:subHeader
	height:subHeader.height
	y:Align.center()
	
	
	
	
navLayers = []
maxWidth = 0
spacer = 50

sections = [] # stores navigation
for item in d.detailContent
	if item.isInNav == true 
		sections.push(item)

for i in [0...sections.length]

	navLayer = new TextLayer
		text:sections[i].navName
		name:sections[i].navName
# 		setup:true
		textAlign:"left"
		parent:navContainer
		paddingTop:5
		fontFamily:"Celeste Sans Offc Pro"
		color:"#000"
		fontSize: 13
		fontWeight:100
		autoSize:true
		y:Align.center()
		
	maxWidth += Math.round(navLayer.width) + spacer
	navLayer.states.add
		out:
			fontWeight: 100
		on:
			fontWeight: 600
	
	# base events
	navLayer.on Events.TapStart, (event,layer) ->
		layer.states.switchInstant("on")
	navLayer.on Events.TapEnd, (event,layer) ->
		layer.states.switchInstant("out")

	navLayer.on Events.MouseOver, (event, layer) ->
		layer.states.switchInstant("on")
	navLayer.on Events.MouseOut, (event, layer) ->
		layer.states.switchInstant("out")	
		
	navLayer.width = navLayer.width + spacer
	navLayers.push(navLayer)
	navLayers[i].x = navLayers[i-1].maxX if i != 0

navContainer.width  = maxWidth	
navContainer.maxX = buyButtonHeader.minX - 10

header.bringToFront()
## Mouse events







##BASIC SETUP##
# Create individual scrollable pages
# Create page component to hold pages

tellingPagesPager = new PageComponent
	height:Screen.height
	width:Screen.width
	backgroundColor:"yellow"
	scrollVertical: false
# 	scrollHorizontal: false
	directionLock:true
	
# Create scroll container for each page

for section in d.detailContent
	sectionScroll = new ScrollComponent
		backgroundColor: "white"
		name: section.navName
		scrollHorizontal: false
		mouseWheelEnabled: true
	
	
	sectionScroll.width = tellingPagesPager.width
	sectionScroll.height = tellingPagesPager.height
	### HANDLE HEADER ON SCROLL ###
	sectionScroll.on Events.Move, (offset) ->
		print "moving, offset: " + offset.y 
# 	sectionScroll.on Events.MouseWheel, (offset) ->
# 		print "wheel, offset: " + offset.y
	
# POPULATE SCROLL CONTAINER WITH SECTIONS

	for panel, i in section.sections
		panel = new Layer
			width:tellingPagesPager.width
			backgroundColor:Utils.randomColor()
			name:panel
			parent:sectionScroll.content
		if i != 0 
			panel.height = 800
			panel.y = (panel.height*i - header.height)
		else 
			panel.height = 800-header.height
	# Add scroll container with sections to pagecomponent
	tellingPagesPager.addPage(sectionScroll, "right")
	sectionScroll.updateContent()


		



### TIER 2 ###
##t2 content


# for i in [0...t2Panels.length]
# 	color = Utils.randomColor()
# 	
# 	panelView = new Layer
# 		width:Screen.width
# 		backgroundColor: color	
# 		parent:cruiseDetailT2Scroller.content
# 	if i == 0
# 		panelView.height = 800 - header.height
# 	else
# 		panelView.height = 800
# 	panelView.name = t2Panels[i] + "Section"
# for p in [0...cruiseDetailT2Scroller.content.children.length]
# 	if p != 0
# 		cruiseDetailT2Scroller.content.children[p].y = cruiseDetailT2Scroller.content.children[p-1].maxY
# header.parent = cruiseDetailT2Scroller.content
subHeader.originalYPosition = subHeader.y # custom property, storing position for later

### HANDLE SCROLLING STICKY HEADER ###
# cruiseDetailT2Scroller.on Events.Move, (offset) ->
# 	header.y = offset.y
# 	yOffset = -offset.y
# 	
# 	# header tint transition
# 	tint =  Utils.modulate(yOffset, [0,subHeader.originalYPosition], [1, 0.7], true)
# 	subHeader.backgroundColor = "rgba(255,255,255,#{tint})"
# 	
# 	#sticky header
# 	if yOffset > subHeader.originalYPosition
# 		subHeader.y = subHeader.originalYPosition+(yOffset-subHeader.originalYPosition)
# 	else
# 		subHeader.y = subHeader.originalYPosition
		


## View Controller ##
# Views = new ViewController
#     initialView: cruiseDetailT2
header.bringToFront()    
    
    

#Refresh methods for screen change
