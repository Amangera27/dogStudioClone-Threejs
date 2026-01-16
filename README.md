# 🐕 Dog Studio Clone - Three.js

A stunning 3D interactive web experience featuring a dynamic dog model with custom shader effects, built with Three.js and React Three Fiber.

![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)

## ✨ Features

### 🎨 Advanced Shader Effects

- **Custom Matcap Material Blending**: Seamless transitions between multiple matcap textures
- **Dynamic Texture Switching**: Interactive material changes on hover with smooth GSAP animations
- **Position-Based Blending**: Sophisticated shader code for gradient transitions across the model
- **Synchronized Materials**: Both dog and branch models share synchronized texture transitions

### 🎬 Scroll-Based Animations

- **GSAP ScrollTrigger Integration**: Smooth scroll-driven animations
- **3D Model Transformations**: Dynamic rotation, position, and scale changes
- **Multi-Section Timeline**: Coordinated animations across multiple page sections

### 🖱️ Interactive Elements

- **Hover Effects**: Material changes triggered by hovering over project titles
- **Background Image Transitions**: Dynamic background switching based on user interaction
- **Responsive Design**: Optimized for various screen sizes

### 🎭 Visual Polish

- **Normal Maps**: Enhanced surface detail on both dog and branch models
- **Custom Matcap Library**: 20 different matcap textures for varied visual styles
- **Optimized Rendering**: ReinhardToneMapping and SRGB color space for accurate colors

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/Amangera27/dogStudioClone-Threejs.git
cd dogStudioClone-Threejs
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Built With

- **[Three.js](https://threejs.org/)** - 3D graphics library
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
- **[React Three Drei](https://github.com/pmndrs/drei)** - Useful helpers for React Three Fiber
- **[GSAP](https://greensock.com/gsap/)** - Professional-grade animation library
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling
- **[React](https://reactjs.org/)** - JavaScript library for building user interfaces

## 📁 Project Structure

```
dogStudioClone-Threejs/
├── public/
│   ├── models/
│   │   └── dog.drc.glb          # 3D dog model
│   ├── matcap/                   # Matcap texture library (20 textures)
│   ├── dog_normals.jpg           # Normal map for dog
│   ├── branches_normals.jpg      # Normal map for branches
│   ├── branches_diffuse.jpg      # Diffuse texture for branches
│   ├── background-l.png          # Background image
│   └── [project-images].png      # Project showcase images
├── src/
│   ├── components/
│   │   └── Dog.jsx               # Main 3D dog component with shaders
│   ├── App.jsx                   # Main application component
│   ├── global.css                # Global styles
│   └── main.jsx                  # Application entry point
└── package.json
```

## 🎨 Key Technical Highlights

### Custom Shader Implementation

The project features a custom `onBeforeCompile` shader modification that enables:

- Blending between two matcap textures using a progress uniform
- Smooth transitions with `smoothstep` function
- Position-based gradient effects using view position

### Material System

```javascript
// Dual matcap texture blending
const material = useRef({
  uMatcap1: { value: texture1 },
  uMatcap2: { value: texture2 },
  uProgress: { value: 1.0 },
});
```

### Animation Pipeline

- **ScrollTrigger**: Scroll-based 3D transformations
- **GSAP Timelines**: Coordinated multi-property animations
- **Event-Driven**: Interactive material transitions on user input

## 🎯 Interactive Sections

1. **Hero Section**: Animated text and 3D model introduction
2. **Projects Gallery**: Hover-triggered background and material changes
3. **Content Section**: Layered z-index design with 3D model integration
4. **Footer Section**: Additional content area

## 🎨 Matcap Textures

The project includes 20 different matcap textures mapped to various project interactions:

- `mat-2`: Default dog material
- `mat-8`: Navy Pier & Kennedy Center
- `mat-9`: MSI Chicago
- `mat-10`: KIKK Festival
- `mat-12`: Phone project
- `mat-13`: Royal Opera
- `mat-19`: Tomorrowland

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- Inspired by [Dog Studio](https://dogstudio.co/)
- Three.js community for excellent documentation
- GSAP for powerful animation tools
- React Three Fiber team for the amazing React integration

## 📧 Contact

**Aman Gera**

- GitHub: [@Amangera27](https://github.com/Amangera27)

---

⭐ If you found this project helpful, please consider giving it a star!
