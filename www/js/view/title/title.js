var BaseView = window.requireAsset.get('BaseView'),
    mediator = window.requireAsset.get('mediator');

var buttonMap = [

    {
        id: 'button_1',
        text: 'text',
        style: ''
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
        Button = window.requireAsset.get('Button');

    view.buttons = [];

    var button = new Button(view);

    button.createTextNode('I am the text on the button', {
        font : '50px quake  ',
        fill : '#FFF',
        align: 'center',
        wordWrap : true,
        wordWrapWidth : button.sprite.width * 0.8
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
