{Firebase} = require 'firebase'

# The required information is located at https://firebase.google.com → Console → YourProject → ...
dataStore = new Firebase
	projectID: "projectoneproto" # ... Database → first part of URL
	secret: "YO9hSVqz9u0e08CHlgCiDsr3BAdDgtT65LAe0Hs0" # ... Project Settings → Database → Database Secrets
	server: "s-usc1c-nss-131.firebaseio.com" # Get this info by setting `server: undefined´ first

### FIREBASE DATA ###
print dataStore.status
dataStore.debug = true

availableRestaurants = []
listItems = []

listScroll = new ScrollComponent
	size:Screen.size
	scrollHorizontal: false
	
  
# Simple 2, expecting dataset
dataStore.get "/restaurants", (restaurants) ->
	if restaurants?
	
		availableRestaurants = _.toArray(restaurants) # converts JSON to array
		for i in [0...availableRestaurants.length]
			listItem = new Layer
				backgroundColor: Utils.randomColor()
				width:Screen.width
				height:Screen.height / 4
				y: Screen.height / 4 * i
				html: "#{availableRestaurants[i].location}"
				style:
					fontFamily: "Helvetica Neue"
					fontSize: "120px"
					lineHeight:"#{Screen.height/4}px" 
					fontWeight: "100"
					textAlign: "center"
					color:"white" 
				name: "restaurant_0" + i
				parent:listScroll.content
				

#     print "#{availableRestaurants[i].name}"
    		
#     	restaurant = new Layer
#  			name: "restaurant_" + i
#  			
#  			backgroundColor: Utils.randomColor
#  			height: Screen.height / 4
#  			width: Screen.width
# 
 		
    		
    	
#  	for i in [0...availableRestaurants.length]
#  		print availableRestaurants[i].restName
#  		restaurant = availableRestaurants[i] = new Layer
#  			backgroundColor: Utils.randomColor
#  			height: Screen.height / 4
#  			width: Screen.width
#  			name: "restaurant#{i}"


#     print restaurantsArray.length
#     print restaurant.restName for restaurant in restaurantsArray  
    
	
# Simple 1, expecting single value
# firebase.get "/value", (value) ->
#     print value
# 
# # Simple 2, expecting dataset
# firebase.get "/names", (names) ->
#     namesArray = _.toArray(names) # converts JSON to array
#     print name for name in names
# 
# # Advanced
# response = (names) ->
#     namesArray = _.toArray(names)
#     print name for name in names
# 
# firebase.get("/names",response,{orderBy: "$key", limitToFirst: 5})