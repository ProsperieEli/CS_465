/* GET Homepage */
const index = (req, res) => {
    res.render('index', {
        title: 'Travlr Getaways',
        current_home: true
    });
};

module.exports = {
    index
};