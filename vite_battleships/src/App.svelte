<script>
import { onMount } from "svelte";
import io from "socket.io-client";

//global vars
let socket = io("localhost:8081");
let HtmlStatusElement;
//let HtmlElementBattleList;
let playerName;
//global vars for battlegrid
let trueIfHorizontalBoatPlacement = true;
let numberOfShipsPlaced;
let battleHtml;
let arrayOfBattleshipDivGridHtmlElements;
let gridTargetNumberFromEvent;
let player_a_grid;
let player_b_grid;
let battleGridDOMElement;

onMount(() => {
  playerName = document.getElementById("player_name");
  HtmlStatusElement = document.getElementById("status_element");
  battleHtml = document.getElementById("battleHtmlTag");
  player_a_grid = [];
  player_b_grid = [];
  player_b_grid_fillDummyDataOnStart(); //fills with dummy data.
  battleGridDOMElement = document.getElementById("battleship_grid").getElementsByTagName("div");
  arrayOfBattleshipDivGridHtmlElements = Array.from(battleGridDOMElement); 
  arrayOfBattleshipDivGridHtmlElements.forEach(element => {
    element.addEventListener("click", getGrid_shooting);
  });
});

function start_game() {
  socket.emit("start_game");
  place_boats();
};

function submit_player_name() {
  socket.emit("submitting_player_name", { 
    description: "this is an object containing the name of the submitting player.",
    data: playerName 
  });
};

function flip_boat_placement_orientation() {
    trueIfHorizontalBoatPlacement = !trueIfHorizontalBoatPlacement;
};

function battleHtmlContentController(message) {
    if (battleHtml.childNodes[1]) battleHtml.removeChild(battleHtml.childNodes[1]);
    battleHtml.append(message);
};

function place_boats() {
  numberOfShipsPlaced = 0;
  battleHtmlContentController("We can place boats now!");   
  arrayOfBattleshipDivGridHtmlElements.forEach(element => {    //remove the old event
    element.removeEventListener("click", getGrid_shooting);
  });
  arrayOfBattleshipDivGridHtmlElements.forEach(element => {     //attach new event listener
    element.addEventListener("click", getGrid_shipPlacement);
  });
};

function getGrid_shipPlacement() {
  let navySize = 2;
  let boatSize = 3; //the length of the vessel being deployed. 3 for default ... carrier has five? maybe? Indicates number of grids occupied.
  gridTargetNumberFromEvent = Number(event.target.id.slice(4,7));
    if (trueIfHorizontalBoatPlacement) {
      for (let number = 0; number < boatSize; number++) {
        player_a_grid[gridTargetNumberFromEvent] = 1; //0 = no boat, 1 = boat, 2 = shot fired at empty element, 3 = shot fired at boat element
        gridTargetNumberFromEvent = gridTargetNumberFromEvent + 10;  //goes horizontyal
        }
    } else {
      for (let number = 0; number < boatSize; number++) {
        player_a_grid[gridTargetNumberFromEvent] = 1; //0 = no boat, 1 = boat, 2 = shot fired at empty element, 3 = shot fired at boat element
        gridTargetNumberFromEvent = Number(gridTargetNumberFromEvent) + 1; //goes vertical
      }
  };
  numberOfShipsPlaced++;
  battleHtmlContentController("we've placed a ship and are now at " + numberOfShipsPlaced + " ship(s).");
  if (numberOfShipsPlaced > navySize) {
    //socket_send_battlegrid(); //rtemember to add in the socket-sending-battlæegrid-data-to-server
    start_shooting_boats();
    return -1;
  };
};

function start_shooting_boats() { //this function REMOVES & ATTACHES the event listener's function to the UI grid elements
  arrayOfBattleshipDivGridHtmlElements.forEach(element => {
    element.removeEventListener("click", getGrid_shipPlacement);
  });
  arrayOfBattleshipDivGridHtmlElements.forEach(element => {
    element.addEventListener("click", getGrid_shooting); //once both players have placed their boats, go into shooting loop.
  });
  battleHtmlContentController("Ready to shoot!");   
};

function getGrid_shooting() { //this is the event attached to the listener, for shooting
  gridTargetNumberFromEvent = event.target.id.slice(4,7);
  if (checkForShotHit(gridTargetNumberFromEvent)) {
    battleHtmlContentController("You scored a hit!");
  } else {
    battleHtmlContentController("No hit!");
  };
}; 
  
function checkForShotHit(targetGrid) {
  return (player_b_grid[parseInt(targetGrid)] + 2 == 3); //only targets player_b_grid right now.
};

function player_b_grid_fillDummyDataOnStart() {
  player_b_grid[0] = 1;
  player_b_grid[10] = 1;
  player_b_grid[20] = 1;
  player_b_grid[3] = 1;
  player_b_grid[4] = 1;
  player_b_grid[5] = 1;
  player_b_grid[23] = 1;
  player_b_grid[79] = 1;
  player_b_grid[69] = 1;
};

</script>

<main>

<p>This is the current status:</p>
<p id="status_element"></p>
<button on:click={start_game}>Start game</button>

<div>  
  <input bind:value={playerName}/>
  <button on:click={submit_player_name}>submit player name</button>
</div>

<p id="battleHtmlTag">Battleships Game Status: </p>

<button on:click={flip_boat_placement_orientation}>Boats vertical or horizontal? </button>
<p id="boat_verticality_indicator">Boat are (true for horizontal): {trueIfHorizontalBoatPlacement}</p>

