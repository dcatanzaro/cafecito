import style from "./style.scss";

const Post = () => (
    <div className={style.postContainer}>
        <div className={style.post}>
            <p>
                Hola! Soy <strong>Damián Catanzaro</strong>, actualmente trabajo
                como Tech Lead en Digiventures, una startup FinTech.
            </p>

            <p>
                💻 Estoy hace más de 10 años en el mundo de sistemas,
                principalmente centrado en lo que es web, tanto desarrollo
                FrontEnd como BackEnd.
            </p>

            <p>
                A principio de este año me propuse hacer crecer mi perfil
                ayudando a la comunidad de sistemas, para esto creé un blog en
                donde estoy subiendo serie de tutoriales, ya sean desde 0 o
                avanzados, para todos los niveles.
            </p>

            <p>
                Blog:{" "}
                <a href="https://damiancatanzaro.com/blog/" target="_blank">
                    https://damiancatanzaro.com/blog/
                </a>
            </p>

            <p>
                Y además estoy en constante aporte en mi Twitter:{" "}
                <a href="https://twitter.com/DamianCatanzaro" target="_blank">
                    @DamianCatanzaro
                </a>{" "}
                dando una mano a quien necesite y creando nuevos proyectos
                OpenSources.
            </p>

            <p>
                <u>Algunos de los últimos proyectos creados:</u>
            </p>
            <p>
                <strong>Anon Q&A:</strong>{" "}
                <a href="https://anon.damiancatanzaro.com/" target="_blank">
                    https://anon.damiancatanzaro.com/
                </a>
            </p>
            <p>
                <strong>Calendar de Sistemas:</strong>{" "}
                <a href="https://damiancatanzaro.com/calendar" target="_blank">
                    https://damiancatanzaro.com/calendar
                </a>
            </p>

            <p>
                <strong>Y obvio, Cafecito ☕️!:</strong>{" "}
                <a href="https://cafecito.damiancatanzaro.com" target="_blank">
                    https://cafecito.damiancatanzaro.com/
                </a>
            </p>

            <p>
                Si querés ver, clonarte o aportar a algunos de estos proyectos,
                están todos en mi{" "}
                <a href="https://github.com/dcatanzaro">GitHub</a>.
            </p>

            <p>
                Si tenés ganas de darme una mano podés regalarme un café ☕️ y
                te lo super voy a agradecer! ❤️
            </p>
            <p>
                Y si querés podés dejar tu nombre y un mensaje para que quede
                guardado y sepa quien me está ayudando!
            </p>
        </div>
    </div>
);

export default Post;
