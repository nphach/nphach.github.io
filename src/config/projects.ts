import imageAnalysis from '../assets/projects/imageanal.jpg'
import lr from '../assets/projects/lr.png'

export const projectsConfig = [
  {
    title: "currently working on: Kotoba Tag!",
    image: false,
    description: "a word game for Japanese language learning, based on shiritori",
    info: [
      "Implemented answer validation with 95% accuracy by training a language model on 4M+ text pairs.",
      "Deployed a React application with an XState machine that manages game states and core gameplay.",
      "Created a FastAPI endpoint to offload model inference and send predictions to game client.",
      "Implemented syllable matching logic in TypeScript according to game rules validated by Vitest unit tests.",
      "Detailed rules and project objectives in comprehensive README as a reference and design document."
    ],
    href: "https://github.com/nphach/kotoba-tag"
  },
  {
    title: "Image Analysis: Skin Detection",
    image: imageAnalysis,
    description: "an skin detection tool intended for dermatological applications, studying bias in AI applications",
    info: [
      "conducted research in color analysis for skin detection, color spaces and techniques in dynamic thresholding",
      "enhanced existing Python algorithm by refactoring for improved readability, ease of use and relevance; implemented asyncronous image processing for decreased runtime",
      "contributed to a dataset of skin-mask images used for testing",
      "created Metrics class to calculate algorithm performace, yielding a skin detection accuracy of ~98% on >1000 photos"
    ],
    href: "https://github.com/jawshipai/imageanal"
  },
  {
    title: "Concepts in Operating Systems and Computer Architecture",
    image: false,
    description: "coursework related to operating systems, embedded systems, computer architecture and organization",
    info: [
      "Huffman Compression: implemented a MinHeap to construct binary codes based on character frequency of input file and outputs compressed file accordingly",
      "Hamming Encoding and Decoding: developed RAID-2 encoding and decoding of based on Hamming(7,4) code, decoding algorithm able to fix up to one corrupted bit per nibble",
      "Memory Debugging Monitor Replication: wrote precise read/ write operations for a simulated embedded system, cross-compiling for memory protection analysis on Linux and SAPCC environments"
    ],
    href: false
  },
  {
    title: "nphach.github.io",
    image: false,
    description: "my personal webpage and portfolio",
    info: [
      "website written in TypeScript and hosted on GitHub pages",
      "implemented responsive design using Tailwind CSS and HTML",
      "used React hooks to create cursor-trailing animation in hero",
      "created contact form with zod validation and EmailJS API"
    ],
    href: "https://github.com/nphach/nphach.github.io"
  },
  {
    title: "AI Gesture Recognition for Naval Operations",
    image: lr,
    description: "a collaborative analysis of classification of naval airplane handling signals",
    info: [
      "used pandas and numpy libraries to preprocess hand coordinate data",
      "applied clustering algorithm to generate features for data classification",
      "compared and presented performance of various classification models in a collaborative Jupyter notebook"
    ],
    href: false
  },
  {
    title: "Resume",
    image: false,
    description: "a professional resume detailing education, background and skills",
    info: [
      "created a resume, typeset and stylized using LaTeX",
      "hosted on Github with corresponding compiled pdf",
      "quirk: the accent color is Boston Blue!"
    ],
    href: "https://github.com/nphach/resume"
  }
]