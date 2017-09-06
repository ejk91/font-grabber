const assert = require('assert');
const expect = require('chai').expect
const nodeServer = require('../server/index.js');
const request = require('request')

describe('Server Response', () => {
  let server;
  before( () => {
    server = nodeServer.server.listen(8000);
  });

  describe('WebFlow Fonts', () => {
    it('should return 200', (done) => {
      request.get('http://localhost:8000/url/?url=https://webflow.com/discover/popular', (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        done();
      })
    })

    it('should return a JSON parsable string', (done) => {
      request.get('http://localhost:8000/url/?url=https://webflow.com/discover/popular', (err, res, body) => {
        expect(typeof JSON.parse(res.body)).to.equal('object');
        done();
      })
    })

    it('should return correct data', (done) => {
      const expected = {
        "css": {
          "dashboard.a49c4c9130.css": [
            " sans-serif",
            " monospace, monospace",
            " \"proxima-nova\", Helvetica, Arial, sans-serif",
            " monospace",
            " inherit",
            " \"Helvetica Neue\", Helvetica, Arial, sans-serif",
            " \"proxima-nova\", Helvetica, Arial, sans-serif !important",
            " Helvetica, Arial, sans-serif",
            " Arial, Helvetica, sans-serif",
            " 'Courier'"
          ]
        },
        "html": {
          "index.html": [
            " \"{{ font.fontFamily "
          ]
        }
      }
      request.get('http://localhost:8000/url/?url=https://webflow.com/discover/popular', (err, res, body) => {
        expect(res.body).to.equal(JSON.stringify(expected));
        done();
      })
    })
  })

  after(() => {
    server.close();
  })
})