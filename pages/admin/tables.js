import React from "react";
import { useRouter } from 'next/router'
import { useState, useEffect } from "react";

// components

import CardTable from "components/Cards/CardTable.js";
import EventSetting from "components/Cards/EventSetting.js";

// layout for page

import Admin from "layouts/Admin.js";

import { withAuthenticationRequired } from "@auth0/auth0-react";

export default withAuthenticationRequired(function Tables() {
  const router = useRouter()
  const [query, setQuery] = useState(null);

	if (query) {
		console.log(Object.keys(query).length);
	}

	useEffect(() => {
		setQuery(router.query);
	}, [router]);

  return (
    <Admin>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
					{query && Object.keys(query).length ? (
						<EventSetting/>
					) : (
          	<CardTable/>
					)}
        </div>
      </div>
    </Admin>
  );
});
