export const projectsConfig = [
    {
      title: "Resume and Cover Letter",
      tech: "LaTeX",
      image: "/assets/resume.jpg",
      description: [
        "personal resume and cover letter using LaTeX typesetting",
        "includes Education, Projects and Work Experience sections with relevant subsections",
        "hosted on Github with the corresponding compiled pdf",
        "quirk: the accent color is Boston Blue!"
      ],
      href: "https://github.com/nphach/resume"
    },
    {
      title: "Image Analysis: Skin Detection",
      tech: "Python, matplotlib, numpy, OpenCV, TensorFlow",
      image: "/assets/image-analysis.jpg",
      description: [
        "collaborated within a team for my capstone course to develop a skin detection tool for dermatological applications",
        "enhanced existing algorithm by refactoring code for improved readability and ease of use",
        "added support for asyncronous image processing for decreased runtime",
        "constructed a ground truth data set and implemented a Metrics class to calculate algorithm performance",
        "final results yielded a skin detection accuracy of ~98% over set of 1000 photos"
      ],
      href: false
    },
    {
      title: "Personal Portfilio Website",
      tech: "JavaScript, React, shadcn, HTML, Tailwind CSS",
      image: "/assets/inception.png",
      description: [
          "personal portfolio displaying personal information and experience",
          "responsive front-end adapts component appearance on mobile screens",
          "quirk: you're looking at it"
      ],
      href: "https://github.com/nphach/nphach.github.io"
    },
    {
      title: "AI Gesture Recognition for Naval Operations",
      tech: "Python, numpy, pandas, scikit-learn",
      description: [
        "developed a gesture recognition system in Python to classify naval airplane handling signals, hosted on Google Colab for team collaboration",
        "used pandas and numpy for data preprocessing and KMeans custering to generate insight of gesture data",
        "displayed various models’ performance with ROC-AUC scores and confusion matrices, achieving second place in class presentation"
      ],
      image: "/assets/classification.jpg",
      href: false
    },
    {
      title: "Concepts in Operating Systems and Computer Architechture",
      tech: "C, VMWare, Assembly, getopt.h, Makefile",
      image: "",
      description: [
        "various coursework related to operating systems, embedded systems, computer architecture and organization",
        "Huffman Compression: implemented a MinHeap to construct binary codes based on character frequency of input file and outputs compressed file accordingly",
        "Hamming Encoding and Decoding: developed RAID-2 encoding and decoding of based on Hamming(7,4) code, decoding algorithm able to fix up to one corrupted bit per nibble",
        "Memory Debugging Monitor Replication: wrote precise read/ write operations for a simulated embedded system, cross-compiling cor memory protection analysis on Linux and SAPCC environments"
      ],
      href: false
    }
  ]