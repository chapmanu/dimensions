describe("simple test", function(){
  it ("loads test page", function(){
    var pageTitle = $(document).find("title").text();
    expect(pageTitle).to.equal("Dimensions Mocha Tests");
  });
});