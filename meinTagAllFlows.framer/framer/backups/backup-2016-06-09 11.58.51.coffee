# Import file "template_2" (sizes and positions are scaled 1:2)
assets = Framer.Importer.load("imported/template_2@2x")
Utils.globalLayers assets
# Includes

artboardWidth = 375*2
Framer.Device.contentScale = (Screen.width / artboardWidth)

{ƒ,ƒƒ} = require 'findModule'
ViewController = require 'ViewController'


bg = new BackgroundLayer
	backgroundColor: "white"

########### VIEW CONTROLLER ############

Views = new ViewController
    initialView: meinTag
    
#### FOR SCOPING ###
navItems.visible = false
Events_01.visible = false
EatAndDrink_01.visible = false
Bookings_01.visible = false
TodaysDestination_021.y = 0
EatAndDrink_02.visible = false
Bookings_02.visible = false
TodaysDestination_02.y = 0
   
# detail.visible = false
NavData_04.visible = false


############ GLOBAL LISTS / VARS ##################################################

destinationPages = []
details = []
allIndicators = []
todayViews = []
totalPages = 0



###################################################################################
###                                  MEIN TAG                                   ###
###################################################################################
navItems.placeBefore(destinationPager)



for backButton in ƒƒ("bck_*")
	backButton.bringToFront()
	backButton.on Events.TapStart, (layer, event) ->
		Views.back()

############ PHOTO PAGER SETUP #########################
destinationPager = new PageComponent
	size:Screen.size
	scrollVertical: false
	parent: assets.meinTag
destinationPager.sendToBack()
	
blackTint = new Layer
	size: Screen.size
	backgroundColor:"black"
	parent:destinationPager
	opacity:0	

for page in ƒƒ("pg*")
	destinationPager.addPage(page)
	destinationPages.push(page)
	page.visible = true	
totalPages = destinationPages.length	


############ DETAILS SWIPE #########################


# draggable header with constraints
Header.parent = detail
Header.bringToFront()

# set up detail view background
detail.borderRadius = 30
detail.shadowY = -10
detail.shadowColor = "rgba(0,0,0,0.4)"
detail.shadowBlur = 40


# contentListItems
scrollableContent.visible = false
todayContents = new ScrollComponent
	height: Screen.height - 41
	y: 102
	width: 738
	scrollHorizontal: false
	parent: detail
	
todayContents.contentInset = 
	top:96
	bottom:100
todayContents.centerX()

# tempGroup01.onTapEnd -> Views.pushInRight(ExcursionList)


#indicators
allIndicators = []
for indicator in ƒƒ("Indicator*")
	indicator.visible = true
	indicator.opacity = 0
	allIndicators.push(indicator)
	indicator.parent = Header
	indicator.bringToFront()
	# States
	indicator.states.add(active: {opacity: 1})
	indicator.states.animationOptions = time: 0.5

#scroll contents
allScrollContents = []
for scrollItem in ƒƒ("Content*")

	scrollItem.visible = true
	allScrollContents.push(scrollItem)

	
	
# click actions from detail items 
for contentPiece in ƒƒ("EatAndDrink_*")
	if not todayContents.content.isMoving
		contentPiece.on Events.TapEnd, ->
			Views.pushInRight(RestaurantList)
# 
for contentPiece in ƒƒ("Bookings_*")
	contentPiece.on Events.TapEnd, ->
		Views.pushInRight(Schedule)

################ INTERACTIVITY #########################

detailClosedY = Screen.height - Header.height
detailOpenY = 100
detail.draggable = true
detail.draggable.speedX = 0

detail.y = detailClosedY
isOpen = false
startPoint = deltaY = null


	



#### MANAGE INTERNAL SCROLLER ####

todayContents.on Events.Move, ->
	detail.draggable = false

todayContents.on Events.DragAnimationDidEnd, ->
	detail.draggable = true
	detail.draggable.speedX = 0



#### TAP TOGGLE ####

Header.on Events.TapEnd, ->
	toggleOpen()

toggleOpen = () ->
	if isOpen
		animateDetailToClosed()
	else
		animateDetailToOpen()
	
	isOpen = !isOpen

resetContentScroll  = ->
	todayContents.scroll = true
	todayContents.scrollHorizontal = false
	todayContents.contentInset = 
		top:96
		bottom:300
	
	
