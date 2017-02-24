class exports.Navigation extends Layer

	constructor: (@options = {}) ->



	super @options


  topNav = new Layer
    height:90
    backgroundColor:"grey"


  navBar = new Layer
    backgroundColor:"white"
    height:90
    width:Screen.width
    y:Align.top(topNav.maxY)
