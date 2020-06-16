import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import logo from '../../assets/logo.png';
import { headerTitle } from '../../constants';

function Navigation() {
    return (
        <div>
            <AppBar position="static" className="Navbar-App-Bar">
                <Toolbar className="Navbar-Toolbar">
                    <Typography className="Navbar-Typo">
                        <span className="Navbar-Title">{headerTitle}</span>
                    </Typography>
                    <img src={logo} className="Navbar-Logo" alt="logo" />
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Navigation;