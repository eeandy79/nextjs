import React from "react";

// components

import EventSetting from "components/Cards/EventSetting.js";
import CardProfile from "components/Cards/CardProfile.js";

// layout for page

import Admin from "layouts/Admin.js";

import { withAuthenticationRequired } from "@auth0/auth0-react";

export default withAuthenticationRequired(function Settings() {
  return (
    <Admin>
      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <EventSetting/>
        </div>
      </div>
    </Admin>
  );
});