<div id="b_grid_div">  <!-- start of battleship grid, god forgive me-->
  <span id="battleship_grid">
          <!-- i want the grid to have lat/long coords by the side, but, although this would work, its ... it doesnt seem like a good solution.
            <div id="grid_latitude_color">0</div>
            <div id="grid_latitude_color">1</div>
            <div id="grid_latitude_color">2</div>
            <div id="grid_latitude_color">3</div>
            <div id="grid_latitude_color">4</div>
            <div id="grid_latitude_color">5</div>
            <div id="grid_latitude_color">6</div>
            <div id="grid_latitude_color">7</div>
            <div id="grid_latitude_color">8</div>
            <div id="grid_latitude_color">9</div>
        </span> -->
          <span id="row_1"> <!--be aware the boxes sort DOWN in the GUI-->
            <div id="box_000">0</div> <!-- first column-->
            <div id="box_001">0</div> <!-- first column-->
            <div id="box_002">0</div> <!-- first column-->
            <div id="box_003">0</div> <!-- first column-->
            <div id="box_004">0</div> <!-- first column-->
            <div id="box_005">0</div> <!-- first column-->
            <div id="box_006">0</div> <!-- first column-->
            <div id="box_007">0</div> <!-- first column-->
            <div id="box_008">0</div> <!-- first column-->
            <div id="box_009">0</div> <!-- first column-->
        </span>
        <span id="row_2"> <!--be aware the boxes sort DOWN in the GUI-->
            <div id="box_010">0</div> <!-- second column-->
            <div id="box_011">0</div> <!-- second column-->
            <div id="box_012">0</div> <!-- second column-->
            <div id="box_013">0</div> <!-- second column-->
            <div id="box_014">0</div> <!-- second column-->
            <div id="box_015">0</div> <!-- second column-->
            <div id="box_016">0</div> <!-- second column-->
            <div id="box_017">0</div> <!-- second column-->
            <div id="box_018">0</div> <!-- second column-->
            <div id="box_019">0</div> <!-- second column-->
        </span>
        <span id="row_3"> <!--be aware the boxes sort DOWN in the GUI-->
            <div id="box_020">0</div> <!-- third column-->
            <div id="box_021">0</div> <!-- third column-->
            <div id="box_022">0</div> <!-- third column-->
            <div id="box_023">0</div> <!-- third column-->
            <div id="box_024">0</div> <!-- third column-->
            <div id="box_025">0</div> <!-- third column-->
            <div id="box_026">0</div> <!-- third column-->
            <div id="box_027">0</div> <!-- third column-->
            <div id="box_028">0</div> <!-- third column-->
            <div id="box_029">0</div> <!-- third column-->
        </span>
        <span id="row_4"> <!--be aware the boxes sort DOWN in the GUI-->
            <div id="box_030">0</div> 
            <div id="box_031">0</div> 
            <div id="box_032">0</div> 
            <div id="box_033">0</div> 
            <div id="box_034">0</div> 
            <div id="box_035">0</div> 
            <div id="box_036">0</div> 
            <div id="box_037">0</div> 
            <div id="box_038">0</div> 
            <div id="box_039">0</div> 
        </span>
        <span id="row_5"> <!--be aware the boxes sort DOWN in the GUI-->
            <div id="box_040">0</div> 
            <div id="box_041">0</div> 
            <div id="box_042">0</div> 
            <div id="box_043">0</div> 
            <div id="box_044">0</div> 
            <div id="box_045">0</div> 
            <div id="box_046">0</div> 
            <div id="box_047">0</div> 
            <div id="box_048">0</div> 
            <div id="box_049">0</div> 
        </span>
        <span id="row_6"> <!--be aware the boxes sort DOWN in the GUI-->
            <div id="box_050">0</div> 
            <div id="box_051">0</div> 
            <div id="box_052">0</div> 
            <div id="box_053">0</div> 
            <div id="box_054">0</div> 
            <div id="box_055">0</div> 
            <div id="box_056">0</div> 
            <div id="box_057">0</div> 
            <div id="box_058">0</div> 
            <div id="box_059">0</div> 
        </span>
        <span id="row_7"> <!--be aware the boxes sort DOWN in the GUI-->
            <div id="box_060">0</div> 
            <div id="box_061">0</div> 
            <div id="box_062">0</div> 
            <div id="box_063">0</div> 
            <div id="box_064">0</div> 
            <div id="box_065">0</div> 
            <div id="box_066">0</div> 
            <div id="box_067">0</div> 
            <div id="box_068">0</div> 
            <div id="box_069">0</div> 
        </span>
        <span id="row_8"> <!--be aware the boxes sort DOWN in the GUI-->
            <div id="box_070">0</div> 
            <div id="box_071">0</div> 
            <div id="box_072">0</div> 
            <div id="box_073">0</div> 
            <div id="box_074">0</div> 
            <div id="box_075">0</div> 
            <div id="box_076">0</div> 
            <div id="box_077">0</div> 
            <div id="box_078">0</div> 
            <div id="box_079">0</div> 
        </span>
    </span>
</div> <!-- end of bbship grid -->
</main>

<style>
 :root {
  background-color: #717979;
}
div span span div {
  background-color: hsl(0, 0%, 0%);
  color: teal;
  width: 10px;
  border: 4px solid rgb(97, 182, 97);
  padding: 4px;
  margin: 1px;
}
span div:hover {
  color: yellow;
  border: 4px solid yellow;
}

#battleship_grid {
  display: flex;
}
</style>
