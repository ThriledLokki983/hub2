const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api", (req, res) => {
//   res.json({ message: "Hello from server!" });

   res.status(200).json({
      status: 'success',
      message: "Hello from server!"
    })
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

  // "proxy": { "/api/**": { "target": "http://localhost:3000", "secure": false }  },
