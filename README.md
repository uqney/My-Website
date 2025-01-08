# Panorama Viewer

### **Live Website:**

[360° Panorama Viewer](https://uqney.github.io/)  

GitHub: https://github.com/uqney/uqney.github.io

---

## **Overview**

The **Panorama Viewer** is a web application that allows users to upload and view panoramic images. It provides an interactive experience by letting users explore panoramic images with hotspot management. The application is designed for both desktop and mobile users, ensuring accessibility across devices.

---

## **Key Features**

### **1. Panorama Upload and View**

- Users can upload panoramic images directly from their local device or from the camera.
- View images in an interactive 360-degree format.
- The panoramas are displayed using a powerful image viewer with a smooth and immersive experience.

### **2. Hotspot Management**

- **Dashboard**: Users can manage the hotspots in a dedicated dashboard where all uploaded images are displayed.
- Each panorama can have clickable hotspots that show additional information when interacted with.
- Hotspot details (such as text and custom icons) can be configured in the dashboard.

### **3. Dynamic Image Management**

- Allows users to add new panoramas, mark them as active, and display them.
- Images are stored in the local storage, and their details (such as title, image URL, and hotspots) are saved for later access.

### **4. Dark Mode**

- Toggle between light and dark mode to suit the user's preference.

### **5. Responsive Design**

- Optimized for both desktop and mobile platforms.
- Ensures a consistent and seamless user experience on various devices.

---

## **HTML5 Features Used:**

- **Local Storage**:
    - Used to store and retrieve the uploaded panoramic images and their related details.
- **Canvas**:
    - Used for compressing the uploaded images before storing them.
- **Responsive Design**:
    - Uses `rem` and media queries to ensure compatibility across devices.

---

## **Technologies Used**

- **Frontend**: HTML5, CSS3, JavaScript
- **Libraries/Frameworks**:
    - **Material Icons**: For customizable icons, such as for the dark mode toggle.
    - **Pannellum Viewer**: For interactive 360-degree panoramic image viewing.
- **Local Storage**: For persistent data storage.

---

## **Browser Compatibility**

- Tested on:
    - **Mozilla Firefox (Desktop and Android)**

---

## **How to Use**

1. Open the [website](https://uqney.github.io/).
2. Upload a panorama image via the interface.
3. Once uploaded, interact with the image by clicking on the hotspots to view more information.
4. Use the **Dashboard** to manage hotspots and view an overview of all uploaded images.
5. Toggle **Dark Mode** for a different viewing experience.
