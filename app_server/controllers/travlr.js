//var fs = require('fs');
//ar trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

/*GET travel view page*/
const tripsEndpoint = 'http://localhost:3000/api/trips';
const options = {
    method: 'GET', headers: { 
        'Accept': 'application/json' 
    } } 

const travel = async function (req, res, next) {
    await fetch(tripsEndpoint, options)
        .then((res) => res.json())
        .then((json) => {
            let message = null;
            if (!(json instanceof Array)) {
                message = "API lookup error"
                json = [];
            } else {
                if (!json.length) {
                    message = "No trips found in the database";
                }
            }
                res.render('travel', { title: 'Travel', trips: json, message });
            })
            .catch((err) => res.status(500).send(err.message));
};



module.exports = {
        travel
    };