class MainController {
    getIndex(req, res) {
        res.render('index', { title: 'Home' });
    }

    getAbout(req, res) {
        res.render('about', { title: 'About' });
    }

}

module.exports = new MainController();