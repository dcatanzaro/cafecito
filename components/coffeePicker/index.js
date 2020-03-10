import React from 'react';

import styles from './style.scss';

const CoffeePicker = ({ count, ...props }) => {
    const { setCount } = props;
    
    const add = () => setCount(count + 1)

    const subtract = () => setCount(count - 1)

    return (
        <div className={styles.controlsContainer}>
            <button className={styles.leftControl} onClick={subtract}>
                <img src="/imgs/minus-icon.svg" alt=""/>
            </button>
            <input value={ count } type="text"/>
            <button className={styles.rightControl} onClick={add}>
                <img src="/imgs/plus-icon.svg" alt=""/>
            </button>
        </div>
    );
};

export default CoffeePicker;