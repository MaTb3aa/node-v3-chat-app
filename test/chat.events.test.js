const { expect } = require('chai');
const io = require('socket.io-client');
const http = require('http');
const app = require('../../app');
const { resetUsers } = require('../../utils/users');

describe('Chat Events', function() {
  let server, clientSocket;
  const PORT = 3001;
  const SERVER_URL = `http://localhost:${PORT}`;

  before((done) => {
    server = http.createServer(app);
    server.listen(PORT, done);
  });

  after((done) => {
    server.close(done);
  });

  beforeEach((done) => {
    resetUsers();
    clientSocket = io.connect(SERVER_URL);
    clientSocket.on('connect', done);
  });

  afterEach(() => {
    clientSocket.disconnect();
  });

  describe('join event', () => {
    it('should acknowledge successful join', (done) => {
      clientSocket.emit('join', { username: 'John', room: 'Dev' }, (error) => {
        expect(error).to.be.undefined;
        done();
      });
    });

    it('should broadcast user join message', (done) => {
      const secondClient = io.connect(SERVER_URL);
      
      secondClient.on('connect', () => {
        secondClient.emit('join', { username: 'Sarah', room: 'Dev' }, () => {
          clientSocket.emit('join', { username: 'Mike', room: 'Dev' }, () => {
            secondClient.on('message', (message) => {
              expect(message.text).to.include('Mike has joined!');
              secondClient.disconnect();
              done();
            });
          });
        });
      });
    });
  });

  describe('sendMessage event', () => {
    it('should broadcast messages', (done) => {
      clientSocket.emit('join', { username: 'John', room: 'Dev' }, () => {
        clientSocket.emit('sendMessage', 'Hello world!', () => {
          clientSocket.on('message', (message) => {
            expect(message.text).to.equal('Hello world!');
            done();
          });
        });
      });
    });

    it('should reject profanity', (done) => {
      clientSocket.emit('join', { username: 'John', room: 'Dev' }, () => {
        clientSocket.emit('sendMessage', 'curse word', (error) => {
          expect(error).to.equal('Profanity is not allowed');
          done();
        });
      });
    });
  });

});