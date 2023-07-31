import express from 'express';
import { engine } from 'express-handlebars';
import SettingsBill from './settings-bill.js';
import bodyParser from 'body-parser';

let app = express();

app.engine('handlebars', engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let SettingsBillFactory = SettingsBill(); 

app.get('/', function(req, res){
    res.render('index', {
        settings: SettingsBillFactory.getSettings(),
        totals: SettingsBillFactory.totals()
    })
})

app.post('/settings', function(req, res){
    SettingsBillFactory.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });

    res.redirect('/')
})

app.post('/action', function(req, res){
    SettingsBillFactory.recordAction(req.body.actionType);

    res.redirect('/')
})

app.get('/actions', function(req, res){
    res.render('actions', {actions: SettingsBillFactory.actions()})
})

app.get('/actions/:type', function(req, res){
    let actionType = req.params.type;

    res.render('actions', {actions: SettingsBillFactory.actionsFor(actionType)})
})


let PORT = process.env.PORT || 3001;

app.listen(PORT, function(){
    console.log('App running on port ' + PORT);
})