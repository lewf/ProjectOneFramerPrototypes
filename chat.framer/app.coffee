{ƒ,ƒƒ} = require 'findModule'
{TextLayer} = require 'TextLayer'
ViewController = require 'ViewController'
userData = require "users" ## module with object containing users
###################################################################
#########          ALL VIEWS AND VIEW CONTROLLER       ############
###################################################################

### Chat list view (now chatting) ###
chatView = new Layer
	width:Screen.width
	height:Screen.height
	backgroundColor: "lightgrey"
	parent:Views
# 
# ### Add to chat view ###
addToChat = new Layer
	width:Screen.width
	height:Screen.height
	backgroundColor: "lightgrey"
	parent:Views
# 	
# ### Conversation View ###
conversationView = new Layer
	height:Screen.height
	width:Screen.width
	backgroundColor: "pink"
	parent:Views
	

itinerarySource = require 'itineraryView'
itineraryView = itinerarySource.itineraryView
itineraryView.parent = Views


restaurantView = new Layer
	height:Screen.height
	width:Screen.width
	backgroundColor: "green"
	parent:Views	

reservationsView = new Layer
	height:Screen.height
	width:Screen.width
	backgroundColor: "purple"
	parent:Views	

	
## View Controller Defaults ##
Views = new ViewController
	initialView: itineraryView

## GLOBAL VARIABLES
rowHeight = 200
avatarSize = 140
rowSpacer = 10
elementPadding = 40
rowStyle = "font-size":"48px", "font-weight":"300", "color":"#333", "lineHeight":"#{rowHeight}px", "box-shadow":"0 1px 6px rgba(0,0,0,0.2)"
headerHeight = 120

activeUsers = userData.users

# print userData.users
friendUsers = []
rowCountActive = activeUsers.length
rowCountFriended = friendUsers.length




## TESTS
# print "currently chatting data: " + currentlyChatting
# print "available to chat data: " + availableToChat






############
#  EXPERIMENT WITH HTML STYLING
############

# layer with html defined, variables referenced internally
# for item in itineraryData.itinerary
# 
# 	destinationTitleLayer = new Layer
# 		html:"<div class='destinationStyles'><h2>#{item.day}</h2></br><h1>#{item.destinationName}</h1></div>"
# 		y:Align.bottom()
# 		width:Screen.width
# 		parent:itinView
# 		
# Utils.insertCSS "
# 	.destinationStyles {
# 		color:#FFFFFF;
# 		font-family: FrutigerLTPro-Roman;
# 	}
# 	.destinationStyles h1	{
# 		font-size:120px;
# 		text-transform: uppercase;
# 		line-height:60px;
# 
# 	}
# 	.destinationStyles h2 {
# 		font-size:36px;
# 		line-height:50px;
# 		font-weight:100;
# 		padding-left:10px 
# 	}
# 	.destinationStyles ul {
# 		
# 	}
# 	.destinationStyles li {
# 		
# 	}
# "


## NAVIGATION ACTIONS
## main menu on itinerary page

itinerarySource.btn_profile.on Events.TapEnd, ->
	print "profile navigation"
# 	Views.moveInRight(chatView)

itinerarySource.btn_chat.on Events.TapEnd, ->
	print "chat view navigation"
# 	Views.moveInRight(chatView)

itinerarySource.btn_restaurant.on Events.Click, ->
	print "restaurant navigation"
# 	Views.moveInRight(restaurantView)

itinerarySource.btn_reservations.on Events.Click, ->
	print "reservations navigation"
# 	Views.moveInRight(reservationsView)









		



	
	
			
	


## LIST ITEM BUILDER  - buildLIstItem = (forItem, listParent, hasDisclosure) ###

