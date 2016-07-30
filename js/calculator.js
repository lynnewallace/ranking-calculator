var gamePoints = 3;

var Team = Backbone.Model.extend({
  idAttribute: "t_rank",

  defaults: {
    t_name: 'Team',
    t_rank: 0,
    t_pointsScored: 0,
    t_strength: 0,
    t_wlFactor: 0,
    t_score: 0
  },

  wlFactor: function(opponent) {
    var totalPoints = this.get('t_pointsScored') + opponent.get('t_pointsScored');
    if (totalPoints == 0) {
      return (gamePoints / 2).toFixed(2);
    }

    var scorePercentage = this.get('t_pointsScored') / totalPoints;
    return (gamePoints * scorePercentage).toFixed(2);
  },

  score: function(opponent){
    var score = this.get('t_wlFactor') * parseFloat(opponent.get('t_strength')) * 100;
    return score.toFixed(2);
  }
});

var Teams = Backbone.Collection.extend({
    model: Team,
    url: "./js/teams.json",

    initialize: function(){
        this.fetch().done(function(){
          teamNames = teamsA.map(function(team) {
            return { name: team.get("t_name"), rank: team.get("t_rank") };
          });

          new StrengthASlider().render();
          new StrengthBSlider().render();
          new PointsASlider().render();
          new PointsBSlider().render();
          new AutocompleteA().render(teamNames);
          new AutocompleteB().render(teamNames);
        });
    }
});

var teamsA = new Teams()
var teamsB = new Teams()


var StrengthASlider = Backbone.View.extend({

  el: '#team-a',

  events: {
    'slide #a-rank-slider': 'handleSliderChange'
  },

  render: function() {
    $( "#a-rank" ).val( "1" );
    $( "#a-strength" ).val( "0.00" );
    this.$slider = this.$el.find('#a-rank-slider').slider({range: "min", min: 1, max: teamsA.length, value: 1});
  },

  handleSliderChange: function(e, ui) {
    current_team = teamsA.at(ui.value - 1)
    opponent_team = teamsB.at(parseInt($("#b-rank").val()) - 1)
    current_team.set({'t_wlFactor': parseFloat($("#a-winloss").val())})
    opponent_team.set({'t_wlFactor': parseFloat($("#b-winloss").val())})

    $( "#a-rank" ).val( ui.value );
    $( "#a-strength" ).val( current_team.get('t_strength') );
    $( "#a-gamepoints" ).val( current_team.score(opponent_team) );
    $( "#b-gamepoints" ).val( opponent_team.score(current_team) );
  }
});

var StrengthBSlider = Backbone.View.extend({

  el: '#team-b',

  events: {
    'slide #b-rank-slider': 'handleSliderChange'
  },

  render: function() {
    $( "#b-rank").val( "1" );
    $( "#b-strength" ).val( "0.00" );
    this.$slider = this.$el.find('#b-rank-slider').slider({range: "min", min: 1, max: teamsB.length, value: 1});
  },

  handleSliderChange: function(e, ui) {
    current_team = teamsB.at(ui.value - 1)
    opponent_team = teamsA.at($("#a-rank").val() - 1)
    current_team.set({'t_wlFactor': parseFloat($("#b-winloss").val())})
    opponent_team.set({'t_wlFactor': parseFloat($("#a-winloss").val())})

    $( "#b-rank").val( ui.value );
    $( "#b-strength" ).val( current_team.get('t_strength') );
    $( "#b-gamepoints" ).val( current_team.score(opponent_team) );
    $( "#a-gamepoints" ).val( opponent_team.score(current_team) );
  }
});

