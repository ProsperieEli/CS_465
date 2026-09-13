/*GET travel view page*/
const travel = (req, res) => {
    res.render('travel', { title: 'Travel' });
};

module.exports = {
        travel
    };