#imports
itineraryData = require "itinerary" ## module with object containing itineraryInfo
{TextLayer} = require 'TextLayer'

# global variables (@2x)
gutter = 40
avatarSize = 72


###################################################################
#########        ITINERARY VIEW                        ############
###################################################################

#base view
exports.itineraryView = new Layer
	height:Screen.height
	width:Screen.width
	name:"Itinerary"
	backgroundColor: "purple"

# pager
exports.itineraryPager = new PageComponent
	size:Screen.size
	backgroundColor:"#EEEEEE"
	name:"itineraryPager"
	scrollVertical: false
	parent: @itineraryView


#build itinerary pages

for item in itineraryData.itinerary


	# add page with image for each node in itinerary data
	exports.itinView = new Layer
			width:Screen.width
			height:Screen.height
			image:item.image
			name: "itinPage_" + item.day

			# dim image with gradient
	gradientLayer = new Layer
			size:@itineraryView.size
			parent:@itinView
			name:"tint"
	gradientLayer.style.background = "-webkit-linear-gradient(top, rgba(0,0,0,.2) 0%,rgba(0,0,0,.35) 85%,rgba(0,0,0,0.65) 100%)"


# add contents - build from bottom to top

#destination article, times, destionation name, day name

	exports.destinationArticle = new Layer
		size:{width:Screen.width, height:160}
		y:Align.bottom
		name:"articleGroup"
		backgroundColor:"transparent"
		parent:@itinView

	exports.destArticleAuthor = new Layer
		height:avatarSize
		width:avatarSize
		borderRadius:avatarSize
		name:"articleAuthor"
		parent:@destinationArticle
		y:Align.center
		x:Align.left(gutter)

	exports.disclosureIndicator = new Layer
		image:"images/icn-more@2x.png"
		backgroundColor: "transparent"
		height:40
		width:26
		name:">"
		parent:@destinationArticle
		color:"white"
		x:Align.right(-1*gutter)
		y:Align.center

	exports.destArticleSep  = new Layer
		width:680
		height:4
		x:Align.left(gutter)
		name:"-----"
		image:"images/sep-dot.svg"
		parent:@destinationArticle

	exports.destinationArticleHeading = new TextLayer
		text:"Destination article header"
		fontSize:28
		autoSize:true
		fontFamily:"Frutiger LT Pro"
		color:"#bcbab6"
		name:"destArticleHeader"
		textTransform: "uppercase"
		parent:@destinationArticle
		x:Align.left(@destArticleAuthor.maxX + 20)
		y:@destArticleAuthor.y + 4

	exports.destArticleAuthorByline = new TextLayer
		text:"Destination Article Author"
		fontSize:24
		autoSize:true
		name:"Byline"
		fontFamily:"Frutiger LT Pro"
		color:"#7c7c7c"
		textTransform: "capitalize"
		parent:@destinationArticle
		x:Align.left(@destArticleAuthor.maxX + 20)
		y:@destinationArticleHeading.maxY

# 	#add views for each time in data, add to an array
	exports.timesGroup = new Layer
		parent:@itinView
		x:Align.left
		name:"itineraryTimesGroup"
		width:Screen.width
		backgroundColor:"transparent"

# iterate through times array, create bullets for each time (travel data)
	currentMaxY = 0
	totalHeight = 0

	for time, i in item.travelData

		exports.entryGroup = new Layer
			parent:@timesGroup
			x:Align.left(40)
			name:"timeEntryGroup"
			width:Screen.width - 240
			backgroundColor:"transparent"

		exports.timeEntryBullet = new Layer
			image:"images/gr-arrow-callout@2x.png"
			x:0
			name:"--->"
			width:52
			height:16
			parent:@entryGroup
			backgroundColor:"transparent"

		exports.timeEntryText = new TextLayer
				text:time
				name:time
				x:@timeEntryBullet.maxX + 8
				width:Screen.width - 280
				autoSizeHeight:true
				fontSize:32
				fontWeight:200
				fontFamily:"Frutiger LT Pro"
				color:"white"
				parent:@entryGroup

		@entryGroup.height = @timeEntryText.height
		@entryGroup.y = currentMaxY
		currentMaxY = @entryGroup.maxY + 8
		totalHeight = currentMaxY
		@timeEntryBullet.y = @timeEntryText.y + 8
		@timesGroup.height = totalHeight
		@timesGroup.maxY = @destinationArticle.y - 20

	exports.destinationTitle = new TextLayer
		text: item.destinationName
		name:item.destinationName
		parent:@itinView
		width:Screen.width - 100
		x:Align.left(30)
		autoSizeHeight:true
		fontSize:92
		lineHeight:1
		fontWeight:700
		letterSpacing:-3
		textTransform:"uppercase"
		fontFamily:"Frutiger LT Pro"
		color:"white"
	@destinationTitle.maxY = @timesGroup.y

	exports.dayTitle = new TextLayer
		text: item.day
		parent:@itinView
		width:Screen.width - 100
		x:Align.left(30)
		autoSizeHeight:true
		fontSize:36
		lineHeight:1
		fontWeight:300
		fontFamily:"Frutiger LT Pro"
		color:"white"
	@dayTitle.maxY = @destinationTitle.y + -16
	@itineraryPager.addPage(@itinView, "right")

	# main actions
exports.mainActions = new Layer
	width:100
	height:700
	y:55
	x:Align.right(-1* gutter)
	parent:@itineraryView
	backgroundColor: "transparent"
	name:"mainActions"

@mainActions.states.add
	orange:
		backgroundColor: "orange"

exports.btn_profile = new Layer
	parent:@mainActions
	backgroundColor: "transparent"
	image:"images/icn-profile-copy@2x.png"
	width:@mainActions.width
	height: @mainActions.width
	name:"btn_profile"


exports.btn_chat = new Layer
	parent:@mainActions
	backgroundColor: "transparent"
	image:"images/icn-chat.svg"
	width:@mainActions.width
	height: @mainActions.width
	y: @btn_profile.maxY + 28
	name:"btn_chat"

exports.btn_restaurant = new Layer
	parent:@mainActions
	backgroundColor: "transparent"
	image:"images/icn-restaurant-copy@2x.png"
	width:@mainActions.width
	height: @mainActions.width
	y: @btn_chat.maxY + 28
	name:"btn_restaurant"

exports.btn_reservations = new Layer
	parent:@mainActions
	backgroundColor: "transparent"
	image:"images/icn-reservations-copy@2x.png"
	width:@mainActions.width
	height: @mainActions.width
	y: @btn_restaurant.maxY + 28
	name:"btn_reservations"

# btn_profile.on Events.Click, ->
# 	mainActions.states.next()