var PointsASlider = Backbone.View.extend({

  el: '#team-a',

  events: {
    'slide #a-points-slider': 'handleSliderChange'
  },

  render: function() {
    $( "#a-points").val( "0" );
    $( "#a-winloss" ).val( "0.00" );
    $( "#a-gamepoints" ).val( "0.00" );
    this.$slider = this.$el.find('#a-points-slider').slider({range: "min", min: 0, max: 500, value: 0});
  },

  handleSliderChange: function(e, ui) {
    current_team = teamsA.at($("#a-rank").val() - 1)
    opponent_team = teamsB.at($("#b-rank").val() - 1)
    current_team.set({'t_pointsScored': ui.value})
    opponent_team.set({'t_pointsScored': parseInt($("#b-points").val())})
    current_team.set({'t_wlFactor': current_team.wlFactor(opponent_team)})
    opponent_team.set({'t_wlFactor': opponent_team.wlFactor(current_team)})
    
    $( "#a-points").val( ui.value );
    $( "#a-winloss" ).val( current_team.get('t_wlFactor') );
    $( "#b-winloss" ).val( opponent_team.wlFactor(current_team) );
    $( "#a-gamepoints" ).val( current_team.score(opponent_team) );
    $( "#b-gamepoints" ).val( opponent_team.score(current_team) );
  }
});

var PointsBSlider = Backbone.View.extend({

  el: '#team-b',

  events: {
    'slide #b-points-slider': 'handleSliderChange'
  },

  render: function() {
    $( "#b-points").val( "0" );
    $( "#b-winloss" ).val( "0.00" );
    $( "#b-gamepoints" ).val( "0.00" );
    this.$slider = this.$el.find('#b-points-slider').slider({range: "min", min: 0, max: 500, value: 0});
  },

  handleSliderChange: function(e, ui) {
    current_team = teamsB.at($("#b-rank").val() - 1)
    opponent_team = teamsA.at($("#a-rank").val() - 1)
    current_team.set({'t_pointsScored': ui.value})
    opponent_team.set({'t_pointsScored': parseInt($("#a-points").val())})
    current_team.set({'t_wlFactor': current_team.wlFactor(opponent_team)})
    opponent_team.set({'t_wlFactor': opponent_team.wlFactor(current_team)})
    
    $( "#b-points").val( ui.value );
    $( "#b-winloss" ).val( current_team.get('t_wlFactor') );
    $( "#a-winloss" ).val( opponent_team.get('t_wlFactor') );
    $( "#b-gamepoints" ).val( current_team.score(opponent_team) );
    $( "#a-gamepoints" ).val( opponent_team.score(current_team) );
  }
});

var AutocompleteA = Backbone.View.extend({

  render: function(teamNames) {
    $('#team-a-select').selectize({
      valueField: 'rank',
      labelField: 'name',
      searchField: 'name',
      options: teamNames,
      onItemAdd: function(value, item) {
        current_team = teamsA.at(value - 1)
        opponent_team = teamsB.at($("#b-rank").val() - 1)
        current_team.set({'t_pointsScored': parseInt($("#a-points").val())})
        opponent_team.set({'t_pointsScored': parseInt($("#b-points").val())})
        current_team.set({'t_wlFactor': parseFloat($("#a-winloss").val())})
        opponent_team.set({'t_wlFactor': parseFloat($("#b-winloss").val())})

        $( "#a-strength" ).val( current_team.get("t_strength") );
        $( "#a-rank" ).val( value );
        $( "#a-rank-slider" ).slider( "option", "value", value )
        $( "#a-gamepoints" ).val( current_team.score(opponent_team) );
        $( "#b-gamepoints" ).val( opponent_team.score(current_team) );
      }
    });
  }
});

var AutocompleteB = Backbone.View.extend({

  render: function(teamNames) {
    $('#team-b-select').selectize({
      valueField: 'rank',
      labelField: 'name',
      searchField: 'name',
      options: teamNames,
      onItemAdd: function(value, item) {
        current_team = teamsB.at(value - 1)
        opponent_team = teamsA.at($("#a-rank").val() - 1)
        current_team.set({'t_pointsScored': parseInt($("#b-points").val())})
        opponent_team.set({'t_pointsScored': parseInt($("#a-points").val())})
        current_team.set({'t_wlFactor': parseFloat($("#b-winloss").val())})
        opponent_team.set({'t_wlFactor': parseFloat($("#a-winloss").val())})

        $( "#b-strength" ).val( current_team.get("t_strength") );
        $( "#b-rank" ).val( value );
        $( "#b-rank-slider" ).slider( "option", "value", value )
        $( "#b-gamepoints" ).val( current_team.score(opponent_team) );
        $( "#a-gamepoints" ).val( opponent_team.score(current_team) );
      }
    });
  }
});