### DETAIL SCROLL AND MOVE ###
detail.on Events.Move, ->
	blackTint.opacity = Utils.modulate(detail.y, [detailClosedY, detailOpenY], [0, 0.7])
	destinationPager.y = Utils.modulate(detail.y, [detailClosedY, detailOpenY], [0, -100])
	
###### DRAGGING OPEN #########
detail.on Events.TapStart, ->
	detail.draggable = true
	detail.draggable.speedX = 0



detail.on Events.DragStart, (event) ->
	startPoint = Events.touchEvent(event).clientY 

	
	
detail.on Events.DragMove, () ->
	deltaY = Events.touchEvent(event).clientY - startPoint
	scrollSpeed = Utils.modulate(deltaY*-1, [0, 300], [1, 0.1])
	detail.draggable.speedY = scrollSpeed


detail.on Events.DragEnd, () ->
	## if closed, manage deltas to snap back to closed or to jump to open
	if not isOpen
		if deltaY <= -130
			animateDetailToOpen()
		else
			animateDetailToClosed()
	else
		if deltaY >= 100
			animateDetailToClosed()
		else
			animateDetailToOpen()	


### OPEN / CLOSE TOGGLE METHODS ###
animateDetailToClosed = () ->
	destinationPager.scroll = true
	destinationPager.scrollVertical = false
	
	detail.animate
		properties:
			y: detailClosedY
		time: 0.3
		curve: "ease"
		
	blackTint.animate
		properties:
			opacity: 0
			
	destinationPager.animate
		properties:
			y: 0
	
			
animateDetailToOpen = () ->
	detail.draggable = false
	destinationPager.scroll = false
	resetContentScroll()

	detail.animate
		properties:
			y: detailOpenY
		time: 0.3
		curve: "ease"
		
	blackTint.animate
		properties:
			opacity: 0.5
			
	destinationPager.animate
		properties:
			y: -100
	resetContentScroll()


#### SWITCH INDICATORS AND SCROLL CONTENT   ####


	
#track current page in variable
current = destinationPager.horizontalPageIndex(destinationPager.currentPage)

# set up default indicators

allIndicators[current].states.switch("active")
destinationPager.animationOptions = curve: "spring(200,22,0)"

# set up scroll content default
allScrollContents[current].parent = todayContents.content
resetContentScroll()

todayContents.updateContent()

# Update detail stuff on page change
destinationPager.on "change:currentPage", ->
	
	#set all indicators to default (invisible)
	indicator.states.switch("default") for indicator in allIndicators
	
	#unparent content (parent back to hidden scrollable content section)
	contentItem.parent = scrollableContent for contentItem in allScrollContents
# 	contentItem.states.switch("default") for contentItem in allScrollContents
	
	current = destinationPager.horizontalPageIndex(destinationPager.currentPage)
	allIndicators[current].states.switch("active")
	
	#change content item 
	allScrollContents[current].parent = todayContents.content
	resetContentScroll()

	allScrollContents[current].centerX()
	
	todayContents.updateContent()









############################################################
########## EXCURSION LIST                              #####
############################################################

excursionScroll = ScrollComponent.wrap(Excursions)
excursionScroll.scrollHorizontal = false



for item in ƒƒ("Excursion_*")
	item.onTapEnd -> Views.pushInRight(ExcursionDetail)

			
############################################################
########## EXCURSION DETAIL                            #####
############################################################

excursionView = new Layer
	size:Screen.size
	parent:ExcursionDetail
img_excursionHeaderBG.parent = ExcursionDetail
ExcursionContent.parent = excursionView
DetailContent.parent = excursionView

excursionScroll = ScrollComponent.wrap(excursionView)
excursionScroll.scrollHorizontal = false
BookButton.bringToFront()


excursionScroll.on Events.Move, () ->
	imageY = Utils.modulate(excursionScroll.content.y, [0, -667], [0,-300])
	
	imageScale = Utils.modulate(excursionScroll.content.y, [1,100],[1,1.5])
	HeaderBG.y = imageY
	if imageScale > 1
		HeaderBG.scale = imageScale 
	else
		HeaderBG.scale = 1



############################################################
########## RESTAURANT LIST                              #####
############################################################

restaurantScroll = ScrollComponent.wrap(Restaurants)
restaurantScroll.scrollHorizontal = false


