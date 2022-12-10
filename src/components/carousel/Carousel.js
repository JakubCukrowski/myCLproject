import Carousel from 'react-bootstrap/Carousel';

function UncontrolledExample() {
    return (
        <Carousel>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={require("./images/pexels-cottonbro-studio-4101143.jpg")}
                    alt="First slide"
                />
                <Carousel.Caption style={{
                    bottom: "10%",
                    left: "-40%"
                }}>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    <button className="btn">Dowiedz się więcej</button>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={require("./images/pexels-tima-miroshnichenko-5710953.jpg")}
                    alt="Second slide"
                />

                <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <button className="btn">Dowiedz się więcej</button>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={require("./images/pexels-yan-krukov-4458261.jpg")}
                    alt="Third slide"
                />

                <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                    </p>
                    <button className="btn">Dowiedz się więcej</button>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default UncontrolledExample;