buildListItem  = (forItem, listParent, hasDisclosure) ->

	if forItem
			row = new Layer
				width:Screen.width
				height:rowHeight
				y: (rowHeight + rowSpacer) * i
				backgroundColor: "white"
				style:rowStyle
				name: "row_" + forItem.userName
				parent: listParent.content
			
			userAvatar = new Layer
				height:avatarSize
				width: avatarSize
				parent:row
				x:20
				y:Align.center
				borderRadius: rowHeight
				borderWidth:8
				borderColor: "#DEDEDE"
				image: forItem.profileImage
				
			activeIndicator = new Layer
				width:40
				height:40
				parent:row
				backgroundColor:"lightgreen"
				borderRadius: 40
				x:userAvatar.width
				y:userAvatar.height
				visible:forItem.isOnline
				
			userName = new TextLayer # needs module included
				text: forItem.userName
				parent:row
				fontFamily:"Frutiger LT Pro"
				color:"#111"
				fontSize: 42
				fontWeight:400
				autoSize:true
				x: rowHeight + elementPadding
				y: Align.center
				
			userSubtitle = new TextLayer
				text: forItem.userHandle
				parent:row
				fontFamily:"Frutiger LT Pro"
				color:"#A1A1A1"
				fontSize: 36
				fontWeight:200
				autoSize:true
				x: userName.x
				y: userName.y + userName.height
				
			crewLabel = new TextLayer
				text: "Crew"
				parent:row
				visible: forItem.isCrew
				fontFamily:"Frutiger LT Pro"
				color:"blue"
				fontSize: 24
				textTransform: "uppercase"
				fontWeight:400
				autoSize:true
				x: userName.x
				y: userName.y - 30
				
			if hasDisclosure
				disclosureIndicator = new TextLayer
					text: ">"
					parent:row
					fontFamily:"Frutiger LT Pro"
					color:"#A1A1A1"
					fontSize: 36
					fontWeight:200
					autoSize:true
					x: Screen.width - 60
					y: Align.center
					
# 			print "item processed: " + forItem.userName


###################################################################
#########        FRIENDS LIST VIEW                     ############
###################################################################

# Header ##
friendsListHeader = new Layer
	width:Screen.width
	height:Screen.height / 10
	backgroundColor: "white"
	parent:addToChat
# 	
# Chat Scrolling List ##
friendsList = new ScrollComponent
	height:Screen.height
	width:Screen.width
	backgroundColor: "#EEE"
	parent:addToChat
	scrollHorizontal: false
	contentInset: 
		top:friendsListHeader.height + rowSpacer
		bottom:rowSpacer
friendsList.sendToBack()
# 
# Header subviews
btn_back = new Layer
	width: 100
	height: 100
	html: "back"
	x:Align.left
	y:Align.center
	backgroundColor:"transparent"
	parent: addToChat
	style:
		fontFamily: "Helvetica Neue"
		marginLeft:"20px"
		fontSize: "36px"
		lineHeight:"100px" 
		fontWeight: "300"
		textAlign: "center"
		color:"grey" 
		
btn_back.on Events.TapEnd, -> 
	Views.back()		

btn_add = new Layer
	width: 100
	height: 100
	html: "+"
	x:Align.right
	y:Align.center
	parent: friendsListHeader
	backgroundColor:"transparent"
	style:
		fontFamily: "Helvetica Neue"
		marginRight:"20px"
		fontSize: "72px"
		lineHeight:"100px" 
		fontWeight: "200"
		textAlign: "center"
		color:"grey" 

btn_add.on Events.TapEnd, () ->
	Views.slideInUp(addToChat)


chatListViewTitle = new Layer
	width:500
	height:100
	x:Align.center
	y:Align.center
	backgroundColor:"transparent"
	html:"Meine Kontakte"
	style:
		fontFamily: "Helvetica Neue"
		fontSize: "36px"
		lineHeight:"100px" 
		fontWeight: "300"
		textAlign: "center"
		color:"black" 
	parent: friendsListHeader
	
for row in friendsList.content.children
	row.on Events.TapEnd, () ->
		print "hello, I'm tapped"
# 
# 


