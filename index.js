// JavaScript code
const pushListElement = document.getElementById("pushList");

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

        const listItem = document.createElement("li");
        listItem.textContent = commitMessage;
        pushListElement.appendChild(listItem);

        const fileContent = `# Commit Message\n\n${commitMessage}\n\n`;
        createFile(fileName, fileContent);
      }
    }
  }
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
      content: btoa(content),
    }),
  });

  if (response.ok) {
    console.log(`Successfully created ${fileName}`);
  } else {
    console.error(`Failed to create ${fileName}`);
  }
}

fetchPushes();
