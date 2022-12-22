export async function showDialog(text, buttons, title) {
  return new Promise((resolve, reject) => {
    try {
      const response = run(
        (intention, buttons) => {
          const app = Application.currentApplication();

          app.includeStandardAdditions = true;

          return app.displayDialog(
            text,
            {
              buttons,
              defaultButton: buttons[1],
              givingUpAfter: 30,
              withTitle: title,
            },
            {timeout: 300},
          )?.buttonReturned;
        },
        intention,
        buttons,
        title,
      );
      resolve(response);
    } catch (e) {
      console.log('Error in showAlert()', e);
      reject(e);
    }
  });
}
