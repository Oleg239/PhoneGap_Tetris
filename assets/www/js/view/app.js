(function(exports, $) {

	"use strict";

	var AppView = Backbone.View.extend({
		el : "body",

		events : {
			"click #start1" : "singlePlay",	
			"click #pause" : "togglePause",
			"click #return" : "return",
			"click #up, #down, #left, #right" : "processinput"
		},

		initialize : function(options) {
			_.bindAll(this);

			this.$startMenu = $("#start-menu");
			this.$singlePage = $("#singlePage");
			this.$singleInfo = $("#single-info");
			this.$optionBar = $("#optionBar");

			this.lose = "lose";
			this.win = "win";
			this.gameModel = "";

			this.mainMediator = null;

			this.counter = 0;
			this.gameStarted = false;
			this.render();
			this.paused = false;	
		},

		render : function() {
			this.$optionBar.hide();
			this.$singlePage.hide();
			this.$singleInfo.hide();			
			this.$startMenu.fadeIn();
		},

		singlePlay : function() {
			utils.log("singlePlay!!!");

			this.mainMediator = new MainMediator();
			this.gridView = new GridView({id : "grid"});
			this.gridView.setMediator(this.mainMediator);
			this.listenTo(this.gridView, 'finish', this.processFinish);	

			this.$startMenu.hide();
			this.$optionBar.fadeIn();			
			this.$singleInfo.fadeIn();
			this.$singlePage.fadeIn();
			this.gameStarted = true;

			this.gridView.start();
		},

		processFinish : function(data) {
			alert("Game over! Your score :" + data.score);
			this.render();
			this.gameModel = "";
			this.gameStarted = false;					
		},

		togglePause : function(event) {
			if (!this.doubleModel && this.gridView) {
				this.paused = this.gridView.togglePause(event.pause);
				var text;
				if (this.paused) {
					text = "Continue";
				} else {
					text = "Pause";
				}			
				$("input#pause").parent().find(".ui-btn-text").text(text);
			}
		},

		return : function(event) {
			if (this.gridView) {
				this.paused = this.togglePause({"pause" : true});
				var sure = confirm("Are you sure?");
				if (sure) {
                    $("input#pause").parent().find(".ui-btn-text").text("Yes");
					this.gridView.forceStop(true);
					this.render();
					this.gameModel = "";
					this.gameStarted = false;	
				} else {
					this.paused = this.togglePause({"pause" : false});
				}
			}
		},

		processinput : function(event) {
			var target = $(event.target);
			this.mainMediator.input(target.attr("id"));
		}
	});

	exports.AppView = AppView;

})(this, jQuery);