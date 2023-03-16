"""Script to retrieve Premier League Standings for a given Season / Gameweek"""
import pandas as pd
import requests
from bs4 import BeautifulSoup
from sqlalchemy import create_engine, types

# minimum season is 1888-1889
URL = """https://www.worldfootball.net/schedule/eng-premier-league-1888-1889-spieltag/"""

header = {
    "User-Agent": """Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.75 Safari/537.36""",
    "X-Requested-With": "XMLHttpRequest",
}

r = requests.get(URL, headers=header, timeout=10)
soup = BeautifulSoup(r.content, features="lxml")
season_dd = soup.find("select", attrs={"name": "saison"})
if season_dd and not isinstance(season_dd, str):
    seasons: list[str] = [
        option.getText().replace("/", "-") for option in season_dd.findAll("option")
    ]
    seasons.reverse()

league_standings = []

for season in seasons:
    print(season)
    GAMEWEEK = "0"
    URL = f"""https://www.worldfootball.net/schedule/eng-premier-league-{season}-spieltag/{GAMEWEEK}/"""
    r = requests.get(URL, headers=header, timeout=10)
    soup = BeautifulSoup(r.content, features="lxml")

    gameweek_dd = soup.find("select", attrs={"name": "runde"})
    if gameweek_dd and not isinstance(gameweek_dd, str):
        gameweeks = [
            option.getText().split(".")[0]
            for option in gameweek_dd.findAll("option")
            if option.getText().split(".")[0] != "0"
        ]

    table = pd.DataFrame()
    for gameweek in gameweeks:
        URL = f"""https://www.worldfootball.net/schedule/eng-premier-league-{season}-spieltag/{gameweek}/"""
        r = requests.get(URL, headers=header, timeout=10)
        if pd.read_html(r.text, match="goals")[0].equals(table):
            break
        table = pd.read_html(r.text, match="goals")[0]
        df = table.drop("Team", axis=1).rename(
            columns={
                "#": "position",
                "Team.1": "team",
                "M.": "matches_played",
                "W": "wins",
                "D": "draws",
                "L": "losses",
                "Dif.": "goal_difference",
                "Pt.": "points",
            }
        )
        df[["goals_for", "goals_against"]] = df.goals.str.split(":", expand=True)
        df = df.drop("goals", axis=1)
        if df.dtypes.points != "int64":
            df["points"] = df.points.str.split(":", expand=True)[0]
        df = df[
            [
                "position",
                "team",
                "matches_played",
                "wins",
                "draws",
                "losses",
                "goals_for",
                "goals_against",
                "goal_difference",
                "points",
            ]
        ]
        df.insert(0, "gameweek", gameweek)
        df.insert(0, "season", season)
        df = df.fillna(method="ffill")
        league_standings.append(df)

full_standings = pd.concat(league_standings)
full_standings = full_standings.reset_index(drop=True)
engine = create_engine("postgresql://gwionrob:asdf@localhost:5432/league_slider")
full_standings.to_sql(
    "league_standings",
    engine,
    index_label="id",
    dtype={
        "id": types.INT(),  # type: ignore
        "season": types.VARCHAR(length=10),  # type: ignore
        "gameweek": types.INT(),  # type: ignore
        "position": types.INT(),  # type: ignore
        "team": types.VARCHAR(length=50),  # type: ignore
        "matches_played": types.INT(),  # type: ignore
        "wins": types.INT(),  # type: ignore
        "draws": types.INT(),  # type: ignore
        "losses": types.INT(),  # type: ignore
        "goals_for": types.INT(),  # type: ignore
        "goals_against": types.INT(),  # type: ignore
        "goal_difference": types.INT(),  # type: ignore
        "points": types.INT(),  # type: ignore
    },
)
print("League creation finished, pushed to postgresql db.")
