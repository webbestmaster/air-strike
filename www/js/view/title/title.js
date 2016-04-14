var BaseView = window.requireAsset.get('BaseView'),
    mediator = window.requireAsset.get('mediator');

var buttonMap = [

    {
        text: 'text',
        style: {

        }
    }

];

function TitleView() {

    var view = this;

    view.initialize({
        bg: 'bg-title'
    });

    view.show();

    view.addButtons();

}

TitleView.prototype = Object.create(BaseView.prototype);

TitleView.prototype.addButtons = function () {

    var view = this,
        Button = window.requireAsset.get('Button'),
        deviceData = window.requireAsset.get('device').attr;

    view.buttons = [];

    buttonMap.forEach(function (buttonData) {

        var button = new Button(view),
            delta;

        button.createTextNode('I am the text on the button', {
            font : '50px quake',
            fill : '#FFF',
            align: 'center',
            wordWrap : true,
            wordWrapWidth : button.sprite.width * 0.8
        });

        delta = button.getDelta({
            x: 0,
            y: 0,
            width: deviceData.width,
            height: deviceData.height
        }, button.getBounds(), 5, 5);

        button.setPosition(delta.x, delta.y);

        view.buttons.push(button);

    });


/*
    view.buttons.push(

    )
*/

};

window.requireAsset.set('TitleView', TitleView);

mediator.subscribe('show:TitleView', function () {
    new TitleView();
});

export default TitleView;
