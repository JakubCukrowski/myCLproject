import Carousel from 'react-bootstrap/Carousel';

function UncontrolledExample() {
    return (
        <Carousel>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={require("./images/pexels-cottonbro-studio-4098185.jpg")}
                    alt="First slide"
                />
                <Carousel.Caption>
                    <h3>Psychologia rozwojowa</h3>
                    <p>Koncentruje się na człowieku oraz na tym, jak zmienia się na przestrzeni życia.</p>
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
                    <h3>Psychologia społeczna</h3>
                    <p>
                        Trudni się badaniem wpływu uczestnictwa w grupie oraz związków z innymi ludźmi na zachowanie,
                        postawy i przekonania jednostki.
                        </p>
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
                    <h3>Psychologia dziecięca</h3>
                    <p>
                    Konsultacja zaburzeń psychicznych takich jak: 
                    lęki, smutek dziecka, nadruchliwość, agresja, nieposłuszeństwo, problemy wychowawcze.
                    </p>
                    <button className="btn">Dowiedz się więcej</button>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default UncontrolledExample;