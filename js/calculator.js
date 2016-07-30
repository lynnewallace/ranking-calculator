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
          teamNames = allTeams.map(function(team) {
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

var allTeams = new Teams()
var gamePoints = 3;

var StrengthASlider = Backbone.View.extend({

  el: '#team_a',

  events: {
    'slide #a_rank_slider': 'handleSliderChange'
  },

  render: function() {
    $( "#a_rank" ).val( "1" );
    $( "#a_strength" ).val( "0.00" );
    this.$slider = this.$el.find('#a_rank_slider').slider({range: "min", min: 1, max: allTeams.length, value: 1});
  },

  handleSliderChange: function(e, ui) {
    current_team = allTeams.at(ui.value - 1)
    opponent_team = allTeams.at(parseInt($("#b_rank").val()) - 1)
    current_team.set({'t_wlFactor': parseFloat($("#a_winloss").val())})
    opponent_team.set({'t_wlFactor': parseFloat($("#b_winloss").val())})

    $( "#a_rank" ).val( ui.value );
    $( "#a_strength" ).val( current_team.get('t_strength') );
    $( "#a_gamepoints" ).val( current_team.score(opponent_team) );
    $( "#b_gamepoints" ).val( opponent_team.score(current_team) );
  }
});

var StrengthBSlider = Backbone.View.extend({

  el: '#team_b',

  events: {
    'slide #b_rank_slider': 'handleSliderChange'
  },

  render: function() {
    $( "#b_rank").val( "1" );
    $( "#b_strength" ).val( "0.00" );
    this.$slider = this.$el.find('#b_rank_slider').slider({range: "min", min: 1, max: allTeams.length, value: 1});
  },

  handleSliderChange: function(e, ui) {
    current_team = allTeams.at(ui.value - 1)
    opponent_team = allTeams.at($("#a_rank").val() - 1)
    current_team.set({'t_wlFactor': parseFloat($("#b_winloss").val())})
    opponent_team.set({'t_wlFactor': parseFloat($("#a_winloss").val())})

    $( "#b_rank").val( ui.value );
    $( "#b_strength" ).val( current_team.get('t_strength') );
    $( "#b_gamepoints" ).val( current_team.score(opponent_team) );
    $( "#a_gamepoints" ).val( opponent_team.score(current_team) );
  }
});

var PointsASlider = Backbone.View.extend({

  el: '#team_a',

  events: {
    'slide #a_points_slider': 'handleSliderChange'
  },

  render: function() {
    $( "#a_points").val( "0" );
    $( "#a_winloss" ).val( "0.00" );
    $( "#a_gamepoints" ).val( "0.00" );
    this.$slider = this.$el.find('#a_points_slider').slider({range: "min", min: 0, max: 500, value: 0});
  },

  handleSliderChange: function(e, ui) {
    current_team = allTeams.at($("#a_rank").val() - 1)
    opponent_team = allTeams.at($("#b_rank").val() - 1)
    current_team.set({'t_pointsScored': ui.value})
    opponent_team.set({'t_pointsScored': parseInt($("#b_points").val())})
    current_team.set({'t_wlFactor': current_team.wlFactor(opponent_team)})
    opponent_team.set({'t_wlFactor': opponent_team.wlFactor(current_team)})
    
    $( "#a_points").val( ui.value );
    $( "#a_winloss" ).val( current_team.get('t_wlFactor') );
    $( "#b_winloss" ).val( opponent_team.wlFactor(current_team) );
    $( "#a_gamepoints" ).val( current_team.score(opponent_team) );
    $( "#b_gamepoints" ).val( opponent_team.score(current_team) );
  }
});

var PointsBSlider = Backbone.View.extend({

  el: '#team_b',

  events: {
    'slide #b_points_slider': 'handleSliderChange'
  },

  render: function() {
    $( "#b_points").val( "0" );
    $( "#b_winloss" ).val( "0.00" );
    $( "#b_gamepoints" ).val( "0.00" );
    this.$slider = this.$el.find('#b_points_slider').slider({range: "min", min: 0, max: 500, value: 0});
  },

  handleSliderChange: function(e, ui) {
    current_team = allTeams.at($("#b_rank").val() - 1)
    opponent_team = allTeams.at($("#a_rank").val() - 1)
    current_team.set({'t_pointsScored': ui.value})
    opponent_team.set({'t_pointsScored': parseInt($("#a_points").val())})
    current_team.set({'t_wlFactor': current_team.wlFactor(opponent_team)})
    opponent_team.set({'t_wlFactor': opponent_team.wlFactor(current_team)})
    
    $( "#b_points").val( ui.value );
    $( "#b_winloss" ).val( current_team.get('t_wlFactor') );
    $( "#a_winloss" ).val( opponent_team.get('t_wlFactor') );
    $( "#b_gamepoints" ).val( current_team.score(opponent_team) );
    $( "#a_gamepoints" ).val( opponent_team.score(current_team) );
  }
});

var AutocompleteA = Backbone.View.extend({

  render: function(teamNames) {
    $('#team_a_select').selectize({
      valueField: 'rank',
      labelField: 'name',
      searchField: 'name',
      options: teamNames,
      onItemAdd: function(value, item) {
        current_team = allTeams.at(value - 1)
        opponent_team = allTeams.at($("#b_rank").val() - 1)
        current_team.set({'t_pointsScored': parseInt($("#a_points").val())})
        opponent_team.set({'t_pointsScored': parseInt($("#b_points").val())})
        current_team.set({'t_wlFactor': parseFloat($("#a_winloss").val())})
        opponent_team.set({'t_wlFactor': parseFloat($("#b_winloss").val())})

        $( "#a_strength" ).val( current_team.get("t_strength") );
        $( "#a_rank" ).val( value );
        $( "#a_rank_slider" ).slider( "option", "value", value )
        $( "#a_gamepoints" ).val( current_team.score(opponent_team) );
        $( "#b_gamepoints" ).val( opponent_team.score(current_team) );
      }
    });
  }
});

var AutocompleteB = Backbone.View.extend({

  render: function(teamNames) {
    $('#team_b_select').selectize({
      valueField: 'rank',
      labelField: 'name',
      searchField: 'name',
      options: teamNames,
      onItemAdd: function(value, item) {
        current_team = allTeams.at(value - 1)
        opponent_team = allTeams.at($("#a_rank").val() - 1)
        current_team.set({'t_pointsScored': parseInt($("#b_points").val())})
        opponent_team.set({'t_pointsScored': parseInt($("#a_points").val())})
        current_team.set({'t_wlFactor': parseFloat($("#b_winloss").val())})
        opponent_team.set({'t_wlFactor': parseFloat($("#a_winloss").val())})

        $( "#b_strength" ).val( current_team.get("t_strength") );
        $( "#b_rank" ).val( value );
        $( "#b_rank_slider" ).slider( "option", "value", value )
        $( "#b_gamepoints" ).val( current_team.score(opponent_team) );
        $( "#a_gamepoints" ).val( opponent_team.score(current_team) );
      }
    });
  }
});