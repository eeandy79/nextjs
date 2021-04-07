import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import IndexNavbar from "../components/Navbars/IndexNavbar.js";
import Landing from "./landing.js"
import Dashboard from "./admin/dashboard.js";
import EventPage from "./eventpage.js"
import { useAuth0 } from "@auth0/auth0-react";
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";


function Index() {
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  return (
	  <>
	  <IndexNavbar fixed />
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
            <Nav className="d-none d-md-block" navbar>
              {!isAuthenticated && (
                <NavItem>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    className="btn-margin"
                    onClick={() => loginWithRedirect()}
                  >
                    Login
                  </Button>
                </NavItem>
			  )}
	          {isAuthenticated  && (
                <NavItem>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    className="btn-margin"
				    onClick={() => logoutWithRedirect()}
                  >
                    Logout
                  </Button>
                </NavItem>
              )}
           </Nav>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Andy Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>
    </div>
		</>
  )
}

export default function Home() {
  const {
    user,
    isLoading,
    isAuthenticated,
  } = useAuth0();

  const router = useRouter();
  var query = router.query;
  if (query && query.hasOwnProperty("event_id")) {
    return (
      <>
      <EventPage event_id={query["event_id"]}/>
      </>
    )
  }


  if (!isLoading) {
    if (isAuthenticated) {
      return <Dashboard/>
    } else {
      return (
       <>
       <Landing/>
       </>
      )
    }
  }
  return <div>Loading...</div>
}

