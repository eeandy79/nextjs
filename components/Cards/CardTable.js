import React from "react";
import PropTypes from "prop-types";
import Link from 'next/link';
import { useRouter } from 'next/router'

// components

import TableDropdown from "components/Dropdowns/TableDropdown.js";
import sample from "utils/sample_events.json"
import moment from "moment";

const MAX_TITLE_LENGTH = 40;

function RenderTableData(events, color) {
	return events.map((event, index) => {
		return OneRow(event, color, index);
	})
}

function OneRow(event, color, index) {
	const { title, start_datetime, end_datetime, desc } = event;
	var _title = title;
	//(title.length > MAX_TITLE_LENGTH)?title.substring(0,MAX_TITLE_LENGTH).concat("..."):title;
	var date = new moment(start_datetime);
	console.log(date.format('dddd DD-MMM-YYYY hh:mm:ss'));

	return (
      <tr key={event.id}>
          <th className="align-middle text-xs p-4 text-left flex items-center">
          <span
            className={
              "ml-3 font-bold " +
              +(color === "light" ? "text-gray-700" : "text-white")
            }
          >
		    {_title}
          </span>
        </th>
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
			{date.format('DD-MMM-YYYY hh:mm:ss')}
        </td>
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
          <i className="fas fa-circle text-green-500 mr-2"></i>{" "}
          completed
        </td>
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
          <div className="flex items-center">
            <span className="mr-2">100%</span>
            <div className="relative w-full">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-green-200">
                <div
                  style={{ width: "100%" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                ></div>
              </div>
            </div>
          </div>
        </td>
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-right">
          <TableDropdown event_id={event.id} />
        </td>
      </tr>
	)
}

function TableHeaderItem(title, color) {
	return (
      <th
      	className={
          "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
          (color === "light"
            ? "bg-gray-100 text-gray-600 border-gray-200"
            : "bg-gray-700 text-gray-300 border-gray-600")
        }
      >
	  {title}
	  </th>
	)
}

function EventList({ color }) {
  const router = useRouter();

  return (
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-gray-800 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="text-center flex justify-between">
              <h3 className="font-bold text-xl text-gray-800">Events</h3>
              <button
                className="bg-gray-800 active:bg-gray-700 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                type="button"
								onClick={() => {
									router.push({
										pathname: '/admin/tables',
										query: { create: true },
									})
								}}
              >
              <i className="fas fa-plus-circle"></i> Create
              </button>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
	            {TableHeaderItem("Title", color)}
	            {TableHeaderItem("Start Date", color)}
	            {TableHeaderItem("Status", color)}
	            {TableHeaderItem("Completion", color)}
	            {TableHeaderItem("", color)}
              </tr>
            </thead>
            <tbody>
	  			{RenderTableData(sample["events"], color)}
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default function CardTable({ color }) {
	return (
		<EventList color={color}/>
	)
}

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
