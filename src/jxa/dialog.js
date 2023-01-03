const { run } = require("@jxa/run");

async function showDialog(title, text, buttons, givingUpAfter = 30) {
  // console.log("showDialog()", { title, text, buttons, givingUpAfter });
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

      resolve(response);
    } catch (e) {
      console.log("Error in jxa/showDialog()", e);
      reject(e);
    }
  });
}

async function askQuestion(questionText) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await run((question) => {
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
      resolve(response.textReturned);
    } catch (e) {
      console.log("jxa/askQuestion()", e);
    }
  });
}

module.exports = { showDialog, askQuestion };
