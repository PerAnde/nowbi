import React from 'react'

// CSS
import styles from "./Theme.module.scss"

// Importando Icones
import * as PiIcons from 'react-icons/pi'

export const Theme = () => {

    const setDarkMode = () => {
        document.querySelector("body").setAttribute("data-theme", "dark")
        localStorage.setItem("selectedTheme", "dark")
    }

    const setLightMode = () => {
        document.querySelector("body").setAttribute("data-theme", "light")
        localStorage.setItem("selectedTheme", "light")
    }

    const selectedTheme = localStorage.getItem("selectedTheme");

    if (selectedTheme === "dark") {
        setDarkMode();
    }

    const toggleTheme = (e) => {
        if (e.target.checked) setDarkMode();
        else setLightMode()
    }

    return (
        <div className={styles.boxBtnTheme}>
            <input className={styles.darkModeInput} type="checkbox" id="darkmode-toggle" onChange={toggleTheme} defaultChecked={selectedTheme === "dark"} />
            <label className={styles.darkModeLabel} htmlFor="darkmode-toggle">
                <PiIcons.PiSun className={styles.light} />
                <PiIcons.PiMoon className={styles.dark} />
            </label>
        </div>
    );
}
