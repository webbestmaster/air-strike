var BaseView = window.requireAsset.get('BaseView');

function TitleView() {

    var view = this;

    view.initialize({
        bg: 'bg-title'
    });

}

TitleView.prototype = new BaseView();

requireAsset.set('TitleView', TitleView);

export default TitleView;