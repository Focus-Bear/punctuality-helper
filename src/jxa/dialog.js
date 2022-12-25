const { run } = require("@jxa/run");

async function showDialog(title, text, buttons, givingUpAfter = 30) {
  return new Promise((resolve, reject) => {
    try {
      const response = run(
        (title, text, buttons, givingUpAfter) => {
          const app = Application.currentApplication();

          app.includeStandardAdditions = true;

          return app.displayDialog(
            text,
            {
              buttons,
              defaultButton: buttons[1] || buttons[0],
              givingUpAfter,
              withTitle: title,
            },
            { timeout: 300 }
          )?.buttonReturned;
        },
        title,
        text,
        buttons,
        givingUpAfter
      );
      resolve(response.buttonReturned);
    } catch (e) {
      console.log("Error in showDialog()", e);
      reject(e);
    }
  });
}

async function askQuestion(questionText) {
  return new Promise((resolve, reject) => {
    try {
      const response = run((question) => {
        const app = Application.currentApplication();
        app.includeStandardAdditions = true;

        return app.displayDialog(
          question,
          {
            defaultAnswer: "\n \n \n",
            buttons: ["Close"],
            defaultButton: "Close",
          },
          { timeout: 3 }
        );
      }, questionText);
      resolve(response);
    } catch (e) {
      console.log("Error in askQuestion()", e);
    }
  });
}

module.exports = { showDialog, askQuestion };