###################################################
##     ADD ACTIVE USER TO CHAT               ######
###################################################
#Create header box
# addToChat_Header = new Layer
# 	width:Screen.width
# 	height:Screen.height / 10
# 	backgroundColor: "white"
# 	parent:chatView
# 	
# Create list
# activeUsersList = new ScrollComponent
# 	size:Screen.size
# 	backgroundColor: "#EEE"
# 	parent:addToChat
# 	scrollHorizontal: false
# 	contentInset:
# 		top: addToChat_Header.height + rowSpacer
# activeUsersList.sendToBack()
# 
# construct initial list based on data
# for i in [0...rowCountActive]
# 	buildListItem(activeUsers[i], activeUsersList, false)
# 	
# 
# 
# header subviews
# addToChatListTitle = new Layer
# 	width:200
# 	height:100
# 	x:Align.center
# 	y:Align.center
# 	backgroundColor:"transparent"
# 	html:"All users"
# 	style:
# 		fontFamily: "Helvetica Neue"
# 		fontSize: "36px"
# 		lineHeight:"100px" 
# 		fontWeight: "300"
# 		textAlign: "center"
# 		color:"black" 
# 	parent:addToChat_Header
# 	
# 	
# btn_cancel = new Layer
# 	width: 100
# 	height: 100
# 	html: "cancel"
# 	x:Align.left
# 	y:Align.center
# 	backgroundColor:"transparent"
# 	parent:addToChat_Header
# 	style:
# 		fontFamily: "Helvetica Neue"
# 		marginLeft:"20px"
# 		fontSize: "36px"
# 		lineHeight:"100px" 
# 		fontWeight: "300"
# 		textAlign: "center"
# 		color:"grey" 
# btn_cancel.on Events.TapEnd, () ->
# 	Views.back()
# 	
# Add to friends list
# for row in activeUsersList.content.children
# 	row.on Events.TapEnd, () ->
# 		selectedIndex = this.index-1 # children report index starting with 1, not 0
# 		selectedItem = activeUsers[selectedIndex]
# 							
# 		if selectedItem not in friendUsers
# 				clearList(friendsList)
# 			for item in friendsList.content.children
# 				item.destroy()		
# 
# 			friendUsers.push(selectedItem)
# 			print "Adding " + selectedItem.userName
# 			print "Here's the new array :" + friendUsers
# 			print "here's the count of the new array:" + friendUsers.length
# 			
# 
# 				
# 			for i in [0...friendUsers.length]
# 				buildListItem(friendUsers[i], friendsList, true)
# 				friendsList.updateContent()
# 
# 
# 		Views.back()
# 			
			
			

			


		







###################################################################
#########        CHAT VIEW              ############
###################################################################



conversationHeader = new Layer
	width:Screen.width
	height:Screen.height / 10
	backgroundColor: "white"
	parent:conversationView
	
# Chat Scrolling List ##
conversationList = new ScrollComponent
	height:Screen.height
	width:Screen.width
	backgroundColor: "white"
	parent:conversationView
	scrollHorizontal: false
	contentInset: 
# 		top:myChat_Header.height + spacingUnit
		bottom:spacingUnit
conversationList.sendToBack()



## Header subviews
btn_ConversationBack = new Layer
	width: 100
	height: 100
	html: "back"
	x:Align.left
	y:Align.center
	backgroundColor:"transparent"
	parent:conversationHeader
	style:
		fontFamily: "Helvetica Neue"
		marginLeft:"20px"
		fontSize: "36px"
		lineHeight:"100px" 
		fontWeight: "300"
		textAlign: "center"
		color:"grey" 
		


btn_ConversationBack.onTap ->
	Views.back()


conversationViewHeaderTitle = new Layer
	width:200
	height:100
	x:Align.center
	y:Align.center
	backgroundColor:"transparent"
	html:"Chat"
	style:
		fontFamily: "Helvetica Neue"
		fontSize: "36px"
		lineHeight:"100px" 
		fontWeight: "300"
		textAlign: "center"
		color:"black" 
	parent:conversationHeader
