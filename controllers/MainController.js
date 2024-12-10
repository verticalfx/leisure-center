class MainController {
    constructor() {
        this.name = 'MainController';
    }

    getIndex(req, res) {
        res.render('index', { title: 'Home' });
    }

    getAbout(req, res) {
        res.render('about', { title: 'About' });
    }

}

exports.MainController = new MainController();