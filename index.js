const fetch = require("node-fetch");
const fs = require("fs");

const pushListElement = "<ul>";

async function fetchPushes() {
  const response = await fetch("https://api.github.com/repos/RyuKento/Githubstudy/events");
  const data = await response.json();

  for (const event of data) {
    if (event.type === "PushEvent") {
      const commits = event.payload.commits;
      for (const commit of commits) {
        const commitMessage = commit.message;
        const commitDate = new Date(event.created_at);
        const fileName = commitDate.toISOString().slice(0, 19).replace(/[-T:]/g, "") + ".md";

        pushListElement += `<li>${commitMessage}</li>`;

        const fileContent = `# Commit Message\n\n${commitMessage}\n\n`;
        createFile(fileName, fileContent);
      }
    }
  }

  pushListElement += "</ul>";
  fs.writeFileSync("index.html", pushListElement);
}

async function createFile(fileName, content) {
  const response = await fetch("https://api.github.com/repos/RyuKento/Githubstudy/contents/" + fileName, {
    method: "PUT",
    headers: {
      Authorization: "Bearer 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",
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify({
      message: "Create " + fileName,
      content: Buffer.from(content).toString("base64"),
    }),
  });

  if (response.ok) {
    console.log(`Successfully created ${fileName}`);
  } else {
    console.error(`Failed to create ${fileName}`);
  }
}

fetchPushes();
