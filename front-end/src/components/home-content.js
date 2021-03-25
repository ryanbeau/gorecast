import React from "react";
import hcbg from "../images/stock-market-display.jpg";

const HomeContent = () => (
  <div className="next-steps" style={{
    backgroundImage: `url(${hcbg})`,
    height: '60vh',
    //maxHeight: '100%',
    //maxWidth: '100%',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    opacity: '0.9',
    color: 'whitesmoke',
    textShadow: '1px 1px black',
    margin: 'auto'
  }}>
    <h2 className="text-center" style={{
      paddingTop: '10vh'
    }}>What can I do in Gorecast?</h2>

    <div className="row" style={{padding: '0 10vw 0 10vw'}}>
      <div className="col-md-5 mb-4">
        <h6 className="mb-3">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://example.com"
          >
            <i className="fas fa-link mr-2" />
            Create and add items to a budget
          </a>
        </h6>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </div>

      <div className="col-md" />

      <div className="col-md-5 mb-4">
        <h6 className="mb-3">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://example.com"
          >
            <i className="fas fa-link mr-2" />
            Set and track savings goals
          </a>
        </h6>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </p>
      </div>
    </div>

    <div className="row" style={{padding: '0 10vw 0 10vw'}}>
      <div className="col-md-5 mb-4">
        <h6 className="mb-3">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://example.com"
          >
            <i className="fas fa-link mr-2" />
            Generate easy to read reports
          </a>
        </h6>
        <p>
          Ultrices neque ornare aenean euismod elementum nisi. Aliquam ultrices
          sagittis orci a scelerisque purus semper eget duis. Sed enim ut sem
          viverra aliquet eget sit amet. Dui accumsan sit amet nulla facilisi
          morbi tempus iaculis urna.
        </p>
      </div>

      <div className="col-md" />

      <div className="col-md-5 mb-4">
        <h6 className="mb-3">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://example.com"
          >
            <i className="fas fa-link mr-2" />
            Track spending across custom categories
          </a>
        </h6>
        <p>
          Cursus mattis molestie a iaculis at erat pellentesque adipiscing.
          Mauris pellentesque pulvinar pellentesque habitant morbi tristique.
          Diam sollicitudin tempor id eu nisl nunc mi. Euismod lacinia at quis
          risus sed vulputate odio ut. Etiam erat velit scelerisque in dictum
          non consectetur.
        </p>
      </div>
    </div>
  </div>
);

export default HomeContent;
