describe('Home Pages', function() {

  var ptor = protractor.getInstance();

  it('should load the homepage', function() {
    ptor.get('/#');
    expect(ptor.findElement(protractor.By.css('#article h1')).getText()).toBe('Hello world');
  });

});
