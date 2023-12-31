import express from 'express';
import { engine } from 'express-handlebars';
import SettingsBill from './settings-bill.js';
import bodyParser from 'body-parser';
import moment from 'moment';

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
        totals: SettingsBillFactory.totals(),
        className: SettingsBillFactory.totalClassName(),
    })
})

app.post('/settings', function(req, res){
    SettingsBillFactory.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });
    SettingsBillFactory.getSettings();

    res.redirect('/')
})

app.post('/action', function(req, res){
    SettingsBillFactory.recordAction(req.body.actionType);

    res.redirect('/')
})

app.get('/actions', function (req, res) {
    const actions = SettingsBillFactory.actions();
  
    actions.forEach((action) => {
        action.timestamp = moment().startOf('hour').fromNow();
    });
  
    res.render('actions', { actions: actions });
});
  
app.get('/actions/:type', function(req, res){
    let actionType = req.params.type;

    const actions = SettingsBillFactory.actionsFor(actionType);
  
    actions.forEach((action) => {
        action.timestamp = moment().startOf('hour').fromNow();
    });

    res.render('actions', {actions: actions})
})


let PORT = process.env.PORT || 3001;

app.listen(PORT, function(){
    console.log('App running on port ' + PORT);
})