var BaseView = window.requireAsset.get('BaseView'),
    mediator = window.requireAsset.get('mediator');

function TitleView() {

    var view = this;

    view.initialize({
        bg: 'bg-title'
    });

}

TitleView.prototype = new BaseView();

window.requireAsset.set('TitleView', TitleView);

mediator.subscribe('show:TitleView', function () {

    var TitleView = window.requireAsset.get('TitleView'),
        titleView = new TitleView();
    
    titleView.show();

});

export default TitleView;