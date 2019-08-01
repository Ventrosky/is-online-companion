import * as React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom"

import * as routes from "./services/routes";
import { Menu } from "./menu";
import { CampaignSelection, Campaign, CampaignCharacterSelection, CampaignLog, CampaignCharacter } from "./pages";


export function Layout() {
    return <Router>
        <div className="min-h-screen flex items-stretch">
            <Menu />
            <div className="max-w-4xl w-full pl-4 pb-4">
                <Switch>
                    <Route exact path={routes.campaignSelectionRoute} component={CampaignSelection} />
                    <Route exact path={routes.campaignRouteTemplate} component={Campaign} />
                    <Route exact path={routes.campaignCharacterSelectionRouteTemplate} component={CampaignCharacterSelection} />
                    <Route exact path={routes.campaignLogRouteTemplate} component={CampaignLog} />
                    <Route exact path={routes.campaignCharacterRouteTemplate} component={CampaignCharacter} />
                </Switch>
            </div>
        </div>
    </Router>
}