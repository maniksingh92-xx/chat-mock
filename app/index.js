import $ from 'jquery';

(function () {

  var dummyText = [
    'Hi Yellowant',
    'Hey User, what can I help you with?',
    'Yellowant, can you fetch my unread mails',
    `You have 24 unread emails. Here are the latest 5:
    <ul>
      <li>Welcome to YellowAnt - YellowAnt Team</li>
      <li>Check out the new offers from Amazon</li>
      <li>You have 2 new messages on LinkedIn</li>
      <li>Confirm you registration - ABC company</li>
      <li>hey long time! - John Doe</li>
    </ul>
    Would you like me to fetch more unread emails? (Yes/No)`,
    'No, thanks',
    'okay, let me know if you need anything.'
  ];

  var identifiers = {
    chatboxInput: $('.chatbox-input'),
    chatboxThreadsContainer: $('.chatbox-threads-container'),
    chatboxThreads: $('.chatbox-threads')
  };

  var config = {
    botMaxResponseDelay: 1000,
    botMinResponseDelay: 500,
    charTypeSpeed: 100,
    owner: {
      user: 0,
      bot: 1
    }
  };

  $(document).ready(main); // mockChatbox

  function main() {
    mockChatbox(0);
  }

  function mockChatbox(threadIndex) {
    if (threadIndex < dummyText.length) {
      // var delayThread = 0;
      // var owner = config.owner.user;
      var mockAction = threadIndex % 2 == 0 ? mockUserInput : mockBotResponse;

      // if (threadIndex%2 != 0) {
      //   delayThread = Math.floor(Math.random() * (config.botMaxResponseDelay - config.botMinResponseDelay)) + config.botMinResponseDelay;
      //   owner = config.owner.bot;
      //   mockAction = mockBotResponse;
      // }

      $.when(mockAction(dummyText[threadIndex])).then(function () {
        identifiers.chatboxThreadsContainer.animate({ scrollTop: 5000}, 0);
        mockChatbox(threadIndex + 1);
      });

      // setTimeout( function () {

      //   // insertThread(buildThreadHtml(dummyText[threadIndex], owner));
      // }, delayThread);
    }

    return null;
  }

  function mockUserInput(text) {
    var d = new $.Deferred();
    $.when(typeUserInput(text)).done(function () {
      clearChatboxInput();
      insertThread(buildThreadHtml(text, config.owner.user));
      d.resolve();
    });

    return d.promise();

    function typeUserInput(text) {
      var d = new $.Deferred();

      typeChar(0);

      return d.promise();

      function typeChar(charIndex) {
        if (charIndex < text.length) {
          var currentText = text.slice(0, charIndex + 1);
          identifiers.chatboxInput.text(currentText);
          setTimeout(function () {
            typeChar(charIndex + 1)
          }, config.charTypeSpeed);
        } else {
          setTimeout(function () {
            d.resolve();
          }, config.charTypeSpeed * 3);
        }
      }
    }

    function clearChatboxInput() {
      identifiers.chatboxInput.text('');
    }
  }

  function mockBotResponse(text) {
    var d = new $.Deferred();
    $.when(mockBotResponseDelay()).done(function () {
      insertThread(buildThreadHtml(text, config.owner.bot));
      d.resolve();
    });

    return d.promise();

    function mockBotResponseDelay() {
      var d = new $.Deferred();
      var delay = Math.floor(Math.random() * (config.botMaxResponseDelay - config.botMinResponseDelay)) + config.botMinResponseDelay;

      setTimeout(function () {
        d.resolve();
      }, delay);

      return d.promise();
    }
  }

  function insertThread(htmlContent) {
    identifiers.chatboxThreads.append(htmlContent);
  }

  function buildThreadHtml(text, owner) {
    var className = 'chatbox-thread';

    if (owner == config.owner.user) { className += ' user'; }
    else { className += ' bot'; }

    return "<div class='" + className + "'>" + text + "</div>";
  }

})();