var playerList = {};
var playersPerPlacing = {};
var tournamentType = "";
var tournamentState = "?";

function addPlayer2(pname){
    if(playerList[pname]){return;} //player already added
    plyrObj = new Object();
    plyrObj.name = pname;
    plyrObj.placing = -1;
    plyrObj.wins_names = [];
    plyrObj.wins_scores = [];
    plyrObj.losses_names = [];
    plyrObj.losses_scores = [];
    plyrObj.id = -1;
    plyrObj.seed = -1;
    playerList[pname] = plyrObj;
}

function getJSON(){
    cdataParent = document.getElementsByClassName('full-screen-target')[0];
    if(!cdataParent){return false};
    cdata = cdataParent.children[0].textContent;
    json = cdata.substring(cdata.indexOf("\{\"requested_plotter"));
    endIdx = json.search('window.') - 2;
    json = json.substring(0, endIdx);
    return JSON.parse(json);
}

function parseJSONMatch(m){
    if (m.state != "complete"){return false;}
    p1 = m.player1;                    p2 = m.player2;
    p1name = p1.display_name;          p2name = p2.display_name;
    addPlayer2(p1name);                addPlayer2(p2name);
    playerList[p1name].seed = p1.seed; playerList[p2name].seed = p2.seed;
    playerList[p1name].id = p1.id;     playerList[p2name].id = p2.id;
    function flipScore(s){
        split = s.split("-");
        return [split[1], split[0]].join("-");
    }
    score = [m.scores[0], m.scores[1]].sort().reverse().join("-"); // bigger number first
    if (p1.id == m.winner_id){ winner = p1name; loser = p2name;}
    else                     { winner = p2name; loser = p1name;}

    playerList[winner].wins_names.push(loser);
    playerList[winner].wins_scores.push(score);
    playerList[loser].losses_names.push(winner);
    playerList[loser].losses_scores.push(flipScore(score));
}

function parseJSON(json){
    tournamentType = json.tournament.tournament_type;
    tournamentState = json.tournament.state;
    rounds = json.matches_by_round;
    for (var round in rounds){
        for (var match in rounds[round]){
            parseJSONMatch(rounds[round][match]);
        }
    }
}

function getElimPlacings(){
    results = document.getElementsByClassName('container-fluid -with-content-gutters -width-limited')[0];
    currentPlacing = 1;
    top3 = results.children[1].children[0].children[0];
    top3Names = top3.getElementsByTagName("strong");
    for (let _name of top3Names){
        playerList[_name.textContent].placing = currentPlacing;
        playersPerPlacing['currentPlacing'] = 1;
        currentPlacing += 1;
    }
    rest = results.children[1].children[1].children[0].children[0];    
    restRounds = rest.getElementsByTagName("strong");
    playersPerPlacing[""+currentPlacing] = 0;
    for (let r in restRounds){
        if (typeof(restRounds[r]) == 'object'){
            names = restRounds[r].innerHTML.split("<br>");
            for(let n in names){
                playerList[names[n]].placing = currentPlacing;
                playersPerPlacing[currentPlacing.toString()] += 1;;
            }
            currentPlacing += names.length;
            playersPerPlacing[currentPlacing.toString()] = 0;
            restRounds[r].innerHTML = names.join("<br>");
        }
    }
}

function getSwissRRPlacings(){
    players = document.getElementsByClassName("participant left");
    prevPlacing = -1;
    for (const player of players){
        name = player.textContent.trim();
        placing = $(player).parent().children()[0].textContent;
        placing = parseInt(placing);
        playerList[name].placing = placing;
        if(placing == prevPlacing){playersPerPlacing[placing] += 1;}
        prevPlacing = placing;
    }
}

isBracketPage = $(document.body).attr('class').search("tournaments tournaments-show")!=-1;

if (isBracketPage){
    matchJSON = getJSON();
    if (matchJSON) {parseJSON(matchJSON);}
    if (tournamentState == "complete"){

        if(matchJSON && (tournamentType.search("elimination")!=-1)){
            getElimPlacings();
        }

        else if(matchJSON &&  ["round robin","swiss"].includes(tournamentType)){    
            getSwissRRPlacings();
        }

        replaceResults(playerList);

        for (let p of Object.values(playerList)){
            hoverByClass(p.id+"class", "gray")
        }
    }
}