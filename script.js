const socket = io("http://localhost:8000", {
  withCredentials: false,
  transports: ['websocket', 'polling']
});

socket.on("connect", () => {
    console.log("Connected to WebSocket server");
});

socket.on("new_square", (squares) => {
    console.log("Received new squares:", squares);
    squares.forEach(spawnAnimatedGifWithText("Example1"));
});

function spawnAnimatedGifWithText(text) {
    // Create a container for both the text and the image
    const animatedContainer = document.createElement("div");
    animatedContainer.classList.add("animatedContainer");
  
    // Create and append the text element
    const textElement = document.createElement("div");
    textElement.classList.add("animatedText");
    textElement.innerText = text;
  
    // Create and append the GIF image
    const gifElement = document.createElement("img");
    gifElement.src = "assets/walker.gif";
    gifElement.classList.add("animatedImage");
  
    // Append both elements (text + gif) to the container
    animatedContainer.appendChild(textElement);
    animatedContainer.appendChild(gifElement);
  
    // Append to the main container
    container.appendChild(animatedContainer);
  
    // Remove after 5 seconds plus random delay
    setTimeout(() => {
      container.removeChild(animatedContainer);
    }, 5000);
  }
