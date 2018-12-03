$.fn.updateDom = function (data, options) {
    let _data = data,
        $this = $(this),
        settings = $.extend({
            cssClass: 'inserted_item',
            cleanParent: true,
            animate: false,
            template: $this.find('template')[0],
            animateClass: 'fadeIn',
            animateDelay: 100,
            animateDuration: 1000,
            callback: (parent, items) => {}
        }, options);
    
    if (settings.cleanParent) $this.find(`.${settings.cssClass}`).remove();

    if (_data) {
        for (let i = 0; i < _data.length; i++) {
            let _text = settings.template.innerHTML;
            for (const key in _data[i]) {
                if (_data[i].hasOwnProperty(key)) {
                    let _key = new RegExp(`{{${key}}}`, 'g');
                    _text = _text.replace(_key, _data[i][key]);
                    if (settings.template.hasAttribute('let-i')) _text = _text.replace(`{{i}}`, i);
                    if (settings.template.hasAttribute('let-length')) _text = _text.replace(`{{length}}`, _data.length);
                }
            }
    
            let $item = $($.parseHTML(_text).filter(_item => _item.nodeType !== 3));
            $item.addClass(settings.cssClass);
    
            if ($item.find('[data-if]').length) {
                let hasif = $item.find('[data-if]');
                
                hasif.each((i, item) => {
                    let _item = $(item);
    
                    let criteria = eval(_item.attr('data-if'));
                    if (!criteria) _item.remove();
                    else _item.removeAttr('data-if')
                })
            }
    
            if (settings.animate) {
                $item.css('animation', `${settings.animateClass} ${settings.animateDuration}ms ease ${settings.animateDelay * i}ms normal 1 both`);
                $item.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', () => $item.removeAttr('style'));
            }
    
            $this.append($item);
    
            if (i + 1 === _data.length && settings.callback && typeof settings.callback === 'function') {
                settings.callback($this, $this.find(`.${settings.cssClass}`));
            }
        }
    }
}