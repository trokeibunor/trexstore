suite('About page test',function(){
    test:'Check contact link in about', function(){
        assert($('a[href="/contact"]').length)
    }
})