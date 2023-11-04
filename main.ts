// import packages
import express, { response } from 'express'
import morgan from 'morgan'
import { engine } from 'express-handlebars'
import { v4 as uuidv4 } from 'uuid'
import { EventSource } from 'express-ts-sse'

// default to 3000 if PORT env is not set
const port = process.env.PORT || 3000;

// Create instance of sse
const sse = new EventSource();

// create instance of the application
const app = express();

// Configure render
app.engine('html',  engine({ defaultLayout: false}));
app.set('view engine', 'html');

// Log incoming requests
app.use(morgan("combine"));

//Handle POST requests
// POST /chess
app.post('/chess', express.urlencoded({extended: true}), 
    (req, response) => {
        const gameId = uuidv4().substring(0, 8);
        const orientation = 'white';

        response.status(200).render('chess', {gameId, orientation});
    }
);

// Handle Get
// Get /chess?gameId=****
app.get('/chess', 
    (req, response) => {
        const gameId = req.query.gameId;
        const orientation = 'black';
        response.status(200).render('chess', {gameId, orientation});
    })

// PATCH /chess/:gameId
app.patch('/chess/:gameId', express.json(),
    (req, response) => {
        const gameId = req.params.gameId;
        const move = req.body;

        console.info(`Game Id: ${gameId} Move: ${JSON.stringify(move)}`);
        sse.send({ event: gameId, data: move});

        response.status(201).json({ timestamp : (new Date()).getTime()});
    }
);

app.get('/chess/stream', sse.init); 

// Serve files from static
app.use(express.static(__dirname + '/static'));

app.listen(port, ()=> {
    console.info(`Application bound to port ${port} at ${new Date()}`);
})          
