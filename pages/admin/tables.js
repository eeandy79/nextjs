import React from "react";

// components

import CardTable from "components/Cards/CardTable.js";

// layout for page

import Admin from "layouts/Admin.js";

import { withAuthenticationRequired } from "@auth0/auth0-react";

export default withAuthenticationRequired(function Tables() {
  return (
    <Admin>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable />
        </div>
      </div>
    </Admin>
  );
});
