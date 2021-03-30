import React from "react";
import Link from 'next/link'
import { createPopper } from "@popperjs/core";
import { useRouter } from 'next/router';
import { withAuthenticationRequired } from "@auth0/auth0-react";

export default withAuthenticationRequired(function NotificationDropdown(input) {
	const router = useRouter();
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
	const {event_id} = input;
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "left-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <a
        className="text-gray-600 py-1 px-3"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <i className="fas fa-ellipsis-v"></i>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
			  <Link href="#">
        <a
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800"
          }
          onClick={() => {
						router.push({
							pathname: '/admin/tables',
							query: { event_id: event_id },
						})
					}}
        >
          <i className="fas fa-edit"></i> Load
        </a>
				</Link>
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800"
          }
          onClick={(e) => e.preventDefault()}
        >
          <i className="fas fa-trash-alt"></i> Delete
        </a>
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800"
          }
          onClick={(e) => e.preventDefault()}
        >
          <i className="fas fa-external-link-alt"></i> Preview
        </a>
      </div>
    </>
  );
});
