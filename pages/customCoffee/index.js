import React, { Component } from 'react';

import CoffePicker from '../../components/coffeePicker';

import styles from './style.scss';

const COFFEE_PRICE = 50;

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
        count: 1
    }

    setCount = (value) => {
        this.setState({
            count: value < 1 ? 1 : value
        })
    }

    render() {
        const { count } = this.state;
        
        return (
            <div className={styles.main}>
                <div className={styles.modalContainer}>
                    <RedirectIcon  url="/" />
                    
                    <ProfileImg imgSrc="https://avatars2.githubusercontent.com/u/43894343?s=460&v=4" />

                    <h1 className={styles.title}>Gracias por escuchar</h1>
                    <h3 className={styles.description}>Ayudame con un cafe ☕️!</h3>

                    <CoffePicker count={count} setCount={this.setCount} />

                    <input className={styles.input} placeholder="Nombre o @Twitter (opcional)" type="text"/>
                    <button className={styles.submit}>Invitame 1 café (${ count * COFFEE_PRICE })</button>
                </div>
            </div>
        );
    }
}

export default CustomCoffee;