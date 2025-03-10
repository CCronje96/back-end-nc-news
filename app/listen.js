const app = require("./app");

app.listen(9090, (error) => {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Listening on: 9090");
  }
});
