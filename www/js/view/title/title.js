var BaseView = window.requireAsset.get('BaseView'),
    mediator = window.requireAsset.get('mediator');

function TitleView() {

    var view = this;

    view.initialize({
        bg: 'bg-title'
    });

    view.show();

}

TitleView.prototype = new BaseView();

window.requireAsset.set('TitleView', TitleView);

mediator.subscribe('show:TitleView', function () {
    new TitleView();
});

export default TitleView;
