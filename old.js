
function checkCompleteMatches(_losses){
    singleLossFound = false;
    entrantsFound = 0;
    for (var key in losses) {
        if (_losses.hasOwnProperty(key)){
            entrantsFound +=1;
            if (_losses[key].length <= 1){
                if(singleLossFound) {return false};
                singleLossFound = true;
            }
        }
    }
    return entrantsFound == numberOfEntrants;
}

function parseMatch(player1, player2){
    p1Data = parsePlayer(player1);
    p2Data = parsePlayer(player2);
    
    if (!wins  [p1Data.name]){wins  [p1Data.name] = [];}
    if (!losses[p1Data.name]){losses[p1Data.name] = [];}
    
    if (!wins  [p2Data.name]){wins  [p2Data.name] = [];}
    if (!losses[p2Data.name]){losses[p2Data.name] = [];}
    
    if(p1Data.isWinner){
        wins  [p1Data.name].push(p2Data.name);
        losses[p2Data.name].push(p1Data.name);
    }

    else{
        wins  [p2Data.name].push(p1Data.name);
        losses[p1Data.name].push(p2Data.name);
    }
}

function getMatches(){
    var elements = document.getElementsByClassName('match -complete');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var player1 = element.children[3].children[0];
        var player2 = element.children[3].children[1];
        
        var id = element.getAttribute("data-match-id");
        if (!parsed[id]){
            parseMatch(player1,player2);
            i+=1;
            parsed[id] = true;
        }
    }
    if (checkCompleteMatches(losses)){
        clearInterval(rerun);
        DONE =true;
        console.log(wins);
        console.log(losses);
    }
}




function parsePlayer(player){
    playerName = player.children[0].textContent;
    is_winner = player.children[6].getAttribute("class") == "match--player-score-background -winner";
    var data = {name:playerName, isWinner:is_winner};
    return data;
}

var numberOfEntrants = document.getElementsByClassName("fa fa-trophy fa-fw")[0].nextSibling.textContent;
var doubleElim = numberOfEntrants.search("Double") != -1;
numberOfEntrants= parseInt(numberOfEntrants);
console.log(numberOfEntrants, " entrants");


function generateP(){
    p = "<p> ";
    for (var key in losses) {
        if (losses.hasOwnProperty(key)){
            p += "\n<br>"+ key + " LOST TO: ";
            for (var loss in losses[key]){
                p += ", " + losses[key][loss]; 
            }
        }
    }
    p += "</p>";
    return p;
}



function generateTable(dict){
    p = "<table> <tr> <th>player</th><th>loss1</th><th>loss2</th> </tr>\n";
    for (var key in dict) {
        if (dict.hasOwnProperty(key)){
            p += '<tr> <td '+hover(key, 1) + '>' +key +"</td>" ;
            for (var entry in [0,1]){
                if (dict[key][entry]) {p += '<td style="padding:0 15px 0 15px;" ' +hover(dict[key][entry], 1) +'>' + dict[key][entry] + "</td>";}
            }
            p += '</tr> \n'
        }
    }
    p += "</table>";
    return p;
}
