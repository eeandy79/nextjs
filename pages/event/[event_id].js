import React, { useReducer, useState, useEffect } from "react";
import { useRouter } from "next/router";

// components
import Navbar from "components/Navbars/OneClickNavbar.js";
import Footer from "components/Footers/Footer.js";
import ReactHtmlParser from "react-html-parser";
import moment from "moment";
import { LoadingOverlay, Loader } from "react-overlay-loader";
import 'react-overlay-loader/styles.css';
import { useCookies } from "react-cookie";

const axios = require('axios');

const formReducer = (state, event) => {
  if (event.reset) {
    return {
      passcode: '',
      name: '',
      'terms': false,
    }
  }
  return {
    ...state,
      [event.name]: event.value
  }
}

export default function EventPage() {
  const [iFrame, setIFrame] = useState("");
  const [editor, setEditor] = useState(null);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [content, setContent] = useState(null);
  const [eventID, setEventID] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useReducer(formReducer, {});
  const [hasPasscode, setHasPasscode] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [hasCustomization, setHasCustomization] = useState(false);
  const [customizationCtx, setCustomizationCtx] = useState(null);
  const [isEventLoaded, setIsEventLoaded] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
  const router = useRouter();

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);

    var _url = "https://event.hermeslive.com/events/" + eventID + "/validate";
    axios.post(_url, {
      passcode: formData["passcode"]
    }).then(response => {
      var data = response.data.data
      console.log(data)

      setTimeout(() => {
        setSubmitting(false);
        setFormData({reset:true});
        setHasToken(true);

        let expires = new Date()
        expires.setTime(expires.getTime() + (60 * 1000))
        setCookie("accessToken", data.token, {
          path: "/",
          expires: expires,
          sameSite: true,
        })

        }, 1000)
    }).catch(error => {
      console.log(error)
    });

     //alert('You have submitted the form.')
  }

  const handleChange = event => {
    const isCheckbox = event.target.type === 'checkbox';
    setFormData({
      name: event.target.name,
      value: isCheckbox ? event.target.checked : event.target.value,
    });
  }

  useEffect(() => {
    const { event_id } = router.query; // todo: handle eventid not valid
    console.log(event_id)
    if (event_id) {
      var _url = "https://event.hermeslive.com/events/" + event_id;
      setEventID(event_id);
      axios.get(_url)
        .then(response => {
          var _e = response.data.data.event
          console.log(_e)
          setTitle(_e["title"]);
          setStartTime(moment(_e["actualStartDatetime"]));
          setEndTime(moment(_e["actualEndDatetime"]));
          setIFrame(_e["embedHtml"]);
          setContent(_e["description"]);
          setHasPasscode(_e["hasPasscode"]);

          if (cookies.accessToken) {
            //console.log("accessToken: " + cookies.accessToken)
            setHasToken(true);
          } else {
            setHasToken(false);
          }

          if (_e["withCustomization"]) {
            setHasCustomization(_e["withCustomization"]);
          } else {
            setIsEventLoaded(true);
          }

        })
        .catch(error => {
            console.log(error)
        });
    }
    if (hasCustomization) {
      var _url = "https://event.hermeslive.com/events/" + event_id + "/customization";
      axios.get(_url)
        .then(response => {
          var _c = response.data.data
          console.log(_c)
          setCustomizationCtx(_c)
          setIsEventLoaded(true);
        })
        .catch(error => {
            console.log(error)
        });
    }
  },[router, hasCustomization]);

  if (!isEventLoaded || submitting) {
    return (
      <>
        <Loader loading text="Loading ..."/>
      </>
    )
  }

  if (hasPasscode && !hasToken) {
    var layout = customizationCtx.customization.passcodePage
    var config = customizationCtx.customization.passcodePageConfig
  return (
    <>
    <main
      className="absolute bg-blue-400 w-full h-full bg-no-repeat bg-center bg-cover"
      style={{backgroundImage: layout["--pc-bg-url"], backgroundColor: layout["--pc-bg-color"]}}
    >
      {
        submitting &&
        <div>
          u are submitting the following:
          <ul>
          {Object.entries(formData).map(([name, value]) => (
                <li key={name}><strong>{name}</strong>:{value.toString()}</li>
                ))}
          </ul>
        </div>
      }
    <div className="flex flex-col justify-center">
    <form className="md:w-3/4 sm:w-full px-4 py-4" onSubmit={handleSubmit} onChange={handleChange}>

        <div>
          <img style={{height:layout["--pc-logo-height"]}} src={config["logoUrl"]} />
        </div>
        <div>
          <h4 style={{color:layout["--pc-title-color"]}} className="text-3xl font-semibold pb-4">
            {title}
          </h4>
        </div>
        <div style={{color:layout["--pc-label-color"]}} dangerouslySetInnerHTML={{ __html: config["label"]}} />
        <div className="pt-4">
          <input
            name="passcode"
            type="text"
            style={{maxWidth:"300px", paddingLeft: "10px", padding:"5px", color:layout["--pc-input-color"], textTransform:"uppercase", letterSpacing:"4px"}}
            className="px-3 py-3 placeholder-gray-300 text-gray-700 bg-white rounded-lg text-4xl shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
            value={formData.passcode || ''}
            onChange={()=>{}}
          />
        </div>
        <div className="pt-4">
          <button
            style={{color:layout["--pc-label-color"],backgroundColor:layout["--pc-button-color"],minWidth:"200px"}}
            className="bg-gray-800 active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:bg-red-700 hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="submit"
            >
            {config["buttonText"]}
          </button>
        </div>
      </form>
      </div>
    </main>
    </>
  )
  }

  var logo_url= customizationCtx.customization.customLogo.logoUrl;
  return (
	<>
    <Navbar event_id={eventID} have_protection={hasPasscode} logo_url={logo_url}/>
    <main>
    <div className="relative pt-16 pb-32 flex flex-col content-center items-center min-h-screen-75">
      <div className="container px-4">
        <div className="flex flex-col lg:flex-row py-4">
          <div className="flex w-full lg:w-8/12">
            <div className="video">
              { ReactHtmlParser(iFrame) }
            </div>
          </div>
          <div className="flex lg:w-4/12 bg-black">
            <div className="flex flex-col">
              <div className="flex flex-row px-3 mt-3">
                {
                  (startTime && endTime) ?
                  (
                    <>
                    <div className="start-date-label mr-1">
                      <span className="day">{startTime.format("MMM")}</span>
                      <span className="day">{startTime.format("DD")}</span>
                    </div>
                    <div className="text-white text-sm mt-1 mr-1">
                      {startTime.format("HH:mm")} -
                    </div>
                    {
                      // show date bubble if start != end date
                      startTime.isSame(endTime, 'day') ?
                      (""):
                      (
                        <div className="start-date-label mr-1">
                          <span className="day">{endTime.format("MMM")}</span>
                          <span className="day">{endTime.format("DD")}</span>
                        </div>
                      )
                    }
                    <div className="text-white text-sm mt-1">
                      {endTime.format("HH:mm")}
                    </div>
                    </>
                  ):("")
                }
                </div>
              <div>
                <h1 className="text-white text-lg px-3 py-3 font-bold">
                  {title}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          {
            isEventLoaded ? (
              <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
            ):("")
          }
        </div>
      </div>
    </div>
    </main>
    <Footer />
    </>
  );
}
