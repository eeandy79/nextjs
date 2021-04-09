import React from "react";
import { useRouter } from 'next/router'

export default function callback() {
  const router = useRouter();
  if (router.query.hasOwnProperty("event_id")) {
    router.replace("event/" + router.query["event_id"]);
  }

  return (
      <div className="flex flex-wrap">
	  	Redirecting ...
	  </div>
  );
}
