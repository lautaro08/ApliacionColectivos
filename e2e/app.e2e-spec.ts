import { AplicacionColectivosPage } from './app.po';

describe('aplicacion-colectivos App', function() {
  let page: AplicacionColectivosPage;

  beforeEach(() => {
    page = new AplicacionColectivosPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
