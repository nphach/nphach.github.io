import {useState, useEffect} from "react";
import {Nav, Navbar, Container} from "react-bootstrap";
import logo from "../assets/img/logo.png";
import githubLogo from "../assets/img/githubLogo.png";
import linkedinLogo from "../assets/img/linkedinLogo.png";

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
        if (window.scrollY > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  }
  
  return (
    <Navbar expand="lg" className={scrolled ? "scrolled" : ""}>
      <Container>
        <Navbar.Brand href="#home">
            <img src={logo} alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
            <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home" className={activeLink === "home" ? "active-navbar-link" : "navbar-link"} onClick={() => onUpdateActiveLink("home")}>home</Nav.Link>
            <Nav.Link href="#about" className={activeLink === "about" ? "active-navbar-link" : "navbar-link"} onClick={() => onUpdateActiveLink("about")}>about</Nav.Link>
            <Nav.Link href="#projects" className={activeLink === "projects" ? "active-navbar-link" : "navbar-link"} onClick={() => onUpdateActiveLink("projects")}>projects</Nav.Link>
          </Nav>
          <span className="navbar-text">
            <div className="social-icon">
                <a href="https://www.github.com/nphach/"><img src={githubLogo} alt="" /></a>
                <a href="https://www.linkedin.com/in/nphach/"><img src={linkedinLogo} alt="" /></a>
            </div>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}