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

TitleView.prototype = new BaseView();

TitleView.prototype.addButtons = function () {

    var view = this,
        Button = window.requireAsset.get('Button');

    view.buttons = [];

    view.buttons.push(
        new Button(view, {})
    )

};

window.requireAsset.set('TitleView', TitleView);

mediator.subscribe('show:TitleView', function () {
    new TitleView();
});

export default TitleView;
