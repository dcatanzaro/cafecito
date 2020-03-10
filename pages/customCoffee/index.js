import React, { Component } from 'react';
import axios from 'axios';

import CoffePicker from '../../components/coffeePicker';

import styles from './style.scss';

const COFFEE_PRICE = 50;


/* Mini components */
const ProfileImg = ({ imgSrc }) => (
    <div className={styles.profileImg} >
        <img src={imgSrc} alt="profile-img"/>
    </div>
);

const RedirectIcon = ({ url }) => (
    <a href={url} className={styles.redirect}>
        <img src="/imgs/redirect-icon.svg" alt="redirect-icon"/>
    </a>
);


class CustomCoffee extends Component {
    state = {
        message: '',
        name: '',
        countCoffees: 1,
        loading: true
    }

    sendCoffee = async () => {
        const { name, message, countCoffees } = this.state;

        this.setState({
            loading: true
        });

        const url = `${process.env.URL}/api/send_coffee`;

        const result = await axios.post(url, {
            name,
            message,
            countCoffees: countCoffees || 1
        });

        window.location.href = result.data.mercadoPagoLink;
    };

    setCount = (value) => {
        this.setState({
            countCoffees: value < 1 ? 1 : value
        })
    }

    handleFormChange = (e) => {
        this.setState({
            name: e.target.value
        });
    }

    render() {
        const { countCoffees, name } = this.state;
        
        return (
            <div className={styles.main}>
                <div className={styles.modalContainer}>
                    <RedirectIcon  url="/" />
                    
                    <ProfileImg imgSrc="https://avatars2.githubusercontent.com/u/43894343?s=460&v=4" />

                    <h1 className={styles.title}>Gracias por escuchar</h1>
                    <h3 className={styles.description}>Ayudame con un cafe ☕️!</h3>

                    <CoffePicker countCoffees={countCoffees} setCount={this.setCount} />

                    <input
                        className={styles.input} 
                        placeholder="Nombre o @Twitter (opcional)" 
                        value={name}
                        onChange={this.handleFormChange}
                        type="text"
                    />
                    <button 
                        className={styles.submit}
                        onClick={this.sendCoffee}
                    >
                        Invitame 1 café (${ countCoffees * COFFEE_PRICE })
                    </button>
                </div>
            </div>
        );
    }
}

export default CustomCoffee;