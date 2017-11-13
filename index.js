(function($) {
    var PandemicPage = {

        // TODO: fill these in
        num_remaining_player_cards: 50, // number before adding epidemic cards to the piles
        infection_rate_index: 0,
        infection_rate_track: [2,2,2,3,3,4,4,5],
        infection_draw_unknown: [
            "one",
            "two",
            "three",
            "four",
            "five",
            "six",
            "seven",
            "eight",
            //... 27 of these to begin with...
        ],



        infection_draw_known: [],
        infection_discard: [],
        player_deck_pile_sizes: [],

        $epidemic_button: null,
        $player_draw_button: null,
        $infection_input: null,
        $infection_button: null,
        $infection_bottom_input: null,
        $infection_bottom_button: null,

        $player_deck_ui: null,
        $infection_draw_known_ui: null,
        $infection_draw_unknown_ui: null,
        $infection_discard_ui: null,

        init: function() {
            this.$epidemic_button = $('button#epidemic-button');
            this.$player_draw_button = $('button#player-draw-button');
            this.$infection_input = $('input#infection-input');
            this.$infection_button = $('button#infection-button');
            this.$infection_bottom_input = $('input#infection-bottom-input');
            this.$infection_bottom_button = $('button#infection-bottom-button');

            this.$player_deck_ui = $('div#player-deck-ui');
            this.$infection_draw_known_ui = $('div#infection-draw-known-ui');
            this.$infection_draw_unknown_ui = $('div#infection-draw-unknown-ui');
            this.$infection_discard_ui = $('div#infection-discard-ui');

            this.bindEvents();
            var min_player_card_pile_size = Math.floor(this.num_remaining_player_cards / 5);
            var num_bigger_piles = this.num_remaining_player_cards % 5;
            for (var i = 0; i < num_bigger_piles; i++) {
                this.player_deck_pile_sizes[i] = min_player_card_pile_size +
                    1 + // add the remainder card
                    1;  // add the epidemic card
            }
            for (var j = num_bigger_piles; j < 5; j++) {
                this.player_deck_pile_sizes[j] = min_player_card_pile_size +
                    1; // add the epidemic card
            }
            this.updateUi();
        },

        bindEvents: function() {
            this.$epidemic_button.click($.proxy(function(event) {
                this.handleEpidemic(event);
                this.updateUi();
            }, this));
            this.$player_draw_button.click($.proxy(function(event) {
                this.handlePlayerDraw(event);
                this.updateUi();
            }, this));
            this.$infection_button.click($.proxy(function(event) {
                this.handleInfection(event);
                this.updateUi();
            }, this));
            this.$infection_bottom_button.click($.proxy(function(event) {
                this.handleInfectionBottom(event);
                this.updateUi();
            }, this));
        },

        handleInfection: function(event) {
            var infection_card = this.$infection_input.val();
            if (this.infection_draw_known.length > 0) {
                var infection_draw_known_index = this.infection_draw_known.indexOf(infection_card);
                if (infection_draw_known_index == -1) {
                    alert("invalid card for known infection cards: " + infection_card);
                    return;
                }
                this.infection_draw_known.splice(infection_draw_known_index, 1);
                if (this.infection_draw_known[this.infection_draw_known.length - 1] == "KNOWN_SPACER") {
                    this.infection_draw_known.pop();
                }
            } else {
                var infection_draw_unknown_index = this.infection_draw_unknown.indexOf(infection_card);
                if (infection_draw_unknown_index == -1) {
                    alert("invalid card for unknown infection cards: " + infection_card);
                    return;
                }
                this.infection_draw_unknown.splice(infection_draw_unknown_index, 1);
            }

            this.infection_discard.push(infection_card);
        },

        handleInfectionBottom: function(event) {
            var infection_card = this.$infection_bottom_input.val();
            var infection_draw_unknown_index = this.infection_draw_unknown.indexOf(infection_card);
            if (infection_draw_unknown_index == -1) {
                alert("invalid card: " + infection_card);
                return;
            }

            this.infection_draw_unknown.splice(infection_draw_unknown_index, 1);
            this.infection_discard.push(infection_card);
        },

        handleEpidemic: function(event) {
            if (this.infection_rate_index <= (this.infection_rate_track.size - 1)) {
                this.infection_rate_index++;
            }
            if (this.infection_draw_known.length > 0) {
                this.infection_draw_known.push("KNOWN_SPACER");
            }
            this.infection_draw_known = this.infection_draw_known.concat(this.infection_discard);
            this.infection_discard = [];
        },

        handlePlayerDraw: function(event) {
            for (var i = 0; i < 5; i++) {
                if (this.player_deck_pile_sizes[i] > 0) {
                    this.player_deck_pile_sizes[i]--;
                    break;
                }
            }
        },

        updateUi: function() {
            this.$infection_input.val("");
            this.$infection_bottom_input.val("");

            this.$player_deck_ui.text(this.player_deck_pile_sizes.toString());

            var infection_draw_known_text = "";
            for (var i = (this.infection_draw_known.length - 1); i >= 0; i--) {
                infection_draw_known_text += this.infection_draw_known[i] + ", ";
            }
            this.$infection_draw_known_ui.text(infection_draw_known_text);

            var infection_draw_unknown_text = "";
            for (i = (this.infection_draw_unknown.length - 1); i >= 0; i--) {
                infection_draw_unknown_text += this.infection_draw_unknown[i] + ", ";
            }
            this.$infection_draw_unknown_ui.text(infection_draw_unknown_text);

            var infection_discard_text = "";
            for (i = (this.infection_discard.length - 1); i >= 0; i--) {
                infection_discard_text += this.infection_discard[i] + ", ";
            }
            this.$infection_discard_ui.text(infection_discard_text);

        },

    };

    $( document ).ready(function() {
        PandemicPage.init();
    });

}(jQuery));