for item in ƒƒ("Restaurant_*")
	if not item.isMoving
		item.onTapEnd -> Views.pushInRight(RestaurantDetail)



############################################################
########## RESTAURANT DETAIL                            #####
############################################################
restaurantView = new Layer
	size:Screen.size
	parent:RestaurantDetail
BlueBG.parent = RestaurantDetail
BlueBG.placeBefore(restaurantView)
BlueBG.x = 0
BlackBG.parent = RestaurantDetail
BlackBG.placeBehind(BlueBG)
BlackBG.size = Screen.size
BlackBG.x = 0

restaurantView.placeBehind(bck_RD)

BookButton1.parent = RestaurantDetail
BookButton1.bringToFront()

img_restaurantHeaderBG.parent = RestaurantDetail
RestaurantContent.parent = restaurantView
DetailContent1.parent = restaurantView
BookButton1.states.add(inactive:{visible:false, ignoreEvents:true})
restaurantScroll = ScrollComponent.wrap(restaurantView)
restaurantScroll.scrollHorizontal = false

# 
restaurantScroll.on Events.Move, () ->
	imageY = Utils.modulate(restaurantScroll.content.y, [0, -667], [0,-300])
	
	imageScale = Utils.modulate(restaurantScroll.content.y, [1,100],[1,1.5])
	img_restaurantHeaderBG.y = imageY
	if imageScale > 1
		img_restaurantHeaderBG.scale = imageScale 
	else
		img_restaurantHeaderBG.scale = 1
		

BookButton1.on Events.TapStart, ->
	toggleBookingForm()
	
# booking flow

BookingFlow.bringToFront()
BookingFlow.x = 0
cls_booking.visible = true
bookingProcessForm = new PageComponent
	size:BlueBG.size
	y:BlueBG.y
	x:0
	parent:BookingFlow
	ignoreEvents: false
	scrollVertical: false
	scrollHorizontal: false
 	
for page in ƒƒ("RestBook*")
	page.x = 0
	page.y = 0
	page.visible = true
	bookingProcessForm.addPage(page, "right")




#default size for booking form
bookingIsOpen = false
BookingFlow.opacity=0
BlueBG.size = BookButton1.size
BlueBG.y= BookButton1.y

BlackBG.size = BookButton1.size
BlackBG.y = BookButton1.y
BlackBG.opacity = 0

BookingFlow.visible = false
BookingFlow.ignoreEvents = true


cls_booking.bringToFront()
btn_back.visible = true
btn_cancel.bringToFront()
btn_cancel.states.add(inactive:{opacity:0})
btn_back.bringToFront()
btn_back.states.add(inactive:{opacity:0})
btn_fwd.bringToFront()
btn_fwd.states.add(inactive:{opacity:0})

btn_back.states.switch("inactive")
btn_back.ignoreEvents = true

cls_booking.on Events.TapEnd, () ->
	toggleBookingForm()
	
btn_cancel.on Events.TapEnd, () ->
	toggleBookingForm()
		
btn_back.on Events.TapEnd, () ->
	bookingProcessForm.snapToPreviousPage()
	
btn_fwd.on Events.TapEnd, () ->
	bookingProcessForm.snapToNextPage()

btn_Step5Close.on Events.TapEnd, () ->
	toggleBookingForm()
	
bookingProcessForm.on "change:currentPage", ->
	currentPage = bookingProcessForm.horizontalPageIndex(bookingProcessForm.currentPage)
	
	if currentPage == 0
		btn_back.states.switch("inactive")
		btn_back.ignoreEvents = true
		btn_cancel.states.switch("default")
		btn_cancel.ignoreEvents = false
	else if currentPage == 4
		btn_back.states.switch("inactive")
		btn_back.ignoreEvents = true
		btn_fwd.states.switch("inactive")
		btn_fwd.ignoreEvents = true
	else
		btn_back.states.switch("default")
		btn_back.ignoreEvents = false
		btn_fwd.states.switch("default")
		btn_fwd.ignoreEvents = false
		btn_cancel.states.switch("inactive")
		btn_cancel.ignoreEvents = true

