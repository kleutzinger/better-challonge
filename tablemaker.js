function genWLSpans(p, WL) {
  spans = [];
  if (WL == 'w') {
    opponents = p.wins_names;
    scores = p.wins_scores;
  } else {
    opponents = p.losses_names;
    scores = p.losses_scores;
  }
  for (const [ idx, opp ] of opponents.entries()) {
    upset =
      (WL == 'w' && playerList[opp].seed > p.seed) ||
      (WL == 'l' && playerList[opp].seed < p.seed);
    if (upset) {
      spans.push(
        `<span class="${playerList[opp].id + 'class'}" title="${scores[
          idx
        ]}">${opp}</span>`
      );
    } else {
      spans.push(
        `<span class="${playerList[opp].id + 'class'}" title="${scores[
          idx
        ]}"><i>${opp}</i></span>`
      );
    }
  }
  return spans.join(',  ');
}

function genTable(plist) {
  pArray = Object.values(plist);
  function compPlacing(a, b) {
    if (a.placing >= b.placing) {
      return 1;
    } else {
      return -1;
    }
  }
  pArray = pArray.sort(compPlacing);
  tab = `
        <div class="standings-container"><table class="table table-striped table-bordered limited_width standings"><thead><tr>
        <th>Rank</th>
        <th>Participant Name</th>
        <th>Losses</th>
        <th>Wins</th></tr></thead><tbody>
    `;
  lastPlacing = -99;
  for (const [ idx, p ] of pArray.entries()) {
    if (lastPlacing != p.placing) {
      firstlines = `<tr><td class="rank" rowspan="${playersPerPlacing[
        p.placing
      ]}"><span class=${'rank' + p.placing}>${p.placing}</spa</td>`;
    } else {
      firstlines = '<tr>';
    }
    winSpan = genWLSpans(p, 'w');
    lossSpan = genWLSpans(p, 'l');
    entryTemplate = `
            <td class="left display_name">
                <span><strong><span class="${p.id +
                  'class'}" title="Seeded: ${p.seed}">${p.name}</strong></span>
            </td>
            <td class="left"><div>${lossSpan}</div></td>
            <td class="left"><div>${winSpan}</div></td>
            </tr>`;
    tab += firstlines + entryTemplate;
    lastPlacing = p.placing;
  }
  tab += '</tbody></table></div>';
  return tab;
}

function hoverByClass(classname, colorover, colorout = 'transparent') {
  var elms = document.getElementsByClassName(classname);
  for (var i = 0; i < elms.length; i++) {
    elms[i].onmouseover = function() {
      for (var k = 0; k < elms.length; k++) {
        if ($(elms[k]).css('font-weight') == 'bold') {
          elms[k].style.color = '#FF7324';
        }
      }
    };
    elms[i].onmouseout = function() {
      for (var k = 0; k < elms.length; k++) {
        elms[k].style.color = '#D8D8D8';
      }
    };
  }
}

function replaceResults(plist) {
  description = $('.tournament-description.limited_width');
  results.empty();
  if (description) {
    results.append(description);
  }
  results.append('<h4 title="Made by Kevbot"> (Better) Full Results</h4>');
  results.append(genTable(plist));
  let button = $(
    `<button id='exportButton' class='button'>Export Results</button>`
  )
    .click(() => exportButton())
    .css('color', 'black');
  results.append(button);
}
