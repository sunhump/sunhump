let AppForm = {
    elemSelector: '.js-c-header',
    $elem: null,
    init() {
        this.$elem = $(this.elemSelector);

        if (this.$elem.length === 0) return;

        console.log('hello from c-header.js')

    }
};

export default Header;