# transition to and from detail view
toggleBookingForm = ->
	if bookingIsOpen
	
		BookingFlow.animate
			properties:
				opacity:0
			time:0.3
			
		BlueBG.animate
			properties:
				size:BookButton1.size
				y:BookButton1.y
			time:0.3
			delay:0.5
		
		BlackBG.animate
			properties:
				size:BookButton1.size
				y:BookButton1.y
				opacity:0
			time:0.3
			delay:0.8
		BookButton1.animate
			properties:
				opacity:1
			time:0.3
			delay:.7
			
		BookingFlow.visible = false
		BookingFlow.ignoreEvents = true
		bookingProcessForm.snapToPage(RestBookStep1)
		
	else
		BookingFlow.visible = true
		BookingFlow.ignoreEvents = false
		BookButton1.animate
			properties:
				opacity:0
			time:0.3
		BlackBG.animate
			properties:
				height:Screen.height
				
				y:0
				opacity:1
			time:0.3
			
		BlueBG.animate
			properties:
				height:1228
				y:104
			time:0.2
		
		BookingFlow.animate
			properties:
				opacity:1
			time:0.3
			delay:.7
		
		
	bookingIsOpen = !bookingIsOpen
	
	
############################################################
########## SCHEDULE                           #####
############################################################

#sketch file cleanup
bck_Schedule.parent = myScheduleHeader

LinesAndSuchHideMe.destroy()
AppointmentListAlle.parent = listAlle
myScheduleHeader.parent = Schedule
myScheduleHeader.bringToFront()
myScheduleHeader.width = Screen.width+4
#set up tabs
eventTabs = []
tabsOn = []
tabsOff = []
activeLabels = []
tabset = new Layer
	parent:myScheduleHeader
	width:Screen.width+4
	height:100
	clip:true
	backgroundColor:"white"
tabset.sendToBack()
tabset.center()
tabset.y = myScheduleHeader.height - tabset.height

# remove active tabs
#rename tabs to "_inactive", place in tabset
for tab in ƒƒ("tab_*")
	y:0
	tab.parent = tabset
	backgroundColor:"yellow"
	tab.name = tab.name + "_inactive"
	tab.height = 100
	tab.width = (Screen.width/3)+2
	tab.borderColor = "#CCCCCC"
	tab.borderWidth = 1
	tab.centerY()
	for label in tab.ƒƒ("*_out")
		label.visible = true
		label.opacity = 1
		label.center()

	tabsOff.push(tab)
	for label in tab.ƒƒ("*_on")
		label.visible = true
		label.opacity = 1
		activeLabels.push(label)
	
for label in activeLabels
	btn = new Layer
		backgroundColor:"#CAD8E3"
		height: 100
		width: (Screen.width/3)+2
		parent:tabset
		name: "tab_" + label.name + "_active"
	label.parent = btn
	label.center()
	btn.opacity = 0
	tabsOn.push(btn)
	
for i in [0...activeLabels.length]
	tabsOff[i].x = tabsOff[i].width * i
	tabsOn[i].x = tabsOn[i].width*i
	tabsOn[i].states.add(active:{opacity:1})


	


# set up tabs and scroll areas as pages
eventPages = []
eventPages.push(listHeute = new ScrollComponent)
eventPages.push(listAlle = new ScrollComponent)
# eventPages.push(listVergangen = new ScrollComponent)
allPages = new PageComponent
	size:Screen.size
	scrollVertical: false
	parent:Schedule
	directionLock: true
	backgroundColor:"white"
		
for page in eventPages
	page.size = Screen.size
	page.scrollHorizontal = false

	page.insets = 
		top:100
		bottom:40
	directionLock: true
	
	allPages.addPage(page, "right")
AppointmentListAlle.parent = listAlle.content
AppointmentListHeute.parent = listHeute.content
allPages.sendToBack()



# handle scrolling conflicts
for button in ƒƒ("tab_alle*")
	button.onTapEnd ->
		allPages.snapToPage(listAlle)
for button in ƒƒ("tab_heute*")
	button.onTapEnd ->
		allPages.snapToPage(listHeute)

		

currentTab = allPages.horizontalPageIndex(allPages.currentPage)
tabsOn[currentTab].states.switchInstant("active")
allPages.on "change:currentPage", ->
	tabsOn[currentTab].states.switch("default") for tab in tabsOn
	currentTab = allPages.horizontalPageIndex(allPages.currentPage)
	tabsOn[currentTab].states.switch("active")
	
