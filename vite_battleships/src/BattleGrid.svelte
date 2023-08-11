<script>
    import io from "socket.io-client";
    import { onMount } from "svelte";
    
    //import Chatform from "./lib/Chatform.svelte";
    
    let socket;
    let gridTargetNumberFromEvent;
    
    function socketInit(){
        if(!socket) {
            socket = io("localhost:8081");
            console.log("starting socket in socketInit");
        };
    };
    /*
    function chat_first_effect(){
        let arb = ["the", "game"];
        socket.emit("first_effect", arb);
    };
    */
    
    function socket_send_battlegrid() {
        socket.emit("battlegrid_data", player_a_grid);
    };
    
    function socket_send_start() {
        socket.emit("battleships_start");
        place_boats();
    };
    
    function disconnect() {
        socket.disconnect();
    };
    
    function reconnect() {
        socket = null;
        socketInit();
    };
    
    //global variables
    let numberOfShipsPlaced;
    let player_a_grid;
    let player_b_grid;
    let battleHtml;
    let battleGridDOMElement;
    let arrayOfBattleshipDivGridHtmlElements;
    let trueIfHorizontalBoatPlacement = true;
    
    function startBattleShips() {
        battleHtml = document.getElementById("battleHtmlTag");
        
        player_a_grid = [];
        player_b_grid = [];
        battleGridDOMElement = document.getElementById("battleship_grid").getElementsByTagName("div");
        arrayOfBattleshipDivGridHtmlElements = Array.from(battleGridDOMElement);
        arrayOfBattleshipDivGridHtmlElements.forEach(element => {
            element.addEventListener("click", getGrid_shooting);
        });
    };
    
    function place_boats() {
        numberOfShipsPlaced = 0;
        battleHtmlContentController("We can place boats now!");   
        //remove the old event
        arrayOfBattleshipDivGridHtmlElements.forEach(element => {
            element.removeEventListener("click", getGrid_shooting);
        });
        //attach new event listener
        arrayOfBattleshipDivGridHtmlElements.forEach(element => {
            element.addEventListener("click", getGrid_shipPlacement);
        });
    };
    
    function start_shooting_boats() {
        battleHtmlContentController("Ready to shoot!");   
        arrayOfBattleshipDivGridHtmlElements.forEach(element => {
            element.removeEventListener("click", getGrid_shipPlacement);
        });
        arrayOfBattleshipDivGridHtmlElements.forEach(element => {
            element.addEventListener("click", getGrid_shooting);
        });
    };
    
    function battleHtmlContentController(message) {
        if (battleHtml.childNodes[1]) battleHtml.removeChild(battleHtml.childNodes[1]);
        battleHtml.append(message);
    };
    
    function getGrid_shooting() {
        gridTargetNumberFromEvent = event.target.id.slice(4,7);
        battleHtmlContentController("Ready to shoot! We shot at grid: " + gridTargetNumberFromEvent);
        player_a_grid[gridTargetNumberFromEvent] + 2; //main diff between shooting and placement is, placing is +1, shooting is +2.
        console.log("this is getGrid w player a grid:", player_a_grid);
    }; 
    
    function getGrid_shipPlacement() {
        let navySize = 2;
        let boatSize = 3; //the length of the vessel being deployed. 3 for default ... carrier has five? maybe? Indicates number of grids occupied.
        gridTargetNumberFromEvent = Number(event.target.id.slice(4,7));
            if (trueIfHorizontalBoatPlacement) {
                for (let number = 0; number < boatSize; number++) {
                    if (gridTargetNumberFromEvent )
                    player_a_grid[gridTargetNumberFromEvent] = 1; //0 = no boat, 1 = boat, 2 = shot fired at empty element, 3 = shot fired at boat element
                    gridTargetNumberFromEvent = gridTargetNumberFromEvent + 10;  //goes horizontyal
                }
            } else {
                for (let number = 0; number < boatSize; number++) {
                    player_a_grid[gridTargetNumberFromEvent] = 1; //0 = no boat, 1 = boat, 2 = shot fired at empty element, 3 = shot fired at boat element
                    gridTargetNumberFromEvent = Number(gridTargetNumberFromEvent) + 1; //goes vertical
                }
            }
        numberOfShipsPlaced++;
        battleHtmlContentController("we've placed a ship and are now at " + numberOfShipsPlaced + " ship(s).");
        if (numberOfShipsPlaced > navySize) {
            socket_send_battlegrid();
            start_shooting_boats();
            return -1;
        }
    };
    
    /*
    function sendBattleshipInformationToServerBackend(){
        socket.emit("sendBattleshipInformationToServerBackend", "hello from battleship.");
    }
    */
    function flip_boat_placement_orientation() {
        trueIfHorizontalBoatPlacement = !trueIfHorizontalBoatPlacement;
    };
    
    onMount(() => {
            socketInit();
            startBattleShips();
        });
    </script>
    
    <main>
    hello
     <p id="battleHtmlTag">Battleships Game Status: </p>
     <!-- <button on:click={chat_first_effect}>click first_effect</button>
        -->
     <button on:click={disconnect}>Disconnnect</button>
     <button on:click={reconnect}>Reconnect </button>
     <!---<button on:click={place_boats}>Start placing boats. </button>-->
     <!--<button on:click={start_shooting_boats}>lets shoot boats!. </button> -->
     <button on:click={flip_boat_placement_orientation}>Boats vertical or horizontal? </button>
     <!-- <button on:click={socket_send_battlegrid}>Transmit battlegrid</button>-->
     <button on:click={socket_send_start}>Start the game</button>
    
     <!-- <button on:click={sendBattleshipInformationToServerBackend}>send information </button>
        -->
    
    
    <p id="boat_verticality_indicator">Boat are (true for horizontal): {trueIfHorizontalBoatPlacement}</p>
    <div>  <!-- start of battleship grid, god forgive me-->
        <span id="battleship_grid">
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
        </span>
    </div> <!-- end of bbship grid -->
    <!-- the chatform. it doesnt work.
        <div id="chat_area">
            <Chatform />
        </div>
    -->
    
    
    </main>
    
    <style>
    
    #chat_area {
        display: flex,
    }
     :root {
      background-color: #717979;
    }
    span div {
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
    