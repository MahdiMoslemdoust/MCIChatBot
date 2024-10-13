**Introduction: MCI 3D AI Chatbot Web Application**

This project focuses on building a 3D AI chatbot web application for Mobile Telecommunication Company of Iran (MCI), designed to provide efficient customer support. The chatbot enables users to interact through a dynamic 3D interface, offering quick responses to inquiries and assistance with MCI services. It is currently in the development phase and has not yet been released for public use.

### Key Technologies:
- **Next.js**: React framework with server-side rendering.
- **Tailwind CSS**: Utility-first CSS for responsive design.
- **Three.js**: 3D JavaScript library for rendering the chatbot model.
- **Socket.io**: Enables real-time chat functionality.
- **Jotai**: Manages application state.

### Project Structure:
1. app Folder:
This folder contains the core files for initializing and styling the web application:
•	app.js: The main application file where the root of the web app is defined. It is responsible for rendering the core structure of the web app and integrating components.
•	layout.js: Manages the overall layout of the application, including the structure of headers, footers, and page sections that are consistent across different parts of the app.
•	globals.css: The global stylesheet for the application. It contains styles that are applied globally across all components and pages, ensuring consistent look and feel throughout the app.
2. public Folder:
This folder stores static assets that can be accessed publicly and are used throughout the application. It contains three key subfolders:
•	fonts: Stores the font files used in the project, ensuring that custom fonts are applied consistently in the UI.
•	images: Contains images used in the user interface (UI) of the project, such as logos, icons, and background images.
•	models: Stores 3D model files in .glb format that represent the 3D chatbot. This folder is essential for rendering the chatbot using Three.js.
3. src Folder:
This folder contains the core source code of the project. It is divided into three main subfolders:
•	components: This folder holds all reusable UI components that make up the building blocks of the application. Each component is designed to be modular, making it easier to maintain and reuse throughout different parts of the project.
•	hooks: This folder contains custom React hooks created for specific functionalities within the app. These hooks help to manage side effects, data fetching, and other reusable logic in a clean and maintainable way.
•	jotai: This folder is dedicated to managing the state of the application using the Jotai state management library. It includes atoms and logic that handle application-level state, such as user data and real-time chat interactions.
Project Structure Summary:
•	app/: Contains core files for app initialization and layout (app.js, layout.js, globals.css)
•	public/
o	fonts/: Font files for custom typography
o	images/: UI images (logos, icons, etc.)
o	models/: 3D model files for the chatbot (.glb)
•	src/
o	components/: Reusable UI components
o	hooks/: Custom React hooks
o	jotai/: State management logic using Jotai

This structure ensures modularity, scalability, and maintainability as the project progresses towards production. Certainly! Below is a concise summary of each component.

1. AiPlayer

Component Responsibilities:

Renders a 3D Canvas using the @react-three/fiber library to display a 3D experience, including a child component Experience for showcasing a 3D model.
Features interactive buttons, including one for starting or stopping audio recording, with the recording status managed by isRecording through Jotai.
Utilizes Jotai for state management, allowing shared states like isVideoMaximized to be accessible across the application.
Accesses current search parameters and path using usePathname and useSearchParams from next/navigation, enabling checks for parameters like isVideo.
2. ChatBox

Component Responsibilities:

Displays chat messages visually based on the sender (user or bot), using blue for user messages and gray for bot messages.
Adjusts font size dynamically using the fontValueAtom managed by Jotai.
Includes interactive buttons in bot messages for user engagement, such as like, dislike, copy text, and a speaker button for reading messages.

Connection Between Components and Props:

Receives a prop named info, containing text and sender to determine the message source.
Uses useAtom to access and modify the font size dynamically.
3. Experience

Component Responsibilities:

Utilizes ambientLight and directionalLight to illuminate the 3D scene, providing general and directional lighting.
Employs OrbitControls to allow users to manipulate their viewing angle, with rotation, zoom, and pan disabled.
Displays a 3D model using the Model component, positioned at specific coordinates.

Connection with Other Components:

Acts as a parent to the Model component, passing the model’s position through props.
Does not accept external props, with all settings defined internally.
4. Home

Component Responsibilities:

Establishes a WebSocket connection for real-time communication with the server and manages messages.
Controls UI states, hiding chat boxes during video conversations and managing the visibility of the sidebar based on component state.
Supports various conversation types, including video, audio, and text.

Connection with Components and Props:

Contains child components such as SideBar, ChatBox, MainInput, AiModel, and SuggestCard.
Passes necessary props to child components for state management.

API Interaction:

Connects to a WebSocket server for message handling and includes API routes for user registration and authentication.
5. MainInput

Component Responsibilities:

Captures user text and audio inputs, featuring a text field and a microphone button for voice recording.
Manages multiple states, including inputValue, isDisabled, isRecording, totalChats, and lastVideoUrl.
Interacts with the API using emit events to start conversations or send messages.

Connection with Props:

Receives props including textSubmited, updateStreamScrolling, and ref for WebSocket communication.

API Interaction:

Connects to the API via WebSocket for initiating conversations and sending messages.
6. Model

Component Responsibilities:

Loads a 3D model using useGLTF, which consists of various parts like body, eyes, hair, and clothes.
Manages animations using useAnimations, allowing for multiple animated actions.

Connection with Other Components:

Functions as part of higher-level components (e.g., Experience) and places the 3D model within the scene.
7. LinkedToggle

Component Responsibilities:

Checks the current state using the isVideo search parameter and toggles the state upon user interaction.
Creates a link using Link from Next.js that updates the URL to reflect the new state (video or non-video).
Styles the component using CSS to visually represent the current state.

Connection with Props:

Receives a hasPicture prop, which is not currently utilized but may be used for future enhancements.
Utilizes usePathname and useSearchParams hooks for dynamic URL information.

API Interaction:

Does not have a direct connection with the API but may require it in real scenarios for state management.


8. SideBar

Component Responsibilities:

Manages the sidebar state using Jotai for visibility, chat count, and font size.
Allows user interaction to open/close the sidebar and adjust font size using a range input.
Displays chat history as clickable links for navigation to specific chats.

Connection with Props:

Does not receive props directly but uses states managed by Jotai for functionality.
Utilizes useAtom to access and modify various states, triggering re-renders as needed.

API Interaction:

Does not directly connect to the API.



