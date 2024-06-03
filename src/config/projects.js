export const projectsConfig = [
  {
    title: "Image Analysis: Skin Detection",
    tech: "Python, matplotlib, numpy, OpenCV, TensorFlow",
    image: "/src/assets/image-analysis.jpg",
    description: [
      "collaborated within a team for my capstone course to develop a skin detection tool for dermatological applications",
      "cnhanced existing algorithm by refactoring code for improved readability and ease of use",
      "added support for asyncronous image processing for decreased runtime",
      "constructed a ground truth data set and implemented a Metrics class to calculate algorithm performance",
      "final results yielded a skin detection accuracy of ~98% over set of 1000 photos"
    ],
    href: false
  },
  {
    title: "Personal Portfilio Website",
    tech: "JavaScript, React, shadcn, HTML, Tailwind CSS",
    image: "/src/assets/inception.png",
    description: [
        "personal portfolio displaying personal information and experience",
        "responsive front-end adapts component appearance on mobile screens",
        "quirk: you're looking at it"
    ],
    href: "https://github.com/nphach/portfolio"
  },
  {
    title: "AI Gesture Recognition for Naval Operations",
    tech: "Python, numpy, pandas, scikit-learn",
    description: [
      "developed a gesture recognition system in Python to classify naval airplane handling signals, hosted on Google Colab for team collaboration",
      "used pandas and numpy for data preprocessing and KMeans custering to generate insight of gesture data",
      "displayed various models’ performance with ROC-AUC scores and confusion matrices, achieving second place in class presentation"
    ],
    image: "/src/assets/classification.jpg",
    href: false
  },
  {
    title: "Resume and Cover Letter",
    tech: "LaTeX",
    image: "/src/assets/resume.jpg",
    description: [
      "personal resume and cover letter using LaTeX typesetting",
      "includes Education, Projects and Work Experience sections with relevant subsections",
      "hosted on Github with the corresponding compiled pdf",
      "quirk: the accent color is Boston Blue!"
    ],
    href: "https://github.com/nphach/resume"
  },
  {
    title: "Huffman Compression + Hamming Encoding, Decoding",
    tech: "C, getopt.h, Makefile",
    image: "",
    description: [
      "bit manipulation projects, focusing on string/ bit processing and memory management",
      "constructed Huffman code based on character frequencies and encodes the file accordingly, implementing a Min Heap",
      "developed RAID-2 encoding and decoding of text based on Hamming(7, 4) code"
    ],
    href: false
  },
  {
    title: "Memory Debugging Monitor Replication",
    tech: "C, Assembly",
    image: "",
    description: [
      "developed memory management functions for a simulated embdedded system, enabling precise read/write operations to memory addresses",
      "supports cross compilation for memory protection analysis on Linux and SAPC environments"
    ],
    href: false
  }
]