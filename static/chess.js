// get access to chess.html <body> element
const body = document.querySelector('body');

// access the data attributes to retrieve gameId and orientation
const gameId = body.dataset.gameId;
const orientation = body.dataset.orientation;
console.info(`Game Id: ${gameId}, Orientation: ${orientation}`);

const onDrop = (src, dst, piece) => {
    console.info(`src=${src}, dst=${dst}, piece=${piece}`);
    const move = {src, dst, piece};

    // PATCH /chess/:gameId
    fetch(`/chess/${gameId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(move)
    })
    .then(resp => console.info('Response: ', resp))
    .catch(err => console.error('Error: ', err))
}

const config = {
    draggable: true,
    position: "start",
    orientation,
    onDrop
}

// create instance of game
const chess = Chessboard('chess', config)

// Create an sse connection
const sse = new EventSource('/chess/stream');