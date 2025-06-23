console.log("Mail Muse - AI Email Assistant loaded");

function createAIbutton() {
  const button = document.createElement('div');
  button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
  button.style.backgroundColor = '#0b57d0';
  button.style.color = '#ffffff';
  button.style.borderRadius = '4px';
  button.style.padding = '4px 8px';
  button.style.marginLeft = "5px";
  button.style.marginRight = "5px";
  button.style.marginTop = "2px";
  button.innerHTML = "AI Assist";
  button.setAttribute("role", "button");
  button.setAttribute("data-tooltip", "AI Email Assistant");
  button.style.cursor = "pointer";
  return button;
}

function findComposeToolbar() {
  const selectors = [".aDh", ".btC", '[role="toolbar"]', ".gU.Up"];
  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) {
      return toolbar;
    }
  }
}

function getEmailContent() {
  const selectors = [
    ".h7",
    ".a3s.ail",
    '[role="presentation"]',
    ".gmail_quote",
  ];
  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) {
      return content.innerText.trim();
    }
    return "";
  }
}

function injectButton() {
  const existingButton = document.querySelector(".mail-muse-button");
  if (existingButton) existingButton.remove();

  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.error("Compose toolbar not found");
    return;
  }
  console.log("Compose toolbar found");
  const button = createAIbutton();
  button.classList.add("mail-muse-button");

  button.addEventListener("click", async () => {
    try {
      button.innerHTML = "Loading...";
      button.disabled = true;

      const emailContent = getEmailContent();
      const response = await fetch("http://localhost:8080/api/email/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailContent, tone: "formal" }),
      });
      if (!response.ok) {
        throw new Error("Request Failed");
      }
      const generatedResponse = await response.text();
      const composeBox = document.querySelector(
        '[role="textbox"][g_editable="true"]'
      );
      if (composeBox) {
        composeBox.focus();
        document.execCommand("insertText", false, generatedResponse);
      } else {
        console.error("Compose box not found");
      }
    } catch (error) {
      console.log("Error:", error);
      alert(
        "An error occurred while generating the email response. Please try again."
      );
    } finally {
      button.innerHTML = "AI Assist";
      button.disabled = false;
    }
  });

  toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
  for(const mutation of mutations){
    const addNode = Array.from(mutation.addedNodes);
    const hasComposeElements = addNode.some(node => 
      node.nodeType === Node.ELEMENT_NODE &&
        (node.matches('.aDh, .btC, [role="dialog"]') ||
          node.querySelector('.aDh, .btC, [role="dialog"]'))
    );
      if (hasComposeElements) {
        console.log("Compose window detected");
        setTimeout(injectButton, 500);
      }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
