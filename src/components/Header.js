import {Container, Row, Col} from "react-bootstrap";
import header from "../assets/img/header.png";

export const Header = () => {
  return (
    <section className="header" id="home">
      <Container>
        <Row className = "align-items-center">
          <Col xs={12} md={6} xl={7}>
            <h1>Hi, I'm Nikki,</h1>
            <p>a graduate from the University of Massachusetts Boston<br />
            with a BSc in Computer Science. Currently, I'm looking to launch<br />
            my career in the software engineering industry.</p>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <img src={header} alt="header img" />
          </Col>
        </Row>
      </Container>
    </section>
  )
}