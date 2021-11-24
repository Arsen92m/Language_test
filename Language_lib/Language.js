
(function(global, undefined) {

    var NAME_MAP = {
        "en": "English",
        "hy": "Armenian",
        "ru": "Russian", 
    };

  var guessLanguage = function() {

      var UNKNOWN = 'unknown';

      var unicodeBlockTests = {
        "Basic Latin": /[\u0000-\u007F]/g,
        "Cyrillic": /[\u0400-\u04FF]/g,
        "Armenian": /[\u0530-\u058F]/g,

      };

      function findRuns(text) {

        var relevantRuns = {};

        for (var key in unicodeBlockTests) {
          var charCount = text.match(unicodeBlockTests[key]);
          var pct = (charCount ? charCount.length : 0) / text.length;

          relevantRuns[key] = pct;

        }

        return relevantRuns;
      }

      function identify(text, callback) {

        var scripts = findRuns(text);

        if (scripts["Basic Latin"] >= 0.15) {
          callback.apply(undefined, ["en"]);
          return;
        }
          if (scripts["Cyrillic"] >= 0.4) {
            callback.apply(undefined, ["ru"]);
            return;
        }
          if (scripts["Armenian"] >= 0.75) {
              callback.apply(undefined, ["hy"]);
            return;
        }
        callback.apply(undefined, [UNKNOWN]);
      }

      return {
        detect: function(text, callback) {

          if (!text) {
            callback.apply(undefined, [UNKNOWN]);
            return;
          }

          identify(text, callback);

        },
        info: function(text, callback) {

          this.detect(text, function(language) {

            if (language === UNKNOWN) {
              callback.apply(undefined, [[ UNKNOWN, UNKNOWN ]]);
              return;
            }

            callback.apply(undefined, [

              [ language, NAME_MAP[language] ]

            ]);

          });

        }
      };

  };

  global.guessLanguage = (global.module || {}).exports = new guessLanguage();

})(this);
