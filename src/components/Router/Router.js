import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Fade } from 'react-bootstrap';
import * as Pages from '../../pages';

function Router() {
	return(
        <Fade in={true} appear={true}>
            <div className="App-Page">
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" render={() => <Pages.MainPage />} />
                        <Route render={(props) => <Pages.NotFoundPage {...props} />} />
                    </Switch>
                </BrowserRouter>
            </div>
        </Fade>
	)
}

export default Router;