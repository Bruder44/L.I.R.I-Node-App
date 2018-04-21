require("dotenv").config();
var keys = require('./keys');
var Twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");

//capture users input, and inform user of their options.
console.log("my-tweets , spotify-this-song , movie-this , or do-what-it-says to get started!");
//process[2] choses action, process[3] as search parameter for spotify and movie.
var userCommand = process.argv[2];
var secondCommand = process.argv[3];
//process multiple word searches. Triggers based on user input.
	for(i=4; i<process.argv.length; i++){
	    secondCommand += '+' + process.argv[i];
	}

function SwitchStatement(){
	//action statement and switch statement to declare what to run.
	switch(userCommand){

		case 'my-tweets':
		getTweets();
		break;

		case 'spotify-this-song':
		spotifyMe();
		break;

		case 'movie-this':
		MovieTime();
		break;

		case 'do-what-it-says':
		readFilefun();
		break;
		
	}
};
//functions/options
function getTweets(){
	//new variable for instance of twitter, load keys from imported keys.js
    console.log("twitter started");
    var client = new Twitter(keys.twitter);
    var params = {screen_name: 'memes4u89'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
           console.log(tweets);
	        }
	    
	});
};//end getTweets;

function spotifyMe(){
	console.log("Pick a Track");

	//variable for search term, test if defined.

	var searchTrack;
	if(secondCommand === undefined){
		searchTrack = "The Sign";
	}else{
		searchTrack = secondCommand;
	}
	//launch spotify search
	spotify.search({type:'track', query:searchTrack}, function(err,data){
	    if(err){
	        console.log('Error occurred: ' + err);
	        return;
	    }else{
	        //tried searching for release year! Spotify doesn't return this!
	  		console.log("Artist: " + data.tracks.items[0].artists[0].name);
	        console.log("Song: " + data.tracks.items[0].name);
	        console.log("Album: " + data.tracks.items[0].album.name);
	        console.log("Preview Here: " + data.tracks.items[0].preview_url);
	    }
	});
};//end spotifyMe

function MovieTime(){
	console.log("Movies");

	//same as above, test if search term entered
	var searchMovie;
	if(secondCommand === undefined){
		searchMovie = "Mr. Nobody";
	}else{
		searchMovie = secondCommand;
	};

	var url = 'http://www.omdbapi.com/?t=' + searchMovie +'&y=&plot=long&tomatoes=true&r=json&apikey=trilogy';
   	request(url, function(error, response, body){
	    if(!error && response.statusCode == 200){
	        console.log("Title: " + JSON.parse(body)["Title"]);
	        console.log("Year: " + JSON.parse(body)["Year"]);
	        console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
	        console.log("Country: " + JSON.parse(body)["Country"]);
	        console.log("Language: " + JSON.parse(body)["Language"]);
	        console.log("Plot: " + JSON.parse(body)["Plot"]);
	        console.log("Actors: " + JSON.parse(body)["Actors"]);
	        console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
	        console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
	    }
    });
};//end MovieTime

function readFilefun(){
	console.log("Looking at random.txt now");
	fs.readFile("random.txt", "utf8", function(error, data) {
	    if(error){
     		console.log(error);
     	}else{

     	//split data, declare variables
     	var dataArr = data.split(',');
        userCommand = dataArr[0];
        secondCommand = dataArr[1];
        //if multi-word search term, add.
        for(i=2; i<dataArr.length; i++){
            secondCommand = secondCommand + "+" + dataArr[i];
        };
        //run action
		SwitchStatement();
		
    	};

    });//end readfile

};//end readFilefun

SwitchStatement();


