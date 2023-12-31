/*
	Blackjack 21
	A simple game developed using Javascript, HTML and CSS

	@author Stayko Chalakov
	@version 1.0
	@date 29.06.2017
*/

//namespacing
var BlackjackJS = (function() {

	/**************
		Card class
	***************/

	/*
		Constructor
		@param {String} rank
		@param {String} suit
	*/
	function Card(rank, suit){
		this.rank = rank;
	  this.suit = suit;
	}

	/*
		Gets the value or points of the card
		@param {Integer} currentTotal - The current total score of the
		player's hand
	*/
	Card.prototype.getValue = function(){
		var value = 0;

		if (this.rank == 'A'){
				value = 14;
		} else if (this.rank == 'K'){
				value = 13;
		} else if (this.rank == 'Q'){
			value = 12;
		} else if (this.rank == 'J'){
			value = 11;
		} else {
			value = parseInt(this.rank);
		}
		return value;
	}
	Card.prototype.getSuit = function(){
		if(this.suit == "hearts"){
			value = "heart";
		}
		else if (this.suit == 'diamonds'){
			value = "diamonds";
		}
		else if (this.suit == 'clubs'){
			value ="clubs";
		}
		else if (this.suit == "spades"){
			value ="spades";
		}
		return value;
	}
		
	/*******************
		Renders the card
	*******************/
	Card.prototype.view = function(){
		var htmlEntities = {
			'hearts' : '&#9829;',
			'diamonds' : '&#9830;',
			'clubs' : '&#9827;',
			'spades' : '&#9824;'
		}
		return `
			<div class="card ` + this.suit + `">
				<div class="top rank">` + this.rank + `</div>
				<div class="suit">` + htmlEntities[this.suit] + `</div>
				<div class="bottom rank">` + this.rank + `</div>
			</div>
		`;
	}

	/*************************** End of Card class ********************************/

	/***************
		Player class
	***************/

	/*
		Constructor
		@param {String} element - The DOM element
		@param {Array} hand - the array which holds all the cards
	*/
	function Player(element, hand){
		this.hand = hand;
		this.element = element;
	}
	Player.prototype.getHand = function(){
		dictionary = {};
		for(var i = 0; i< this.hand.length; i++){
			dictionary[i]= {Rank: this.hand[i].getValue(i), suit: this.hand[i].getSuit(i) }
		}
		return dictionary ;
	}
	/*
		Hit player with new card from the deck
		@param {Card} card - the card to deal to the player
	*/
	Player.prototype.hit = function(card){
		this.hand.push(card);
	}

	/*
		Returns the total score of all the cards in the hand of a player
	*/
	Player.prototype.getScore = function(){
		var points = 0;
		for(var i = 0; i < this.hand.length; i++){
			if(i == 0) points = this.hand[i].getValue(0);
			else points += this.hand[i].getValue(points);
		}
		return points;
	}

	/*
		Returns the array (hand) of cards
	*/
	Player.prototype.showHand = function(){
		var hand = "";
		for(var i = 0; i < this.hand.length; i++){
			 hand += this.hand[i].view();
		}
		return hand;
	}

	/*************************** End of Player class ******************************/

		/***************
		Dealer class
	***************/

	/*
		Constructor
		@param {String} element - The DOM element
		@param {Array} hand - the array which holds all the cards
	*/
	function Dealer(element, hand){
		this.hand = hand;
		this.element = element;
	}

	/*
		Hit player with new card from the deck
		@param {Card} card - the card to deal to the player
	*/
	
	Dealer.prototype.hit = function(card){
	this.hand.push(card);
	}

	Dealer.prototype.getScore = function(){
		var points = 0;
		for(var i = 0; i < this.hand.length; i++){
			if(i == 0) points = this.hand[i].getValue(0);
			else points += this.hand[i].getValue(points);
		}
		return points;
	}

	Dealer.prototype.getHandLength = function(){
		value = this.hand.length;
		return value;
	}

	Dealer.prototype.getHand = function(){
		dictionary = {};
		for(var i = 0; i< this.hand.length; i++){
			dictionary[2+i]= {Rank: this.hand[i].getValue(i), suit: this.hand[i].getSuit(i) }
		}
		return dictionary ;
	}

	/*
		Returns the array (hand) of cards
	*/
	Dealer.prototype.showHand = function(){
		var hand = "";
		for(var i = 0; i < this.hand.length; i++){
			 hand += this.hand[i].view();
		}
		return hand;
	}

	/*************************** End of Dealer class ******************************/

	/*************************
		Deck - Singleton class
	*************************/
	var Deck = new function(){
		this.ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
		this.suits = ['hearts', 'spades', 'diamonds','clubs'];
	  this.deck;
		
		/*
			Fills up the deck array with cards
		*/
		this.init = function(){
			this.deck = []; //empty the array
			for(var s = 3; s >= 0; s--){
		  	for(var r = 12; r >= 0; r--){
		    	this.deck.push(new Card(this.ranks[r], this.suits[s]));
		    }
		  }
		}

		/*
			Shuffles the cards in the deck randomly
		*/
		this.shuffle = function(){
			 var j, x, i;
			 for (i = this.deck.length; i; i--) {
					 j = Math.floor(Math.random() * i);
					 x = this.deck[i - 1];
					 this.deck[i - 1] = this.deck[j];
					 this.deck[j] = x;
			 }
		}

		this.ajouter = function(hand){
			for(i = 0; i < hand.length; i++)
			{
				this.deck.push(new Card(hand[i].rank, hand[i].suit));
			}
		}

	}

	/**************************** End of Deck class *******************************/

	/*************************
		Game - Singleton class
	**************************/

	var Game = new function(){

		/*
			Deal button event handler
		*/
		this.dealButtonHandler = function(){
			Game.start();
			this.dealButton.disabled = true;
			this.hitButton.disabled = false;
			this.standButton.disabled = false;
			this.valider();
		}

		/*
			Hit button event handler
		*/
		this.hitButtonHandler = function(){
			//deal a card and add to Dealer's hand
			if(this.dealer.getHandLength() < 5){
			var card = Deck.deck.pop();
			this.dealer.hit(card);
			//render the card
			document.getElementById(this.dealer.element).innerHTML += card.view();
			}
			this.valider();
			
			
			
			
		}
	
		/*
			Stand button event handler
		*/
		this.standButtonHandler = function(){
			this.hitButton.disabled = true;
			this.standButton.disabled = true;

			//deals a card to the dealer until
			//one of the conditions below is true
			while(true){
				
				if(this.dealer.getHandLength() < 5){
					var card = Deck.deck.pop();
					this.dealer.hit(card);
					document.getElementById(this.dealer.element).innerHTML += card.view();
				}
				if(this.dealer.getHandLength() == 5){
					this.gameEnded("défaite")
					break
				}
				
			}
		}
		/*
			Initialise
		*/
		this.init = function(){
			this.dealButton = document.getElementById('deal');
			this.hitButton = document.getElementById('hit');
			this.standButton = document.getElementById('stand');

			//attaching event handlers
			this.dealButton.addEventListener('click', this.dealButtonHandler.bind(this));
			this.hitButton.addEventListener('click', this.hitButtonHandler.bind(this));
			this.standButton.addEventListener('click', this.standButtonHandler.bind(this));

		}

		/*
			Start the game
		*/
		this.start = function(){

			//initilaise and shuffle the deck of cards
			Deck.init();
			Deck.shuffle();

			//deal one card to dealer
			this.dealer = new Dealer('dealer', [Deck.deck.pop(),Deck.deck.pop(),Deck.deck.pop()]);

			//deal two cards to player
			this.player = new Player('player', [Deck.deck.pop(), Deck.deck.pop()]);
			//donne les carte au bot
			this.bot = new Player("bot",[Deck.deck.pop(), Deck.deck.pop()]);

			//render the cards
			document.getElementById(this.dealer.element).innerHTML = this.dealer.showHand();
			document.getElementById(this.player.element).innerHTML = this.player.showHand();
			document.getElementById(this.bot.element).innerHTML = "";

			//renders the current scores
			this.setMessage("Hit or Stand");
		}

		/*
			If the player wins or looses
		*/
		this.gameEnded = function(str){
			this.setMessage(str);
			this.dealButton.disabled = false;
			this.hitButton.disabled = true;
			this.standButton.disabled = true;

		}

		this.valider = function(){
			playerHand = this.player.getHand()
			dealerHand = this.dealer.getHand()
			botHand = this.bot.getHand()
			playerHand = {...dealerHand,...playerHand}
			botHand = {...dealerHand,...botHand}
			
			var mainJoueur = Array();
			var win = 0
			
			for(var i = 0; i < Object.keys(playerHand).length; i++ )
				{
				if (playerHand[i].Rank ==12 )
				{
					mainJoueur.push("Q" + playerHand[i].suit.charAt(0));
				}
				if (playerHand[i].Rank ==11 )
				{
					mainJoueur.push("J" + playerHand[i].suit.charAt(0));
				}
				if (playerHand[i].Rank ==13 )
				{
					mainJoueur.push("K" + playerHand[i].suit.charAt(0));
				}
				if (playerHand[i].Rank == 14 )
				{
					mainJoueur.push("A" + playerHand[i].suit.charAt(0));
				}
				if (playerHand[i].Rank ==10 )
				{
					mainJoueur.push("T" + playerHand[i].suit.charAt(0));
				}
				if (playerHand[i].Rank ==9 )
				{
					mainJoueur.push(playerHand[i].Rank + playerHand[i].suit.charAt(0));
				}
				if (playerHand[i].Rank ==8 )
				{
					mainJoueur.push(playerHand[i].Rank + playerHand[i].suit.charAt(0));
				}
				if (playerHand[i].Rank ==7 )
				{
					mainJoueur.push(playerHand[i].Rank + playerHand[i].suit.charAt(0));
				}
				if (playerHand[i].Rank ==6 )
				{
					mainJoueur.push(playerHand[i].Rank + playerHand[i].suit.charAt(0));
				}
				if (playerHand[i].Rank ==5 )
				{
					mainJoueur.push(playerHand[i].Rank + playerHand[i].suit.charAt(0));
				}
				if (playerHand[i].Rank ==4 )
				{
					mainJoueur.push(playerHand[i].Rank + playerHand[i].suit.charAt(0));
				}
				if (playerHand[i].Rank ==3 )
				{
					mainJoueur.push(playerHand[i].Rank + playerHand[i].suit.charAt(0));
				}
				if (playerHand[i].Rank ==2 )
				{
					mainJoueur.push(playerHand[i].Rank + playerHand[i].suit.charAt(0));
				}
				}
			
			for(t = 0; t < 999; t++)
			{
				this.mainStat = new Player("mainStat",[Deck.deck.pop(), Deck.deck.pop()]);
				statHand = this.mainStat.getHand()
				statHand = {...dealerHand,...statHand}
				
				
				
			var mainStatValider = Array();
			for(var i = 0; i < Object.keys(statHand).length; i++ )
			{
				if (statHand[i].Rank ==12 )
				{
					mainStatValider.push("Q" + statHand[i].suit.charAt(0));
				}
				if (statHand[i].Rank ==11 )
				{
					mainStatValider.push("J" + statHand[i].suit.charAt(0));
				}
				if (statHand[i].Rank ==13 )
				{
					mainStatValider.push("K" + statHand[i].suit.charAt(0));
				}
				if (statHand[i].Rank == 14 )
				{
					mainStatValider.push("A" + statHand[i].suit.charAt(0));
				}
				if (statHand[i].Rank ==10 )
				{
					mainStatValider.push("T" + statHand[i].suit.charAt(0));
				}
				if (statHand[i].Rank ==9 )
				{
					mainStatValider.push(statHand[i].Rank + statHand[i].suit.charAt(0));
				}
				if (statHand[i].Rank ==8 )
				{
					mainStatValider.push(statHand[i].Rank + statHand[i].suit.charAt(0));
				}
				if (statHand[i].Rank ==7 )
				{
					mainStatValider.push(statHand[i].Rank + statHand[i].suit.charAt(0));
				}
				if (statHand[i].Rank ==6 )
				{
					mainStatValider.push(statHand[i].Rank + statHand[i].suit.charAt(0));
				}
				if (statHand[i].Rank ==5 )
				{
					mainStatValider.push(statHand[i].Rank + statHand[i].suit.charAt(0));
				}
				if (statHand[i].Rank ==4 )
				{
					mainStatValider.push(statHand[i].Rank + statHand[i].suit.charAt(0));
				}
				if (statHand[i].Rank ==3 )
				{
					mainStatValider.push(statHand[i].Rank + statHand[i].suit.charAt(0));
				}
				if (statHand[i].Rank ==2 )
				{
					mainStatValider.push(statHand[i].Rank + statHand[i].suit.charAt(0));
				}
			}
				var MJ = Hand.solve(mainJoueur)
				var MS = Hand.solve(mainStatValider)
				var winner = Hand.winners([MJ,MS])
					if (winner.toString() == MJ.toString())
					{
						win ++
					}
					else
					{
						
					}
				Deck.ajouter(this.mainStat.hand)
				Deck.shuffle();
			}
			win = win/10
			document.getElementById('win-prob').innerHTML = win+" %";
			if(win > 50)
			{
				document.getElementById('action-prob').innerHTML = "hit";
			}
			else
			{
				document.getElementById('action-prob').innerHTML = "stand";
			}
		
			var mainBotValider = Array();
			for(var i = 0; i < Object.keys(botHand).length; i++ )
			{
				if (botHand[i].Rank ==12 )
				{
					mainBotValider.push("Q" + botHand[i].suit.charAt(0));
				}
				if (botHand[i].Rank ==11 )
				{
					mainBotValider.push("J" + botHand[i].suit.charAt(0));
				}
				if (botHand[i].Rank ==13 )
				{
					mainBotValider.push("K" + botHand[i].suit.charAt(0));
				}
				if (botHand[i].Rank == 14 )
				{
					mainBotValider.push("A" + botHand[i].suit.charAt(0));
				}
				if (botHand[i].Rank ==10 )
				{
					mainBotValider.push("T" + botHand[i].suit.charAt(0));
				}
				if (botHand[i].Rank ==9 )
				{
					mainBotValider.push(botHand[i].Rank + botHand[i].suit.charAt(0));
				}
				if (botHand[i].Rank ==8 )
				{
					mainBotValider.push(botHand[i].Rank + botHand[i].suit.charAt(0));
				}
				if (botHand[i].Rank ==7 )
				{
					mainBotValider.push(botHand[i].Rank + botHand[i].suit.charAt(0));
				}
				if (botHand[i].Rank ==6 )
				{
					mainBotValider.push(botHand[i].Rank + botHand[i].suit.charAt(0));
				}
				if (botHand[i].Rank ==5 )
				{
					mainBotValider.push(botHand[i].Rank + botHand[i].suit.charAt(0));
				}
				if (botHand[i].Rank ==4 )
				{
					mainBotValider.push(botHand[i].Rank + botHand[i].suit.charAt(0));
				}
				if (botHand[i].Rank ==3 )
				{
					mainBotValider.push(botHand[i].Rank + botHand[i].suit.charAt(0));
				}
				if (botHand[i].Rank ==2 )
				{
					mainBotValider.push(botHand[i].Rank + botHand[i].suit.charAt(0));
				}
			}
			
			var MJ = Hand.solve(mainJoueur)
			var MB = Hand.solve(mainBotValider)
			var winner = Hand.winners([MJ,MB])
			if(this.dealer.getHandLength() == 5)
			{
				if (winner.toString() == MJ.toString())
			{
				this.gameEnded("victoire")
				document.getElementById(this.bot.element).innerHTML = this.bot.showHand();
			}
			else
			{
				this.gameEnded('défaite');
				document.getElementById(this.bot.element).innerHTML = this.bot.showHand();
			}
			}
		}
		
		/*
			Instructions or status of game
		*/
		this.setMessage = function(str){
			document.getElementById('status').innerHTML = str;
		}


	}

	//Exposing the Game.init function
	//to the outside world
	return {
		init: Game.init.bind(Game)
	}

})()

