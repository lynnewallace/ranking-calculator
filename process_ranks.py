def process_rank_data(text):
    team_data = text.split("\n")[1:]
    last_team = len(team_data)

    teams_json = open("./js/teams.json", "w")
    teams_json.write("[\n")

    for team in team_data:
        teams_json.write("  {\n")

        details = team.split("\t")

        teams_json.write('    "t_name": "{}",\n'.format(details[1]))
        teams_json.write('    "t_strength": "{}",\n'.format(details[2]))
        teams_json.write('    "t_rank": {}'.format(details[0]))

        if int(details[0]) == last_team:
            teams_json.write("\n  }\n")
        else:
            teams_json.write("\n  },\n")

    teams_json.write("]")
    teams_json.close()
