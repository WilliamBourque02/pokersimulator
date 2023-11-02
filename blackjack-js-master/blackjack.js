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
	Player.prototype.gethand = function(){
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

	Dealer.prototype.gethand = function(){
		dictionary = {};
		for(var i = 0; i< this.hand.length; i++){
			dictionary[i]= {Rank: this.hand[i].getValue(i), suit: this.hand[i].getSuit(i) }
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
		}

		/*
			Hit button event handler
		*/
		this.hitButtonHandler = function(){
			//conteur
			var pairEntreMainJoueurEtDealer;
			var pairDansLaMainDuDealer;
			pairDansLaMainDuDealer =0;
			pairEntreMainJoueurEtDealer =0;
			//deal a card and add to Dealer's hand
			if(this.dealer.getHandLength() < 5){
			var card = Deck.deck.pop();
			this.dealer.hit(card);
			//render the card
			document.getElementById(this.dealer.element).innerHTML += card.view();
			}
			if(this.dealer.getHandLength() == 5){
			
			playerHand = this.player.gethand()
			dealerHand = this.dealer.gethand()
			
			for(var i = 0; i < Object.keys(playerHand).length; i++ )
			{
				 for(var t = 0; t < Object.keys(dealerHand).length; t++) 
				 {
					 if(playerHand[i].Rank == dealerHand[t].Rank)
					 {
						pairEntreMainJoueurEtDealer +=1;
					 }
				 }
			}
			for(var i = 0; i < Object.keys(dealerHand).length; i++ )
			{
				 for(var t = 0; t < Object.keys(dealerHand).length; t++) 
				 {
					 if(dealerHand[i].Rank == dealerHand[t].Rank && i!=t )
					 {
						pairDansLaMainDuDealer += 0.5;
					 }
				 }
			}
			console.log(pairDansLaMainDuDealer + "pair dans la main du dealer")
			console.log(pairEntreMainJoueurEtDealer + "pair entre la main du joueur et le dealer")
			this.gameEnded('terminer');
		}
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
					value2 =this.player.gethand()
					value = this.dealer.gethand()
					console.log(value);
					console.log(value2);
					this.gameEnded("terminer")
					break
				}
				
				
				/*this.dealerScore.innerHTML = this.dealer.getScore();

				var playerBlackjack = this.player.getScore() == 21,
						dealerBlackjack = this.dealer.getScore() == 21;

				//Rule set
				if(dealerBlackjack && !playerBlackjack) {
						this.gameEnded('You lost!');
						break;
				} else if(dealerBlackjack && playerBlackjack) {
						this.gameEnded('Draw!');
						break;
				} else if(this.dealer.getScore() > 21 && this.player.getScore() <= 21) {
						this.gameEnded('You won!');
						break;
				} else if(this.dealer.getScore() > this.player.getScore() && this.dealer.getScore() <= 21 && this.player.getScore() < 21) {
						this.gameEnded('You lost!');
						break;
				}
				//TODO needs to be expanded..
					*/
			}
		}
		/*
			Initialise
		*/
		this.init = function(){
			this.dealerScore = document.getElementById('dealer-score').getElementsByTagName("span")[0];
			this.playerScore = document.getElementById('player-score').getElementsByTagName("span")[0];
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
			this.dealer = new Dealer('dealer', [Deck.deck.pop()]);

			//deal two cards to player
			this.player = new Player('player', [Deck.deck.pop(), Deck.deck.pop()]);

			//render the cards
			document.getElementById(this.dealer.element).innerHTML = this.dealer.showHand();
			document.getElementById(this.player.element).innerHTML = this.player.showHand();

			//renders the current scores
			this.dealerScore.innerHTML = this.dealer.getScore();
			this.playerScore.innerHTML = this.player.getScore();

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